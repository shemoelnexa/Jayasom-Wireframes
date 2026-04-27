// Vercel Edge Function — receives chat messages, calls Anthropic SDK,
// returns the generated wireframe HTML + a short text confirmation.
// Runs on Vercel's edge runtime (60s timeout on Hobby).

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import {
  skill_md,
  design_tokens_css,
  component_library_html,
  section_patterns_md,
  content_inference_md,
  output_template_html,
} from '../src/lib/skill-content';
import { detectContentCues, buildSystemPrompt } from '../src/lib/smart-skill-loader';

export const config = {
  runtime: 'edge',
  // 60s on Hobby is plenty for cold cached generation
};

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(200_000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(30),
  model: z.enum(['claude-sonnet-4-6', 'claude-haiku-4-5-20251001']).optional(),
}).strict();

// Simple in-memory rate limiter — sufficient for a single edge instance / internal tool.
// Map of IP -> array of request timestamps within the last hour.
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_PER_HOUR ?? '30', 10);
const requestLog = new Map<string, number[]>();

function checkRateLimit(ip: string): { ok: boolean; retryAfterMin?: number } {
  const now = Date.now();
  const oneHourAgo = now - 3600_000;
  const history = (requestLog.get(ip) ?? []).filter((t) => t > oneHourAgo);
  if (history.length >= RATE_LIMIT) {
    const oldest = history[0];
    const retryAfterMin = Math.ceil((oldest + 3600_000 - now) / 60_000);
    return { ok: false, retryAfterMin };
  }
  history.push(now);
  requestLog.set(ip, history);
  return { ok: true };
}

function extractHtmlAndConfirmation(response: string): { html: string; confirmation: string } {
  const docStartMatch = response.match(/<!doctype/i);
  const docEndMatch = response.match(/<\/html>/i);
  if (!docStartMatch || !docEndMatch || docStartMatch.index === undefined) {
    return { html: '', confirmation: response };
  }
  const docStart = docStartMatch.index;
  const docEnd = response.toLowerCase().lastIndexOf('</html>');
  const docEndPos = docEnd + '</html>'.length;
  const html = response.slice(docStart, docEndPos);
  const confirmation = (response.slice(0, docStart) + response.slice(docEndPos)).trim();
  return { html, confirmation };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method-not-allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Vercel sets x-real-ip to the verified client IP. Fall back to the rightmost
  // (most recent / trusted) IP from x-forwarded-for, never the first (which is
  // attacker-controlled).
  const ip =
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ??
    'unknown';
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return new Response(JSON.stringify({
      error: 'rate-limit',
      retryAfterMin: rate.retryAfterMin,
    }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid-json' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({
      error: 'invalid-request',
      detail: parsed.error.flatten(),
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { messages, model = process.env.DEFAULT_MODEL ?? 'claude-sonnet-4-6' } = parsed.data;

  // Build system prompt from the latest user message's content cues.
  const latestUser = [...messages].reverse().find((m) => m.role === 'user');
  const cues = detectContentCues(latestUser?.content ?? '');
  const systemPrompt = buildSystemPrompt(
    {
      skillMd: skill_md,
      designTokensCss: design_tokens_css,
      componentLibraryHtml: component_library_html,
      sectionPatternsMd: section_patterns_md,
      contentInferenceMd: content_inference_md,
      outputTemplateHtml: output_template_html,
    },
    cues
  );

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'config', detail: 'ANTHROPIC_API_KEY not set' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    // Add cache_control to the SECOND-TO-LAST user message so conversation
    // history through that point is cached. The latest message stays uncached
    // (it's the new content for this turn).
    const apiMessages = messages.map((m, i, arr) => {
      // Find the second-to-last user message and add a cache breakpoint there
      const userIndices = arr.map((msg, idx) => msg.role === 'user' ? idx : -1).filter((idx) => idx !== -1);
      const cacheTargetIdx = userIndices.length >= 2 ? userIndices[userIndices.length - 2] : -1;
      if (i === cacheTargetIdx) {
        return {
          role: m.role,
          content: [{ type: 'text' as const, text: m.content, cache_control: { type: 'ephemeral' as const } }],
        };
      }
      return { role: m.role, content: m.content };
    });

    const result = await anthropic.messages.create({
      model,
      max_tokens: 16000,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: apiMessages as Parameters<typeof anthropic.messages.create>[0]['messages'],
    });

    const text = result.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');

    const { html, confirmation } = extractHtmlAndConfirmation(text);

    if (!html) {
      return new Response(JSON.stringify({
        error: 'malformed-response',
        confirmation,
      }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      confirmation: confirmation || 'Wireframe generated.',
      html,
      usage: result.usage,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    const error = err as Error & { status?: number };
    const status = error.status ?? 500;
    let category = 'unknown';
    if (status === 401 || status === 403) category = 'auth';
    else if (status === 429) category = 'anthropic-rate-limit';
    else if (status === 529 || status === 503) category = 'anthropic-overloaded';
    else if (error.message?.includes('budget')) category = 'budget-exhausted';

    return new Response(JSON.stringify({
      error: 'generation-failed',
      category,
      detail: error.message,
    }), { status, headers: { 'Content-Type': 'application/json' } });
  }
}
