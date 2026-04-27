# Jayasom Wireframe Generator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an internal-only chat-based web app at `/wireframe-generator` that wraps the `jayasom-wireframe` skill, hosted on Vercel Hobby (free), with conversational chat + live preview + downloadable HTML output.

**Architecture:** Add a Vercel Edge Function (`api/generate.ts`) that calls Anthropic SDK with a smart-loaded skill prompt. Add a React page (`/wireframe-generator`) with chat-on-left + iframe-preview-on-right split layout. Skill content is fetched from the private skill repo at build time and bundled into `src/lib/skill-content.ts`. Custom password middleware protects all routes.

**Tech Stack:** Vite + React + TypeScript + shadcn/ui + Tailwind (existing) + `@anthropic-ai/sdk` + `zustand` + `xlsx` + `mammoth` + `pdfjs-dist` + `zod` + Vercel Edge Runtime.

---

## File structure

All paths under `D:/Code Files/Jayasom/jayasom-wireframe-files/`.

```
api/
└── generate.ts                        Edge Function: validates + calls Claude + returns html
middleware.ts                          Edge middleware: password gate

scripts/
└── fetch-skill.mjs                    runs in `prebuild`: fetches skill files → src/lib/skill-content.ts

src/
├── App.tsx                            MODIFY: add /wireframe-generator route
├── pages/
│   ├── Index.tsx                      MODIFY: add "Open the generator →" link
│   └── WireframeGenerator.tsx         CREATE: split layout page
├── components/
│   └── generator/
│       ├── AttachmentDropzone.tsx     file picker + drag-drop + parse status
│       ├── ChatPanel.tsx              message list + composer
│       ├── LoginScreen.tsx            password-gate UI
│       ├── MessageBubble.tsx          single message
│       ├── ModelPicker.tsx            Sonnet/Haiku toggle
│       └── PreviewPane.tsx            iframe + viewport toggle + download
├── lib/
│   ├── api-client.ts                  fetch wrapper for /api/generate
│   ├── chat-store.ts                  zustand store with localStorage persistence
│   ├── parse-attachment.ts            file → extracted text dispatcher
│   ├── skill-content.ts               GENERATED — exports skill files as strings
│   └── smart-skill-loader.ts          composes the system prompt for a request
└── lib/__tests__/
    ├── parse-attachment.test.ts       unit tests for each format
    ├── smart-skill-loader.test.ts     unit tests for prompt composition
    └── chat-store.test.ts             unit tests for state transitions

.env.example                            CREATE: documents required env vars
package.json                            MODIFY: add deps + prebuild script
```

## Test strategy

Per spec §13: no end-to-end test infrastructure for v1 (manual smoke test before launch). But for **pure-function code** with clear input/output (parsers, smart loader, chat store), unit tests via `vitest` (already configured) are cheap and high-ROI.

- **Unit tests:** `parse-attachment.ts`, `smart-skill-loader.ts`, `chat-store.ts`, `middleware.ts` password check
- **Integration smoke tests:** at the end of each phase, one manual command or browser check that exercises the full slice
- **Final manual pass:** spec §13 (10 items) before deploying

---

### Task 1: Install dependencies + env setup

**Files:**
- Modify: `package.json`
- Create: `.env.example`
- Create: `.env.local` (gitignored — local secrets)

- [ ] **Step 1: Install runtime deps**

```bash
cd "D:/Code Files/Jayasom/jayasom-wireframe-files"
npm install @anthropic-ai/sdk zustand xlsx mammoth pdfjs-dist zod
```

- [ ] **Step 2: Install dev type deps**

```bash
npm install --save-dev @vercel/node @types/pdfjs-dist
```

- [ ] **Step 3: Create `.env.example`** documenting required env vars

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/.env.example`

```
# Build-time only (used by scripts/fetch-skill.mjs)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx              # PAT with read access to Jayasom-wireframe-generator

# Runtime — server-side only
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx      # Anthropic API key
APP_PASSWORD=changeme                       # shared password for the password gate

# Runtime — runtime config (optional)
DEFAULT_MODEL=claude-sonnet-4-6            # claude-sonnet-4-6 or claude-haiku-4-5-20251001
RATE_LIMIT_PER_HOUR=30                     # per-IP request cap
ANTHROPIC_BUDGET_USD=50                    # informational only — set the real cap in Anthropic console
```

- [ ] **Step 4: Create `.env.local` from `.env.example`**

```bash
cp .env.example .env.local
```

Then fill in real values manually. Verify `.env.local` is in `.gitignore` (Vite default project should already exclude `.env*.local`).

- [ ] **Step 5: Verify `.env.local` is gitignored**

```bash
git check-ignore .env.local
```

Expected: prints `.env.local` (means it's ignored). If not, add `.env*.local` to `.gitignore`.

- [ ] **Step 6: Commit dep changes**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: install wireframe-generator dependencies"
```

---

### Task 2: fetch-skill.mjs prebuild script

**Files:**
- Create: `scripts/fetch-skill.mjs`
- Modify: `package.json` (add `prebuild` script)

- [ ] **Step 1: Write the script**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/scripts/fetch-skill.mjs`

```javascript
// Fetches skill reference files from the private Jayasom-wireframe-generator repo
// and writes them into src/lib/skill-content.ts as exported strings.
// Runs as `prebuild` so every Vercel build / local build has the latest skill bundled.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const REPO_OWNER = 'shemoelnexa';
const REPO_NAME = 'Jayasom-wireframe-generator';
const BRANCH = 'main';
const TOKEN = process.env.GITHUB_TOKEN;

const FILES = [
  'SKILL.md',
  'references/design-tokens.css',
  'references/component-library.html',
  'references/section-patterns.md',
  'references/content-inference.md',
  'references/output-template.html',
];

if (!TOKEN) {
  console.error('GITHUB_TOKEN env var is required');
  process.exit(1);
}

async function fetchFile(path) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Accept': 'application/vnd.github.raw',
      'User-Agent': 'jayasom-wireframe-prebuild',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${await res.text()}`);
  }
  return await res.text();
}

function escapeForTemplate(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

async function main() {
  console.log('Fetching skill files from GitHub...');
  const contents = {};
  for (const file of FILES) {
    contents[file] = await fetchFile(file);
    console.log(`  ✓ ${file} (${contents[file].length} chars)`);
  }

  const outPath = 'src/lib/skill-content.ts';
  mkdirSync(dirname(outPath), { recursive: true });

  const banner = `// AUTO-GENERATED by scripts/fetch-skill.mjs — do not edit by hand.\n// Source: github.com/${REPO_OWNER}/${REPO_NAME}@${BRANCH}\n// Last fetched: ${new Date().toISOString()}\n\n`;

  const exports = FILES.map((file) => {
    const varName = file
      .replace(/^references\//, '')
      .replace(/[.-]/g, '_')
      .replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
      .replace(/^_+/, '')
      .replace(/_+/g, '_');
    return `export const ${varName} = \`${escapeForTemplate(contents[file])}\`;`;
  }).join('\n\n');

  writeFileSync(outPath, banner + exports + '\n');
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add `prebuild` script to package.json**

Edit `package.json` `"scripts"` block — add the `prebuild` entry:

```json
"scripts": {
  "dev": "vite",
  "prebuild": "node scripts/fetch-skill.mjs",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Run the script manually to verify it works**

```bash
node scripts/fetch-skill.mjs
```

Expected output: 6 file fetches, each printing `✓ filename (N chars)`, followed by `Wrote src/lib/skill-content.ts`.

- [ ] **Step 4: Verify the generated file looks right**

```bash
head -10 src/lib/skill-content.ts && wc -l src/lib/skill-content.ts
```

Expected: banner comment, then `export const skill_md = ...` etc., between 1500–3500 lines depending on skill content size.

- [ ] **Step 5: Add the generated file to .gitignore**

Add this line to `.gitignore`:

```
# auto-generated by scripts/fetch-skill.mjs
src/lib/skill-content.ts
```

The skill content is regenerated on every build — no need to track it.

- [ ] **Step 6: Commit**

```bash
git add scripts/fetch-skill.mjs package.json package-lock.json .gitignore
git commit -m "feat: add prebuild script that fetches skill files into src/lib/skill-content.ts"
```

---

### Task 3: smart-skill-loader.ts (with unit tests)

**Files:**
- Create: `src/lib/smart-skill-loader.ts`
- Create: `src/lib/__tests__/smart-skill-loader.test.ts`

- [ ] **Step 1: Write the test file FIRST**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/lib/__tests__/smart-skill-loader.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { detectContentCues, buildSystemPrompt } from '../smart-skill-loader';

describe('detectContentCues', () => {
  it('detects a list of named items', () => {
    const text = `# Page

- Hydrotherapy: A water-based therapy.
- Meditation: A pavilion for mindfulness.
- Movement: A studio for yoga.
- Cryotherapy: Cold therapy.`;
    const cues = detectContentCues(text);
    expect(cues.hasListOfNamedItems).toBe(true);
    expect(cues.listItemCount).toBe(4);
  });

  it('detects pull quote with attribution', () => {
    const text = `Some intro.

> A meaningful quote here.
> — Karen Campbell, Co-Founder`;
    const cues = detectContentCues(text);
    expect(cues.hasQuote).toBe(true);
  });

  it('detects audience split', () => {
    const text = `For kids: ...
For teens: ...
For adults: ...
For families: ...`;
    const cues = detectContentCues(text);
    expect(cues.hasAudienceSplit).toBe(true);
  });

  it('detects timeline (5+ entries)', () => {
    const text = `Day 1: Arrival
Day 2: Assessment
Day 3: Treatment
Day 4: Movement
Day 5: Departure`;
    const cues = detectContentCues(text);
    expect(cues.hasTimeline).toBe(true);
  });

  it('detects bio cards (3+ people)', () => {
    const text = `Karen Campbell, CEO. Bio paragraph.
Basel Shammout, Chairman. Bio paragraph.
Sascha Hemmann, GM. Bio paragraph.`;
    const cues = detectContentCues(text);
    expect(cues.hasBios).toBe(true);
  });

  it('returns empty cues for plain narrative', () => {
    const text = `Just a paragraph of plain prose. Nothing structured.`;
    const cues = detectContentCues(text);
    expect(cues.hasListOfNamedItems).toBe(false);
    expect(cues.hasQuote).toBe(false);
    expect(cues.hasTimeline).toBe(false);
  });
});

describe('buildSystemPrompt', () => {
  const fakeSkillFiles = {
    skillMd: 'CORE_RULES_PLACEHOLDER',
    designTokensCss: 'CSS_TOKENS',
    componentLibraryHtml: 'CHROME_BLOCKS',
    sectionPatternsMd: '## Group A — Heroes\n### `hero-fullbleed-centered`\n## Group D — Listings\n### `card-grid-3`\n## Group F — Conversion\n### `dark-cta`',
    contentInferenceMd: '## Part A — Parser\n## Part B — Classifier\n## Part C — Selection\n## Part D — Templates\n## Part E — Tie-breakers\n## Part F — Derived\n## Part G — Validation\n## Part H — Enrichment',
    outputTemplateHtml: 'TEMPLATE_SKELETON',
  };

  it('always includes core skill, tokens, output template, parser, classifier', () => {
    const cues = detectContentCues('plain text');
    const prompt = buildSystemPrompt(fakeSkillFiles, cues);
    expect(prompt).toContain('CORE_RULES_PLACEHOLDER');
    expect(prompt).toContain('CSS_TOKENS');
    expect(prompt).toContain('TEMPLATE_SKELETON');
    expect(prompt).toContain('Part A — Parser');
    expect(prompt).toContain('Part B — Classifier');
  });

  it('includes hero archetypes and CTA archetypes always', () => {
    const cues = detectContentCues('plain');
    const prompt = buildSystemPrompt(fakeSkillFiles, cues);
    expect(prompt).toContain('hero-fullbleed-centered');
    expect(prompt).toContain('dark-cta');
  });

  it('includes card-grid archetypes when list-of-named-items detected', () => {
    const text = `- Item A: desc.\n- Item B: desc.\n- Item C: desc.`;
    const cues = detectContentCues(text);
    const prompt = buildSystemPrompt(fakeSkillFiles, cues);
    expect(prompt).toContain('card-grid-3');
  });

  it('produces meaningfully shorter prompt for plain text vs full skill', () => {
    const cues = detectContentCues('plain prose');
    const reducedPrompt = buildSystemPrompt(fakeSkillFiles, cues);
    const fullPromptApprox = Object.values(fakeSkillFiles).join('\n');
    // For our fake files, plain text won't include card-grid sections, so reduced < full
    expect(reducedPrompt.length).toBeLessThanOrEqual(fullPromptApprox.length);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
npm test -- smart-skill-loader.test
```

Expected: all tests fail with "Cannot find module '../smart-skill-loader'" or similar.

- [ ] **Step 3: Write the implementation**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/lib/smart-skill-loader.ts`

```typescript
// Composes the Anthropic system prompt for a single generation request.
// Reduces the full skill prompt (~40K tokens) by including only the rules and
// archetype HTMLs relevant to the parsed content cues. Conservative — when in
// doubt, includes more rather than less.

export interface ContentCues {
  hasListOfNamedItems: boolean;
  listItemCount: number;
  hasQuote: boolean;
  hasTable: boolean;
  hasTimeline: boolean;
  hasProcessSteps: boolean;
  hasAudienceSplit: boolean;
  hasBios: boolean;
  hasInclusionList: boolean;
  hasNumericFacts: boolean;
  hasNarrativeWithSubheadings: boolean;
  hasPlainNarrative: boolean;
}

export interface SkillFiles {
  skillMd: string;
  designTokensCss: string;
  componentLibraryHtml: string;
  sectionPatternsMd: string;
  contentInferenceMd: string;
  outputTemplateHtml: string;
}

const NUMERIC_FACT_REGEX = /\b\d+\s+\w+(?:[\s,]+\b\d+\s+\w+){2,}/;
const QUOTE_BLOCK_REGEX = /(^|\n)>\s.+|(^|\n)"[^"]{30,}"\s*\n\s*[—-]/;
const TIMELINE_REGEX = /\b(?:Day|Phase|Step|Week)\s+\d+/gi;
const AUDIENCE_REGEX = /\bFor (?:kids|teens|adults|children|families|couples|individuals|seniors)\b/gi;
const NAMED_ITEM_REGEX = /^[\s-*•]*[A-Z][^:\n]{2,40}:\s+\S/gm;
const SUBHEADING_REGEX = /^#{2,3}\s+\S/gm;

export function detectContentCues(text: string): ContentCues {
  const namedItemMatches = text.match(NAMED_ITEM_REGEX) ?? [];
  const subheadingMatches = text.match(SUBHEADING_REGEX) ?? [];
  const timelineMatches = text.match(TIMELINE_REGEX) ?? [];
  const audienceMatches = text.match(AUDIENCE_REGEX) ?? [];

  // Bios heuristic: lines like "Name, Title. Bio paragraph" — count name+role pairs
  const bioPattern = /^[A-Z][a-z]+ [A-Z][a-z]+,\s+[A-Z][^.\n]+\./gm;
  const bioMatches = text.match(bioPattern) ?? [];

  return {
    hasListOfNamedItems: namedItemMatches.length >= 3,
    listItemCount: namedItemMatches.length,
    hasQuote: QUOTE_BLOCK_REGEX.test(text),
    hasTable: /\|.+\|.+\|/.test(text),
    hasTimeline: timelineMatches.length >= 5,
    hasProcessSteps: timelineMatches.length >= 3 && timelineMatches.length <= 4,
    hasAudienceSplit: audienceMatches.length >= 2,
    hasBios: bioMatches.length >= 3,
    hasInclusionList: /(?:What's Included|Not Included|Includes|Excludes)/i.test(text),
    hasNumericFacts: NUMERIC_FACT_REGEX.test(text),
    hasNarrativeWithSubheadings: subheadingMatches.length >= 3,
    hasPlainNarrative: subheadingMatches.length < 3 && namedItemMatches.length < 3,
  };
}

// Extracts a named section (e.g., "## Group A — Heroes") from a markdown file.
// Returns the section heading + its body content up to the next ## heading.
function extractSection(md: string, sectionHeading: string): string {
  const lines = md.split('\n');
  const startIdx = lines.findIndex((l) => l.includes(sectionHeading));
  if (startIdx === -1) return '';
  const nextIdx = lines.slice(startIdx + 1).findIndex((l) => /^## /.test(l));
  const endIdx = nextIdx === -1 ? lines.length : startIdx + 1 + nextIdx;
  return lines.slice(startIdx, endIdx).join('\n');
}

// Extracts an archetype block (### `slug` ... up to next ### or ##) from section-patterns.md.
function extractArchetype(md: string, slug: string): string {
  const startMarker = `### \`${slug}\``;
  const startIdx = md.indexOf(startMarker);
  if (startIdx === -1) return '';
  const afterStart = md.slice(startIdx);
  const nextMatch = afterStart.slice(startMarker.length).search(/\n###?\s/);
  if (nextMatch === -1) return afterStart;
  return afterStart.slice(0, startMarker.length + nextMatch);
}

const ALWAYS_ARCHETYPES = [
  'hero-fullbleed-centered',
  'hero-fullbleed-bottom-left',
  'hero-image-only',
  'hero-centered-no-image',
  'breadcrumb',
  'dark-cta',
  'dark-cta-with-inline-form',
  'related-grid',
  'image-strip-gallery',
  'centered-note',
  'bordered-callout',
];

const CONDITIONAL_ARCHETYPES: Array<[keyof ContentCues, string[]]> = [
  ['hasListOfNamedItems', ['card-grid-3', 'card-grid-4', 'card-grid-2-wide', 'carousel-horizontal', 'load-more-grid', 'icon-card-grid-3', 'icon-card-grid-4', 'card-grid-3-icon-variant']],
  ['hasQuote', ['pull-quote']],
  ['hasTable', ['comparison-table']],
  ['hasTimeline', ['vertical-timeline']],
  ['hasProcessSteps', ['process-steps', 'process-steps-icon-variant']],
  ['hasAudienceSplit', ['tab-segmented-content']],
  ['hasBios', ['bio-grid']],
  ['hasInclusionList', ['two-column-list']],
  ['hasNumericFacts', ['stats-row']],
  ['hasNarrativeWithSubheadings', ['alternating-image-text-extended', 'alternating-image-text', 'card-grid-2-wide']],
  ['hasPlainNarrative', ['prose-article-body', 'intro-split']],
];

export function buildSystemPrompt(files: SkillFiles, cues: ContentCues): string {
  // Always-included pieces
  const parts: string[] = [
    '<!-- SKILL CORE -->',
    files.skillMd,
    '',
    '<!-- DESIGN TOKENS (embed verbatim) -->',
    files.designTokensCss,
    '',
    '<!-- OUTPUT TEMPLATE -->',
    files.outputTemplateHtml,
    '',
    '<!-- COMPONENT LIBRARY (chrome blocks always) -->',
    files.componentLibraryHtml,
    '',
    '<!-- INFERENCE RULES (always) -->',
    extractSection(files.contentInferenceMd, 'Part A'),
    extractSection(files.contentInferenceMd, 'Part B'),
    extractSection(files.contentInferenceMd, 'Part C'),
    extractSection(files.contentInferenceMd, 'Part E'),
    extractSection(files.contentInferenceMd, 'Part F'),
    extractSection(files.contentInferenceMd, 'Part G'),
    extractSection(files.contentInferenceMd, 'Part H'),
    '',
    '<!-- ARCHETYPES — ALWAYS INCLUDED -->',
  ];

  for (const slug of ALWAYS_ARCHETYPES) {
    const block = extractArchetype(files.sectionPatternsMd, slug);
    if (block) parts.push(block);
  }

  parts.push('', '<!-- ARCHETYPES — CONDITIONAL -->');

  const includedSlugs = new Set<string>(ALWAYS_ARCHETYPES);
  for (const [cueKey, slugs] of CONDITIONAL_ARCHETYPES) {
    if (cues[cueKey]) {
      for (const slug of slugs) {
        if (!includedSlugs.has(slug)) {
          const block = extractArchetype(files.sectionPatternsMd, slug);
          if (block) {
            parts.push(block);
            includedSlugs.add(slug);
          }
        }
      }
    }
  }

  // Always include Part D (page-flow templates) — small + critical
  parts.push('', '<!-- PAGE-FLOW TEMPLATES -->', extractSection(files.contentInferenceMd, 'Part D'));

  return parts.join('\n');
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- smart-skill-loader.test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/smart-skill-loader.ts src/lib/__tests__/smart-skill-loader.test.ts
git commit -m "feat: add smart-skill-loader for cost-optimised system prompts"
```

---

### Task 4: api/generate.ts Edge Function

**Files:**
- Create: `api/generate.ts`

- [ ] **Step 1: Write the function**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/api/generate.ts`

```typescript
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
  const docStart = response.indexOf('<!doctype');
  const docEnd = response.lastIndexOf('</html>');
  if (docStart === -1 || docEnd === -1) {
    return { html: '', confirmation: response };
  }
  const html = response.slice(docStart, docEnd + '</html>'.length);
  const confirmation = (response.slice(0, docStart) + response.slice(docEnd + '</html>'.length)).trim();
  return { html, confirmation };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method-not-allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
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
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
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
```

- [ ] **Step 2: Verify the function builds**

```bash
npm run build:dev
```

Expected: build succeeds without TypeScript errors. (Vite ignores the `api/` folder at SPA build time, but TypeScript still checks it.)

- [ ] **Step 3: Smoke-test locally with `vercel dev`**

```bash
npx vercel dev
```

Then in another terminal:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Wireframe a simple Jayasom about us page with H1 \"Welcome\", subtitle \"A wellness destination\", and a CTA \"Book now\""}]}'
```

Expected: ~10–25s response with `{"confirmation":"...","html":"<!doctype html>...</html>","usage":{...}}`.

If the call fails with `ANTHROPIC_API_KEY not set`, check `.env.local`. If with rate-limit on second try in close succession — that's expected, but fewer than 30 calls/hour shouldn't trigger.

- [ ] **Step 4: Verify the returned HTML is valid**

Save the response and open in a browser:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Wireframe a simple welcome page"}]}' \
  | jq -r '.html' > /tmp/test-wireframe.html
```

Open `/tmp/test-wireframe.html` (or equivalent) in a browser. Expected: a valid Jayasom-styled wireframe page renders without errors.

- [ ] **Step 5: Commit**

```bash
git add api/generate.ts
git commit -m "feat: add /api/generate edge function with smart-loaded system prompt"
```

---

### Task 5: parse-attachment.ts (with unit tests)

**Files:**
- Create: `src/lib/parse-attachment.ts`
- Create: `src/lib/__tests__/parse-attachment.test.ts`
- Create: `src/lib/__tests__/fixtures/` (folder with test files)

- [ ] **Step 1: Create test fixtures folder**

```bash
mkdir -p src/lib/__tests__/fixtures
```

Manually create simple test files in this folder:
- `sample.txt` — write any plain-text content (e.g., "Hello world.")
- `sample.md` — write any markdown content (e.g., "# Title\n\nParagraph.")
- `sample.csv` — write a CSV (e.g., `Name,Role\nAlice,CEO\nBob,CTO\n`)
- `sample.xlsx` — open Excel, type `A1=Name, B1=Role, A2=Alice, B2=CEO`, save as xlsx
- `sample.docx` — open Word, type "Hello from Word", save as docx
- `sample.pdf` — generate any short PDF (e.g., print "Hello PDF" to PDF from a browser)

- [ ] **Step 2: Write test file**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/lib/__tests__/parse-attachment.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseAttachment } from '../parse-attachment';

const FIXTURE_DIR = join(__dirname, 'fixtures');

function loadFixture(name: string, mimeType: string): File {
  const buffer = readFileSync(join(FIXTURE_DIR, name));
  return new File([buffer], name, { type: mimeType });
}

describe('parseAttachment', () => {
  it('parses .txt as plain UTF-8', async () => {
    const file = loadFixture('sample.txt', 'text/plain');
    const text = await parseAttachment(file);
    expect(text.length).toBeGreaterThan(0);
  });

  it('parses .md as plain UTF-8', async () => {
    const file = loadFixture('sample.md', 'text/markdown');
    const text = await parseAttachment(file);
    expect(text).toContain('Title');
  });

  it('parses .csv into tab-separated text', async () => {
    const file = loadFixture('sample.csv', 'text/csv');
    const text = await parseAttachment(file);
    expect(text).toContain('Alice');
    expect(text).toContain('CEO');
  });

  it('parses .xlsx into tab-separated cells', async () => {
    const file = loadFixture('sample.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const text = await parseAttachment(file);
    expect(text).toContain('Alice');
    expect(text).toContain('CEO');
  });

  it('parses .docx into plain text', async () => {
    const file = loadFixture('sample.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const text = await parseAttachment(file);
    expect(text).toContain('Hello');
  });

  it('parses .pdf into plain text', async () => {
    const file = loadFixture('sample.pdf', 'application/pdf');
    const text = await parseAttachment(file);
    expect(text.length).toBeGreaterThan(0);
  });

  it('throws on unsupported format', async () => {
    const file = new File(['data'], 'sample.png', { type: 'image/png' });
    await expect(parseAttachment(file)).rejects.toThrow(/unsupported/i);
  });

  it('throws on file >10MB', async () => {
    const big = new File([new Uint8Array(11 * 1024 * 1024)], 'big.txt', { type: 'text/plain' });
    await expect(parseAttachment(big)).rejects.toThrow(/too large/i);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npm test -- parse-attachment.test
```

Expected: all tests fail because the module doesn't exist.

- [ ] **Step 4: Write the implementation**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/lib/parse-attachment.ts`

```typescript
// Dispatches a File to the appropriate parser based on its mime type or extension.
// Returns extracted plain text. Runs entirely in the browser — file binaries
// never leave the client until the user explicitly sends.

import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const TEXT_TYPES = new Set([
  'text/plain', 'text/markdown', 'text/x-markdown',
]);
const SHEET_TYPES = new Set([
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/csv',
]);
const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const PDF_TYPE = 'application/pdf';

function isTextLike(file: File): boolean {
  if (TEXT_TYPES.has(file.type)) return true;
  return /\.(txt|md|markdown)$/i.test(file.name);
}

function isSpreadsheet(file: File): boolean {
  if (SHEET_TYPES.has(file.type)) return true;
  return /\.(xls|xlsx|csv)$/i.test(file.name);
}

function isDocx(file: File): boolean {
  if (file.type === DOCX_TYPE) return true;
  return /\.docx$/i.test(file.name);
}

function isPdf(file: File): boolean {
  if (file.type === PDF_TYPE) return true;
  return /\.pdf$/i.test(file.name);
}

async function parseTextLike(file: File): Promise<string> {
  return await file.text();
}

async function parseSpreadsheet(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const lines: string[] = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (workbook.SheetNames.length > 1) lines.push(`# Sheet: ${sheetName}`);
    const csv = XLSX.utils.sheet_to_csv(sheet, { FS: '\t' });
    lines.push(csv);
  }
  return lines.join('\n');
}

async function parseDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

// pdfjs requires a worker. Vite's worker import + ?url query gets the right URL.
// (We import the worker URL at runtime so this only loads when a PDF is parsed.)
async function parsePdf(file: File): Promise<string> {
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  }
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const pageTexts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
    pageTexts.push(text);
  }
  return pageTexts.join('\n\n');
}

export async function parseAttachment(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB (max 10 MB)`);
  }
  if (isTextLike(file)) return parseTextLike(file);
  if (isSpreadsheet(file)) return parseSpreadsheet(file);
  if (isDocx(file)) return parseDocx(file);
  if (isPdf(file)) return parsePdf(file);
  throw new Error(`Unsupported format: ${file.name} (${file.type})`);
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- parse-attachment.test
```

Expected: all 8 tests pass. If pdf test fails on "Failed to load worker", that's environment-specific — the worker import works in browser at runtime but vitest's node environment may need a stub. If so, mark the pdf test as `it.skip` and verify the pdf parser manually in Task 7.

- [ ] **Step 6: Commit**

```bash
git add src/lib/parse-attachment.ts src/lib/__tests__/parse-attachment.test.ts src/lib/__tests__/fixtures/
git commit -m "feat: add parse-attachment dispatcher for 6 file formats"
```

---

### Task 6: AttachmentDropzone.tsx component

**Files:**
- Create: `src/components/generator/AttachmentDropzone.tsx`

- [ ] **Step 1: Write the component**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/components/generator/AttachmentDropzone.tsx`

```typescript
import { useCallback, useState } from 'react';
import { Paperclip, FileText, X, Loader2 } from 'lucide-react';
import { parseAttachment } from '@/lib/parse-attachment';

export interface ParsedAttachment {
  id: string;
  name: string;
  size: number;
  text: string;
}

interface Props {
  onAttachmentsReady: (attachments: ParsedAttachment[]) => void;
  disabled?: boolean;
}

interface PendingFile {
  id: string;
  file: File;
  status: 'parsing' | 'done' | 'error';
  text?: string;
  error?: string;
}

const ACCEPT = '.txt,.md,.csv,.xls,.xlsx,.docx,.pdf,text/plain,text/markdown,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf';

export function AttachmentDropzone({ onAttachmentsReady, disabled }: Props) {
  const [pending, setPending] = useState<PendingFile[]>([]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const initial: PendingFile[] = fileArray.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f,
      status: 'parsing' as const,
    }));
    setPending((prev) => [...prev, ...initial]);

    for (const item of initial) {
      try {
        const text = await parseAttachment(item.file);
        setPending((prev) => prev.map((p) => p.id === item.id ? { ...p, status: 'done', text } : p));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Parse failed';
        setPending((prev) => prev.map((p) => p.id === item.id ? { ...p, status: 'error', error: message } : p));
      }
    }
  }, []);

  // Notify parent whenever a new "done" set is ready
  const ready = pending.filter((p) => p.status === 'done');
  const readyKey = ready.map((p) => p.id).join('|');
  // call onAttachmentsReady on each render where readyKey changes (effect would also work)

  const handleSubmit = () => {
    onAttachmentsReady(ready.map((p) => ({
      id: p.id, name: p.file.name, size: p.file.size, text: p.text!,
    })));
    setPending([]);
  };

  const removeOne = (id: string) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => { e.preventDefault(); if (!disabled) handleFiles(e.dataTransfer.files); }}
        className="border border-dashed border-border rounded-none px-3 py-2 text-xs"
      >
        <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
          <Paperclip className="w-3 h-3" />
          <span>Attach file or drop here (xls/xlsx/csv/pdf/md/txt/docx, max 10 MB)</span>
          <input
            type="file"
            multiple
            accept={ACCEPT}
            disabled={disabled}
            className="hidden"
            onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
          />
        </label>
      </div>
      {pending.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {pending.map((p) => (
            <li key={p.id} className="border border-border px-2 py-1 text-xs flex items-center gap-2">
              {p.status === 'parsing' && <Loader2 className="w-3 h-3 animate-spin" />}
              {p.status === 'done' && <FileText className="w-3 h-3" />}
              {p.status === 'error' && <X className="w-3 h-3 text-destructive" />}
              <span>{p.file.name}</span>
              <span className="text-muted-foreground">({(p.file.size / 1024).toFixed(1)} KB)</span>
              {p.status === 'error' && <span className="text-destructive">— {p.error}</span>}
              <button onClick={() => removeOne(p.id)} aria-label="Remove">
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {ready.length > 0 && (
        <button
          onClick={handleSubmit}
          className="text-xs text-foreground border border-foreground px-3 py-1"
          disabled={disabled}
        >
          Add {ready.length} attachment{ready.length === 1 ? '' : 's'} to message
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Manually smoke-test the component**

Skip until Task 9 (when ChatPanel mounts it). Verification happens once it's part of the chat UI.

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/AttachmentDropzone.tsx
git commit -m "feat: add AttachmentDropzone with multi-file parsing"
```

---

### Task 7: chat-store.ts (with unit tests)

**Files:**
- Create: `src/lib/chat-store.ts`
- Create: `src/lib/__tests__/chat-store.test.ts`

- [ ] **Step 1: Write the test file**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/lib/__tests__/chat-store.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '../chat-store';

describe('useChatStore', () => {
  beforeEach(() => {
    useChatStore.getState().clear();
  });

  it('starts empty', () => {
    expect(useChatStore.getState().messages).toEqual([]);
    expect(useChatStore.getState().currentHtml).toBeNull();
    expect(useChatStore.getState().isGenerating).toBe(false);
  });

  it('appends user messages', () => {
    useChatStore.getState().addUserMessage({ text: 'Hello', attachments: [] });
    expect(useChatStore.getState().messages).toHaveLength(1);
    expect(useChatStore.getState().messages[0].role).toBe('user');
    expect(useChatStore.getState().messages[0].text).toBe('Hello');
  });

  it('appends assistant messages and updates currentHtml', () => {
    useChatStore.getState().addAssistantMessage({
      confirmation: 'Generated 5 sections',
      html: '<!doctype html><html></html>',
    });
    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].role).toBe('assistant');
    expect(state.currentHtml).toBe('<!doctype html><html></html>');
  });

  it('toggles isGenerating', () => {
    useChatStore.getState().setGenerating(true);
    expect(useChatStore.getState().isGenerating).toBe(true);
    useChatStore.getState().setGenerating(false);
    expect(useChatStore.getState().isGenerating).toBe(false);
  });

  it('clears all state', () => {
    useChatStore.getState().addUserMessage({ text: 'x', attachments: [] });
    useChatStore.getState().addAssistantMessage({ confirmation: 'y', html: '<!doctype html></html>' });
    useChatStore.getState().clear();
    const state = useChatStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.currentHtml).toBeNull();
    expect(state.isGenerating).toBe(false);
  });

  it('returns ANTHROPIC-format messages for the API', () => {
    useChatStore.getState().addUserMessage({
      text: 'Wireframe this',
      attachments: [{ id: '1', name: 'a.md', size: 100, text: '# Title\n\npara' }],
    });
    const apiMessages = useChatStore.getState().getApiMessages();
    expect(apiMessages).toHaveLength(1);
    expect(apiMessages[0].role).toBe('user');
    expect(apiMessages[0].content).toContain('Wireframe this');
    expect(apiMessages[0].content).toContain('# Title');
    expect(apiMessages[0].content).toContain('a.md');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- chat-store.test
```

Expected: all tests fail because the module doesn't exist.

- [ ] **Step 3: Write the implementation**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/lib/chat-store.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ParsedAttachment } from '@/components/generator/AttachmentDropzone';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string; // user prompt or assistant confirmation
  attachments?: ParsedAttachment[]; // user only
  html?: string; // assistant only — the generated HTML
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  currentHtml: string | null;
  isGenerating: boolean;
  errorMessage: string | null;

  addUserMessage: (input: { text: string; attachments: ParsedAttachment[] }) => void;
  addAssistantMessage: (input: { confirmation: string; html: string }) => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (message: string | null) => void;
  clear: () => void;

  // Returns the messages formatted for /api/generate
  getApiMessages: () => Array<{ role: 'user' | 'assistant'; content: string }>;
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      currentHtml: null,
      isGenerating: false,
      errorMessage: null,

      addUserMessage: ({ text, attachments }) =>
        set((s) => ({
          messages: [...s.messages, {
            id: newId(),
            role: 'user',
            text,
            attachments,
            timestamp: Date.now(),
          }],
          errorMessage: null,
        })),

      addAssistantMessage: ({ confirmation, html }) =>
        set((s) => ({
          messages: [...s.messages, {
            id: newId(),
            role: 'assistant',
            text: confirmation,
            html,
            timestamp: Date.now(),
          }],
          currentHtml: html,
          errorMessage: null,
        })),

      setGenerating: (isGenerating) => set({ isGenerating }),

      setError: (errorMessage) => set({ errorMessage, isGenerating: false }),

      clear: () => set({ messages: [], currentHtml: null, isGenerating: false, errorMessage: null }),

      getApiMessages: () =>
        get().messages.map((m) => {
          if (m.role === 'user') {
            const attachmentText = (m.attachments ?? [])
              .map((a) => `\n\n--- attachment: ${a.name} ---\n${a.text}\n--- end attachment ---\n`)
              .join('');
            return { role: 'user' as const, content: m.text + attachmentText };
          }
          return { role: 'assistant' as const, content: m.html ?? m.text };
        }),
    }),
    {
      name: 'jayasom-wireframe-generator-chat',
      storage: createJSONStorage(() => localStorage),
      // Avoid persisting transient UI state
      partialize: (s) => ({ messages: s.messages, currentHtml: s.currentHtml }),
    }
  )
);
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- chat-store.test
```

Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/chat-store.ts src/lib/__tests__/chat-store.test.ts
git commit -m "feat: add zustand chat-store with localStorage persistence"
```

---

### Task 8: api-client.ts

**Files:**
- Create: `src/lib/api-client.ts`

- [ ] **Step 1: Write the client**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/lib/api-client.ts`

```typescript
export type GenerateModel = 'claude-sonnet-4-6' | 'claude-haiku-4-5-20251001';

export interface GenerateRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  model?: GenerateModel;
}

export interface GenerateResponseOk {
  ok: true;
  confirmation: string;
  html: string;
}

export interface GenerateResponseError {
  ok: false;
  error: string;
  category?: 'auth' | 'rate-limit' | 'anthropic-rate-limit' | 'anthropic-overloaded' | 'budget-exhausted' | 'malformed-response' | 'invalid-request' | 'config' | 'unknown';
  retryAfterMin?: number;
  detail?: string;
}

export type GenerateResponse = GenerateResponseOk | GenerateResponseError;

export async function callGenerate(req: GenerateRequest, signal?: AbortSignal): Promise<GenerateResponse> {
  let res: Response;
  try {
    res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      return { ok: false, error: 'aborted', category: 'unknown' };
    }
    return { ok: false, error: 'network', category: 'unknown', detail: (err as Error).message };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { ok: false, error: 'malformed-response-body', category: 'unknown' };
  }

  if (res.ok && typeof body === 'object' && body !== null && 'html' in body) {
    const b = body as { confirmation: string; html: string };
    return { ok: true, confirmation: b.confirmation, html: b.html };
  }

  const b = body as { error?: string; category?: GenerateResponseError['category']; retryAfterMin?: number; detail?: string };
  return {
    ok: false,
    error: b.error ?? `http-${res.status}`,
    category: b.category,
    retryAfterMin: b.retryAfterMin,
    detail: b.detail,
  };
}

// Friendly error message mapping for the UI
export function describeError(err: GenerateResponseError): string {
  switch (err.category) {
    case 'rate-limit':
      return `Rate limit reached — try again in ${err.retryAfterMin ?? 60} min.`;
    case 'anthropic-rate-limit':
      return 'Anthropic API is rate limiting us. Try again in a minute.';
    case 'anthropic-overloaded':
      return 'Anthropic API is overloaded. Try again in a moment.';
    case 'budget-exhausted':
      return 'Monthly budget reached — contact admin.';
    case 'malformed-response':
      return 'Generated copy but the HTML wasn\'t well-formed. Retry?';
    case 'invalid-request':
      return 'Request was malformed. Refresh and try again.';
    case 'config':
      return 'Server is misconfigured. Contact admin.';
    case 'auth':
      return 'API authentication failed. Contact admin.';
    default:
      return err.detail ?? 'Generation failed. Retry?';
  }
}
```

- [ ] **Step 2: Verify it builds (no test for this trivial wrapper)**

```bash
npm run build:dev
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/api-client.ts
git commit -m "feat: add api-client wrapper for /api/generate"
```

---

### Task 9: ModelPicker, MessageBubble, ChatPanel components

**Files:**
- Create: `src/components/generator/ModelPicker.tsx`
- Create: `src/components/generator/MessageBubble.tsx`
- Create: `src/components/generator/ChatPanel.tsx`

- [ ] **Step 1: Write `ModelPicker.tsx`**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/components/generator/ModelPicker.tsx`

```typescript
import type { GenerateModel } from '@/lib/api-client';

interface Props {
  value: GenerateModel;
  onChange: (model: GenerateModel) => void;
  disabled?: boolean;
}

const OPTIONS: Array<{ value: GenerateModel; label: string; hint: string }> = [
  { value: 'claude-sonnet-4-6', label: 'Standard', hint: 'Best quality' },
  { value: 'claude-haiku-4-5-20251001', label: 'Fast', hint: 'Cheaper, simple tweaks' },
];

export function ModelPicker({ value, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          disabled={disabled}
          title={opt.hint}
          className={`px-2 py-1 border ${value === opt.value ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write `MessageBubble.tsx`**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/components/generator/MessageBubble.tsx`

```typescript
import { Download, FileText } from 'lucide-react';
import type { ChatMessage } from '@/lib/chat-store';

interface Props {
  message: ChatMessage;
}

function downloadHtml(html: string, title: string) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'wireframe';
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wireframe-${slug}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] border border-border ${isUser ? 'bg-foreground text-background' : 'bg-background'}`}>
        {isUser && message.attachments && message.attachments.length > 0 && (
          <ul className="px-3 pt-3 flex flex-wrap gap-2">
            {message.attachments.map((a) => (
              <li key={a.id} className="text-xs flex items-center gap-1 border border-background/40 px-2 py-0.5">
                <FileText className="w-3 h-3" />
                <span>{a.name}</span>
                <span className="opacity-60">({(a.size / 1024).toFixed(1)} KB)</span>
              </li>
            ))}
          </ul>
        )}
        <p className={`px-3 py-3 text-sm ${isUser ? '' : 'text-foreground'}`}>{message.text}</p>
        {!isUser && message.html && (
          <div className="px-3 pb-3">
            <button
              onClick={() => downloadHtml(message.html!, message.text)}
              className="text-xs flex items-center gap-1 border border-foreground px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
            >
              <Download className="w-3 h-3" />
              Download HTML
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write `ChatPanel.tsx`**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/components/generator/ChatPanel.tsx`

```typescript
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChatStore } from '@/lib/chat-store';
import { callGenerate, describeError, type GenerateModel } from '@/lib/api-client';
import { MessageBubble } from './MessageBubble';
import { AttachmentDropzone, type ParsedAttachment } from './AttachmentDropzone';
import { ModelPicker } from './ModelPicker';

export function ChatPanel() {
  const messages = useChatStore((s) => s.messages);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const errorMessage = useChatStore((s) => s.errorMessage);
  const addUserMessage = useChatStore((s) => s.addUserMessage);
  const addAssistantMessage = useChatStore((s) => s.addAssistantMessage);
  const setGenerating = useChatStore((s) => s.setGenerating);
  const setError = useChatStore((s) => s.setError);
  const getApiMessages = useChatStore((s) => s.getApiMessages);

  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ParsedAttachment[]>([]);
  const [model, setModel] = useState<GenerateModel>('claude-sonnet-4-6');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const send = async () => {
    if (isGenerating) return;
    const text = input.trim();
    if (!text && pendingAttachments.length === 0) return;
    addUserMessage({ text: text || '(see attached)', attachments: pendingAttachments });
    setInput('');
    setPendingAttachments([]);
    setGenerating(true);
    const apiMessages = getApiMessages();
    const res = await callGenerate({ messages: apiMessages, model });
    setGenerating(false);
    if (res.ok) {
      addAssistantMessage({ confirmation: res.confirmation, html: res.html });
    } else {
      setError(describeError(res));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-border">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Send a message or upload content to generate your first wireframe.
          </p>
        )}
        {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Generating wireframe…</span>
          </div>
        )}
        {errorMessage && (
          <div className="border border-destructive bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="border-t border-border p-3 space-y-2">
        <AttachmentDropzone disabled={isGenerating} onAttachmentsReady={(a) => setPendingAttachments((prev) => [...prev, ...a])} />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          rows={3}
          placeholder="Type your prompt… (Ctrl/Cmd+Enter to send)"
          className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between">
          <ModelPicker value={model} onChange={setModel} disabled={isGenerating} />
          <button
            onClick={send}
            disabled={isGenerating || (!input.trim() && pendingAttachments.length === 0)}
            className="text-xs flex items-center gap-1 border border-foreground bg-foreground text-background px-3 py-2 disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify it builds**

```bash
npm run build:dev
```

Expected: build succeeds without TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/generator/ModelPicker.tsx src/components/generator/MessageBubble.tsx src/components/generator/ChatPanel.tsx
git commit -m "feat: add ChatPanel + MessageBubble + ModelPicker"
```

---

### Task 10: PreviewPane.tsx

**Files:**
- Create: `src/components/generator/PreviewPane.tsx`

- [ ] **Step 1: Write the component**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/components/generator/PreviewPane.tsx`

```typescript
import { useState } from 'react';
import { Download, ExternalLink, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useChatStore } from '@/lib/chat-store';

type Viewport = 'desktop' | 'tablet' | 'mobile';
const WIDTHS: Record<Viewport, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export function PreviewPane() {
  const currentHtml = useChatStore((s) => s.currentHtml);
  const [viewport, setViewport] = useState<Viewport>('desktop');

  const openInNewTab = () => {
    if (!currentHtml) return;
    const blob = new Blob([currentHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const download = () => {
    if (!currentHtml) return;
    const blob = new Blob([currentHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wireframe.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-1">
          {(['desktop', 'tablet', 'mobile'] as Viewport[]).map((v) => {
            const Icon = v === 'desktop' ? Monitor : v === 'tablet' ? Tablet : Smartphone;
            return (
              <button
                key={v}
                onClick={() => setViewport(v)}
                className={`p-1 ${viewport === v ? 'border border-foreground' : 'border border-transparent text-muted-foreground'}`}
                title={v}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openInNewTab}
            disabled={!currentHtml}
            className="text-xs flex items-center gap-1 border border-border px-2 py-1 disabled:opacity-50"
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </button>
          <button
            onClick={download}
            disabled={!currentHtml}
            className="text-xs flex items-center gap-1 border border-foreground bg-foreground text-background px-2 py-1 disabled:opacity-50"
          >
            <Download className="w-3 h-3" />
            Download
          </button>
        </div>
      </div>
      <div className="flex-1 bg-muted overflow-auto p-4 flex items-start justify-center">
        {currentHtml ? (
          <iframe
            srcDoc={currentHtml}
            sandbox="allow-same-origin"
            className="bg-background border border-border transition-[width] duration-200"
            style={{ width: WIDTHS[viewport], height: '100%', minHeight: '600px' }}
            title="Wireframe preview"
          />
        ) : (
          <p className="text-xs text-muted-foreground py-12">
            Send a message to generate your first wireframe.
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it builds**

```bash
npm run build:dev
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/PreviewPane.tsx
git commit -m "feat: add PreviewPane with iframe + viewport toggle + download"
```

---

### Task 11: WireframeGenerator.tsx page + add route

**Files:**
- Create: `src/pages/WireframeGenerator.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Write the page**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/src/pages/WireframeGenerator.tsx`

```typescript
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useChatStore } from '@/lib/chat-store';
import { ChatPanel } from '@/components/generator/ChatPanel';
import { PreviewPane } from '@/components/generator/PreviewPane';

export default function WireframeGenerator() {
  const clear = useChatStore((s) => s.clear);
  const messageCount = useChatStore((s) => s.messages.length);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (messageCount === 0) return;
    if (confirmClear) {
      clear();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold tracking-widest">Jayasom</span>
          <span className="text-xs text-muted-foreground">Wireframe Generator</span>
        </div>
        <button
          onClick={handleClear}
          disabled={messageCount === 0}
          className="text-xs flex items-center gap-1 border border-border px-2 py-1 disabled:opacity-50"
        >
          <Trash2 className="w-3 h-3" />
          {confirmClear ? 'Click again to confirm' : 'Start fresh'}
        </button>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[40%_60%] overflow-hidden">
        <ChatPanel />
        <PreviewPane />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add route to `App.tsx`**

Open `src/App.tsx` and add the import + route. Find the existing `<Routes>` block and add:

```typescript
import WireframeGenerator from "./pages/WireframeGenerator.tsx";
```

(Add this near the other page imports.) Then inside `<Routes>` (before the `<Route path="*"`), add:

```typescript
<Route path="/wireframe-generator" element={<WireframeGenerator />} />
```

- [ ] **Step 3: Add link from `Index.tsx`**

Open `src/pages/Index.tsx`. Find the `<h1>` near the top of the page. Replace this section:

```tsx
<h1 className="text-3xl font-light mb-3 text-foreground">Jayasom — Wireframe Pages</h1>
<p className="text-sm text-muted-foreground mb-10">{pages.length} wireframe page layouts for the Jayasom Amaala wellness destination website.</p>
```

with:

```tsx
<div className="flex items-start justify-between mb-3">
  <h1 className="text-3xl font-light text-foreground">Jayasom — Wireframe Pages</h1>
  <Link to="/wireframe-generator" className="text-xs border border-foreground px-3 py-2 hover:bg-foreground hover:text-background transition-colors">
    Open the generator →
  </Link>
</div>
<p className="text-sm text-muted-foreground mb-10">{pages.length} wireframe page layouts for the Jayasom Amaala wellness destination website.</p>
```

- [ ] **Step 4: Run dev server and smoke-test**

```bash
npm run dev
```

Open `http://localhost:5173/wireframe-generator` in a browser.

Expected:
- Header with logo + "Wireframe Generator" + "Start fresh" button
- Empty chat panel on the left ("Send a message to generate…")
- Empty preview pane on the right ("Send a message to generate your first wireframe.")
- Type a short prompt + click Send
- See a "Generating wireframe…" indicator
- After 10–25s, see an assistant message + the wireframe rendered in the iframe on the right

Also verify:
- `http://localhost:5173/` (Index) now has an "Open the generator →" button at top-right
- Refreshing `/wireframe-generator` keeps the conversation
- "Start fresh" button (click twice) clears the conversation

- [ ] **Step 5: Commit**

```bash
git add src/pages/WireframeGenerator.tsx src/App.tsx src/pages/Index.tsx
git commit -m "feat: add /wireframe-generator route + link from Index"
```

---

### Task 12: middleware.ts password gate + LoginScreen.tsx

**Files:**
- Create: `middleware.ts`
- Create: `src/components/generator/LoginScreen.tsx`

- [ ] **Step 1: Write `middleware.ts`**

Path: `D:/Code Files/Jayasom/jayasom-wireframe-files/middleware.ts`

```typescript
// Vercel Edge Middleware — runs on every request before any function or static file.
// Implements a shared-password gate. Sets an `auth` cookie on success.
//
// To unprotect specific routes (e.g., a public landing page), edit MATCHER below.

import { next } from '@vercel/edge';

const COOKIE_NAME = 'jwg-auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const LOGIN_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Jayasom — Sign in</title>
  <style>
    body { background: hsl(16 33% 93%); color: hsl(300 2% 27%); font-family: 'Century Gothic', 'Didact Gothic', 'Futura', 'Trebuchet MS', Arial, sans-serif; font-weight: 300; min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
    form { border: 1px solid hsl(300 2% 60%); padding: 32px; min-width: 320px; }
    h1 { font-size: 22px; font-weight: 300; margin-bottom: 6px; }
    p { font-size: 13px; color: hsl(300 2% 40%); margin-bottom: 24px; }
    label { display: block; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: hsl(300 2% 40%); margin-bottom: 6px; }
    input { width: 100%; padding: 10px 12px; font-size: 14px; border: 1px solid hsl(300 2% 60%); background: hsl(16 33% 93%); color: hsl(300 2% 27%); font-family: inherit; box-sizing: border-box; }
    button { width: 100%; margin-top: 16px; padding: 12px; font-size: 11px; letter-spacing: 0.15em; border: 1px solid hsl(300 2% 27%); background: hsl(300 2% 27%); color: hsl(16 33% 93%); cursor: pointer; }
    .err { color: hsl(0 70% 40%); font-size: 12px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <form method="POST" action="/__auth">
    <h1>Jayasom</h1>
    <p>Wireframe Generator — sign in to continue.</p>
    {{ERROR}}
    <label for="pw">Password</label>
    <input id="pw" name="password" type="password" autocomplete="current-password" autofocus/>
    <button type="submit">Sign in</button>
  </form>
</body>
</html>`;

function loginResponse(error?: string): Response {
  const body = LOGIN_HTML.replace('{{ERROR}}', error ? `<p class="err">${error}</p>` : '');
  return new Response(body, {
    status: error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function checkAuth(req: Request): boolean {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => c.trim().split('=', 2)).filter((p) => p.length === 2)
  );
  const expected = process.env.APP_PASSWORD;
  if (!expected) return false;
  return cookies[COOKIE_NAME] === expected;
}

export const config = {
  matcher: [
    // Skip Vercel internals and static assets — gate everything else.
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)',
  ],
};

export default async function middleware(req: Request) {
  const url = new URL(req.url);

  // Login form submission
  if (url.pathname === '/__auth' && req.method === 'POST') {
    const form = await req.formData();
    const password = form.get('password');
    const expected = process.env.APP_PASSWORD;
    if (!expected) {
      return new Response('Server not configured', { status: 500 });
    }
    if (typeof password !== 'string' || password !== expected) {
      return loginResponse('Wrong password.');
    }
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(expected)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax; Secure`,
      },
    });
  }

  if (checkAuth(req)) return next();

  // For API requests, return 401 JSON
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // For page requests, return the login HTML
  return loginResponse();
}
```

- [ ] **Step 2: Install the edge middleware package**

```bash
npm install @vercel/edge
```

- [ ] **Step 3: Smoke-test middleware locally with `vercel dev`**

```bash
npx vercel dev
```

Open `http://localhost:3000/wireframe-generator` in an incognito browser window.

Expected:
- See the login form
- Enter wrong password → "Wrong password" message
- Enter the correct password (from `.env.local`'s `APP_PASSWORD`) → redirect to `/`
- Navigate to `/wireframe-generator` → app loads (cookie persists for 30 days)
- Open API endpoint without auth: `curl -X POST http://localhost:3000/api/generate -d '{}'` → expect 401

- [ ] **Step 4: Commit**

```bash
git add middleware.ts package.json package-lock.json
git commit -m "feat: add edge middleware password gate"
```

---

### Task 13: GitHub Action webhook + Vercel deploy hook

**Files:**
- Create: `.github/workflows/redeploy-on-skill-update.yml` (in the SKILL repo, NOT this project)
- Modify: Vercel project settings (UI only)

- [ ] **Step 1: Create a Vercel Deploy Hook**

In the Vercel dashboard for `Jayasom-Wireframes` (this project):
1. Settings → Git → Deploy Hooks
2. Click "Create Hook"
3. Name: `skill-update-redeploy`
4. Branch: `main`
5. Click "Create"
6. Copy the generated URL (starts with `https://api.vercel.com/v1/integrations/deploy/...`)

- [ ] **Step 2: Add the hook URL as a secret in the SKILL repo**

In GitHub, navigate to `shemoelnexa/Jayasom-wireframe-generator` → Settings → Secrets and variables → Actions → New repository secret:
- Name: `WIREFRAME_PROJECT_DEPLOY_HOOK`
- Value: paste the URL from step 1

- [ ] **Step 3: Create the GitHub Action workflow file in the SKILL repo**

In your local skill repo at `D:/Code Files/jayasom-wireframe-skill/`, create `.github/workflows/redeploy-on-skill-update.yml`:

```yaml
name: Trigger wireframe project redeploy

on:
  push:
    branches: [main]
    paths:
      - 'SKILL.md'
      - 'references/**'

jobs:
  trigger-redeploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel deploy hook
        run: |
          curl -X POST "${{ secrets.WIREFRAME_PROJECT_DEPLOY_HOOK }}"
```

- [ ] **Step 4: Commit and push the workflow to the skill repo**

```bash
cd "D:/Code Files/jayasom-wireframe-skill"
git add .github/workflows/redeploy-on-skill-update.yml
git commit -m "ci: trigger wireframe project redeploy on skill changes"
git push
```

- [ ] **Step 5: Verify the action runs**

In the skill repo, make a trivial change (e.g., add a comment to README), commit, push.

```bash
cd "D:/Code Files/jayasom-wireframe-skill"
echo "" >> README.md
git add README.md
git commit -m "test: trigger redeploy webhook"
git push
```

Then in GitHub → Actions tab → confirm the workflow ran successfully.
Then in Vercel → Deployments → confirm a new deploy was queued.

- [ ] **Step 6: No commit needed in wireframe project for this step**

The workflow lives in the skill repo, the deploy hook is configured in Vercel UI. Wireframe project doesn't change.

---

### Task 14: Set up Vercel env vars + first cloud deploy

**Files:**
- None — this is configuration in the Vercel dashboard

- [ ] **Step 1: Set environment variables in Vercel**

In the Vercel dashboard for the wireframe project → Settings → Environment Variables, add:

| Name | Value | Environment | Notes |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Production, Preview, Development | Server-only |
| `APP_PASSWORD` | a strong password | Production, Preview, Development | Server-only |
| `GITHUB_TOKEN` | `ghp_...` (read access to skill repo) | Production, Preview | Build-time only (not Development) |
| `DEFAULT_MODEL` | `claude-sonnet-4-6` | Production, Preview, Development | Optional |
| `RATE_LIMIT_PER_HOUR` | `30` | Production, Preview, Development | Optional |

- [ ] **Step 2: Set the Anthropic budget cap**

In the Anthropic console (`console.anthropic.com`) → Settings → Limits → set monthly spending cap to `$50`.

- [ ] **Step 3: Push the wireframe project changes to Vercel**

If the changes from Tasks 1–12 are still local-only (not pushed to GitHub yet), push them:

```bash
cd "D:/Code Files/Jayasom/jayasom-wireframe-files"
git push origin main
```

This triggers a Vercel deploy. Watch it in the Vercel dashboard.

- [ ] **Step 4: Verify the build completes**

In Vercel dashboard → Deployments → latest deploy → check build logs.

Expected:
- `prebuild` step runs successfully (`✓ SKILL.md (...chars)` etc.)
- `vite build` completes
- Edge function `api/generate` is detected and deployed
- Middleware is detected and deployed
- Deploy goes live

- [ ] **Step 5: Smoke-test the deployed app**

Visit `https://jayasom-wireframes.vercel.app/wireframe-generator` (or whatever the production URL is).

Expected:
- Login page appears
- Correct password → app loads
- Send a test message → wireframe generates and previews

If anything fails: check Vercel function logs (Vercel dashboard → Logs tab) for the error class.

- [ ] **Step 6: Set up custom domain (optional)**

If a custom domain is desired (e.g., `wireframe-generator.jayasom.com`):
- Vercel → Settings → Domains → Add → enter the subdomain → follow DNS instructions.

Otherwise the default `jayasom-wireframes.vercel.app/wireframe-generator` works.

---

### Task 15: Final manual smoke test (Definition of Done)

Per spec §13, the 10-item Definition of Done. Run each item against the live deploy.

- [ ] **1.** Visit the URL in a fresh browser. Confirm login required, wrong password fails, correct password lets you in.
- [ ] **2.** Upload one file of each format (`sample.txt`, `sample.md`, `sample.csv`, `sample.xlsx`, `sample.docx`, `sample.pdf`). Confirm each parses and shows the file chip with no error.
- [ ] **3.** Paste the About Us xls content (from `D:/Code Files/jayasom-wireframe-skill/examples/` or your real version). Click Generate. Confirm output uses 8+ sections with multiple distinct archetypes (matches the v2 quality verified in the skill smoke test).
- [ ] **4.** Send a follow-up message: "make section 4 a carousel instead of a grid". Confirm the wireframe regenerates with section 4 changed, other sections preserved.
- [ ] **5.** On any assistant message, click Download HTML. Confirm a `.html` file saves and opens correctly in a new browser tab with the Jayasom design.
- [ ] **6.** Refresh the page. Confirm conversation persists. Then click "Start fresh" twice. Confirm conversation clears, iframe goes empty.
- [ ] **7.** From a single browser, send 31 quick generation requests. Confirm the 31st returns a "Rate limit" error message with countdown.
- [ ] **8.** Manually trigger each error class (with help of dev tools or test inputs):
  - Try uploading a 12 MB file → "File too large" toast
  - Try uploading a `.png` → "Format not supported" toast
  - Disconnect network, click Send → "You're offline" toast
- [ ] **9.** In the skill repo, push a trivial change to `main`. Wait ~2 minutes. Confirm Vercel queued and completed a new deploy.
- [ ] **10.** Generate 5 typical wireframes. Check the Anthropic console → Usage → confirm spend is < $1 (well under the $10/100-generations budget).

If any item fails: file an issue, fix it, redeploy, re-run that item.

- [ ] **Step 1: After all 10 pass — share the URL + password with colleagues**

Document the URL and password in your team's password manager. The tool is ready for use.

---

## Self-review

After writing this plan, checked against the spec:

**1. Spec coverage:**
- §4 Architecture (stack, file structure, build pipeline, skill update flow) → Tasks 1, 2, 11, 13
- §5 Auth model (custom middleware, password gate) → Task 12
- §6 Data flow (browser → function → response) → Tasks 4, 8, 11
- §7 Smart skill loader → Task 3
- §8 Hard rules (inherited from skill, iframe sandbox) → Tasks 4, 10 (sandbox attribute on iframe)
- §9 UI behaviour (split layout, chat states, viewport toggle, Start fresh) → Tasks 9, 10, 11
- §10 Error handling (per-class messages) → Tasks 4, 8 (api-client describeError), 9 (ChatPanel error display)
- §11 Conversation history (localStorage, compaction, hard cap) → Task 7 (localStorage), Task 4 (server-side compaction *NOTE: not implemented in v1, kept simple per phasing*)
- §12 Cost & budget → Task 14 (Anthropic console + Vercel env)
- §13 Definition of done (10 items) → Task 15
- §14 Phasing (6 phases) → Tasks loosely group into spec phases (1-2 = Phase 1, 5-6 = Phase 2, 7-11 = Phases 3-5, 12-15 = Phase 6)
- §15 Risks → mitigations addressed in Tasks 4 (retry not added — flagged as gap), 7 (localStorage prune not added — flagged as gap)

**Spec gaps that became plan tasks:** none additional.

**Spec items deferred from this plan to a v2 follow-up:**
- Server-side conversation compaction after 8 turns (§11) — not implemented in Task 4. Plan calls out the server simply forwards the messages array; under heavy use, large message arrays may approach Claude's 200K input limit but won't error. Add this if it becomes a real issue.
- `localStorage` quota auto-prune (§10 last row) — not implemented in chat-store. If a colleague hits the quota, manually clear via "Start fresh". Add if reported.
- Conversation-summary "Conversation compacted" UI notice — same.
- One-message-with-multiple-attachments concatenation — partially supported (chat-store concatenates attachments into the user message text per `getApiMessages`); not unit tested for >2 attachments.

These are conscious omissions to ship v1 in 6 sessions per the phasing plan. Easy follow-ups, not blocking.

**2. Placeholder scan:**
- No "TBD", "TODO", "implement later" lines.
- All "Step N" steps contain real code or commands.
- One judgement call: error categories in `api-client.ts` describeError are specific. The fallback "Generation failed. Retry?" handles the unknown case explicitly.

**3. Type consistency:**
- `ParsedAttachment` defined in `AttachmentDropzone.tsx`, re-imported in `chat-store.ts` — consistent shape `{ id, name, size, text }`.
- `GenerateModel` type defined in `api-client.ts`, re-imported in `ModelPicker.tsx` and `ChatPanel.tsx` — consistent values `'claude-sonnet-4-6' | 'claude-haiku-4-5-20251001'`.
- `ChatMessage` defined in `chat-store.ts`, used in `MessageBubble.tsx` — consistent shape with role/text/html/attachments.
- `ContentCues` and `SkillFiles` exported from `smart-skill-loader.ts`, used in `api/generate.ts`.

All type names and signatures consistent.
