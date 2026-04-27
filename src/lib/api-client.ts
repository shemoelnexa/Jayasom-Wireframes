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
