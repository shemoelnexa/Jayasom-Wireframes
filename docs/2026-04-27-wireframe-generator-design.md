# Jayasom Wireframe Generator — Web App Design Spec

**Date:** 2026-04-27
**Author:** Shemoel (with Claude)
**Status:** Approved (pending user review)
**Lives in:** the existing `jayasom-wireframe-files` project (Vite + React + shadcn)
**New route:** `/wireframe-generator`

## 1. Goal

Build a web-based wrapper around the `jayasom-wireframe` skill that lets internal users generate Jayasom-branded wireframes through a chat interface. User pastes content (or uploads a file in any of 6 formats), iterates with the model, and downloads the resulting self-contained HTML file. Hosted on Vercel Hobby (free), inference cost minimised through model + caching choices.

## 2. Non-goals

- Public access (internal-only, password-gated)
- Multi-user accounts or per-user data
- Saved-conversation library / wireframe gallery
- Per-user rate limits or billing
- Programmatic API for external automation
- Image generation / OCR
- Editing a downloaded HTML file (uploads accept content briefs, not output HTML)
- Replacing the existing wireframe demo site — this is an additional route alongside it

## 3. User stories

- *As Shemoel*, I open `/wireframe-generator`, paste a brief, click Generate, and watch the wireframe render in a live preview pane on the right. If anything's off I type a follow-up like "make section 4 a carousel" and the preview updates.
- *As a colleague*, I'm given a URL + shared password, log in, do the same thing without help.
- *As Shemoel maintaining the skill*, when I push a v3 update to the skill repo, the deployed app picks up the new skill on the next deploy (auto-triggered by a webhook).

## 4. Architecture

### 4.1 Stack additions to the wireframe project

```json
new dependencies:
  "@anthropic-ai/sdk"     // server-side, in api/generate.ts only
  "xlsx"                  // client-side: .xls, .xlsx, .csv parsing
  "mammoth"               // client-side: .docx parsing
  "pdfjs-dist"            // client-side: .pdf parsing
  "zustand"               // client-side: chat state + localStorage persistence
  "zod"                   // server-side: request schema validation
  "@vercel/node"          // type definitions for the function
```

No new auth library — auth is a custom edge middleware that checks an env-var password. Vercel Password Protection is a Pro feature, not used.

### 4.2 New files

```
api/
└── generate.ts                           Vercel Edge Function — calls Anthropic SDK
middleware.ts                             custom shared-password gate (edge middleware)

src/
├── pages/
│   └── WireframeGenerator.tsx            new page: split chat + preview
├── components/
│   └── generator/
│       ├── ChatPanel.tsx                 left side: message list + composer
│       ├── PreviewPane.tsx               right side: iframe + download + viewport toggle
│       ├── AttachmentDropzone.tsx        file picker + drag-drop + parse status
│       ├── MessageBubble.tsx             single message rendering
│       ├── ModelPicker.tsx               Sonnet (default) / Haiku (cheap) toggle
│       └── LoginScreen.tsx               password-gate UI when middleware blocks
├── lib/
│   ├── skill-content.ts                  GENERATED at build time — exports skill files as strings
│   ├── parse-attachment.ts               dispatcher: file → extracted text
│   ├── api-client.ts                     fetch helper for /api/generate
│   ├── chat-store.ts                     zustand store (messages, currentHtml, persistence)
│   └── smart-skill-loader.ts             reduces skill to only relevant rules per request

scripts/
└── fetch-skill.mjs                       runs in `prebuild`, pulls skill files from private GitHub
```

### 4.3 Routing

`App.tsx` adds: `<Route path="/wireframe-generator" element={<WireframeGenerator />} />`

`Index.tsx` (the existing wireframe list) gains a small "Open the generator →" link in the header.

### 4.4 Build pipeline

1. `npm install` — installs new deps
2. `prebuild` script runs `scripts/fetch-skill.mjs`:
   - Reads `GITHUB_TOKEN` env var (required at build time)
   - Fetches the 6 skill files from `Jayasom-wireframe-generator` raw URLs
   - Writes `src/lib/skill-content.ts` exporting them as strings
3. `vite build` — bundles SPA
4. Vercel deploys: SPA + Edge Function under `/api/generate`

### 4.5 Skill update flow

GitHub Action in the skill repo (`Jayasom-wireframe-generator`):
- Triggers on push to `main`
- Calls a Vercel Deploy Hook URL (one-line config in Vercel UI)
- Wireframe project auto-redeploys with the latest skill bundled

Net delay from skill push to live update: ~2 min.

## 5. Auth model

**No code in the SPA handles auth.** Custom edge middleware (`middleware.ts`) checks every incoming request:

- Reads `APP_PASSWORD` env var (set in Vercel project)
- Reads `auth` cookie from the request
- If cookie matches the env password (compared securely): passes through
- Otherwise: returns the `LoginScreen` HTML for non-API routes, or `401` for API routes

`LoginScreen.tsx` posts the entered password to a small login route (also handled by middleware), which sets the `auth` cookie on success and redirects.

The shared password is set in Vercel UI as an env var. Rotate by changing it in the dashboard. No DB, no per-user accounts.

This is mildly less polished than Vercel Password Protection but functionally equivalent and free.

## 6. Data flow (one chat turn)

```
[BROWSER]
1. User types prompt + (optionally) drags a file into the dropzone
2. AttachmentDropzone extracts text (xlsx | mammoth | pdfjs | utf-8 read)
3. ChatPanel adds a user message to chat-store (text + parsed attachment text)
4. api-client POSTs to /api/generate:
   { messages, model: "claude-sonnet-4-6" | "claude-haiku-4-5" }
   The latest user message body = prompt + extracted attachment text
5. UI shows "Generating…" with elapsed-time counter

[VERCEL EDGE FUNCTION /api/generate]
6. Validates request shape with zod
7. Checks per-IP rate limit (in-memory Map, 30 req/hour)
8. Builds system prompt:
   a. Parses the latest user message to detect content shape (list-of-named-items?
      thematic narrative? quote? table?)
   b. smart-skill-loader picks ONLY relevant rules + archetypes for this content,
      reducing skill prompt from ~40K → ~12K tokens
   c. Composes: SKILL.md core (always) + relevant rules from content-inference.md
      + relevant archetype HTMLs from section-patterns.md + design-tokens.css
      + component-library.html + output-template.html
9. Calls Anthropic SDK:
   - model: from request (default sonnet-4-6)
   - system: <smart-loaded prompt with cache_control breakpoint>
   - messages: <conversation history from request>
   - max_tokens: 16000
10. Receives assistant response (single HTML doc + short text confirmation)
11. Post-process: extract <!doctype...</html> as html, the rest as confirmation
12. Returns JSON: { confirmation: "...", html: "<!doctype html>..." }

[BROWSER]
13. api-client receives the response
14. chat-store appends the assistant message (text + reference to currentHtml)
15. PreviewPane swaps iframe srcdoc → preview updates with 200ms cross-fade
16. Each assistant message has its own download button (creates blob URL on click)
```

## 7. Smart skill loader (key cost optimisation)

A function (`smart-skill-loader.ts`, server-side) that reduces the system prompt by sending only the parts of the skill needed for the current content shape.

### 7.1 What's always included

- `SKILL.md` core (workflow, hard rules, self-check) — ~3K tokens
- `design-tokens.css` (must be embedded verbatim) — ~2K tokens
- `component-library.html` site-header + site-footer + wire-image blocks — ~3K tokens
- `output-template.html` skeleton — ~0.5K tokens
- Part A (parser) + Part B (page-type classifier) of `content-inference.md` — ~2K tokens
- Part F (derived strings) + Part G (count check) — ~1K tokens

**Always-included total: ~12K tokens.**

### 7.2 What's conditionally included

After Part A parsing (lightweight pattern-match in TypeScript), include only the relevant parts:

| Detected content cue | Include from skill |
|---|---|
| List of 3+ named items | `card-grid-3`, `card-grid-4`, `card-grid-2-wide`, `carousel-horizontal`, `load-more-grid`, `icon-card-grid-3`, `icon-card-grid-4` |
| Quote present | `pull-quote` |
| Tabular / comparison | `comparison-table` |
| Sequential steps (3–4) | `process-steps`, `process-steps-icon-variant` |
| Day/phase timeline (5+) | `vertical-timeline` |
| Audience split | `tab-segmented-content` |
| Multi-paragraph H2 narrative | `prose-article-body`, `alternating-image-text-extended`, `intro-split` |
| 3+ thematic H3 sub-sections | `alternating-image-text-extended` |
| Person bios (3+) | `bio-grid` |
| At-a-glance facts | `stats-row`, `detail-with-sidebar` |
| Inline disclaimer / note | `bordered-callout`, `centered-note` |
| Always: hero variants + CTA variants + related-grid | All 4 hero archetypes + 2 CTA archetypes + related-grid |
| Always: anti-monotony rules | Part E (5+ distinct, no repeat consecutively) |
| Always: enrichment rules H1, H4, H5, H6 | Part H |
| Conditionally: Part C Tier 1 narrative rules | Always (small, high-impact) |
| Conditionally: Part D flow template | Only the template for the classified page type |

### 7.3 Expected token reduction

| Content shape | Approx. system prompt tokens | Notes |
|---|---|---|
| Simple listing (e.g., treatments page) | ~10K | No bio-grid, no timeline, no comparison-table |
| About-us / overview narrative | ~14K | Adds narrative rules + bio-grid |
| Detail page with stats | ~12K | Adds stats-row + advisory-alerts + detail-with-sidebar |
| Worst case (everything) | ~18K | Still 55% reduction from full skill |

### 7.4 Risk and mitigation

If the skill rules ever cross-reference an archetype that wasn't loaded (e.g., Part E mentions an archetype the loader didn't include), the model could try to use it without the HTML snippet. Mitigation:

- Always include the *complete* lists of archetype slugs from Part C in the loaded prompt, even if specific archetype HTMLs are skipped — so the model knows which exist
- For any archetype not loaded, the smart-loader includes a one-line stub: `<!-- archetype <slug> exists but its HTML is not loaded; if needed, fall back to an included archetype with similar shape -->`
- Self-check #1 (verify embedded design tokens) catches gross issues — if it fails, function retries with the full skill

The loader is conservative — when in doubt, include. Better to spend an extra $0.02 than skip a rule the model needed.

## 8. Hard rules

### Branding & content fidelity (inherited from the skill)
- Output HTML matches the skill's hard rules (locked tokens, content fidelity, visual rhythm)
- The web app does not modify, paraphrase, or post-process the HTML beyond extracting it from the model response

### App-level constraints
- Conversation state lives in localStorage only — no database, no backend persistence
- File parsing happens client-side — file binaries never leave the user's browser
- Generated HTML is rendered in `<iframe sandbox="allow-same-origin">` — no script execution from generated content
- Function rejects requests with malformed schema or unknown fields (zod strict mode)

## 9. UI behaviour

### Layout

Fixed full-viewport split:

```
┌──── header: Jayasom · Wireframe Generator · [Start fresh] ────┐
├────────────────────────┬─────────────────────────────────────┤
│  CHAT (40% / drawer)   │  PREVIEW (60% / full on mobile)     │
│  • message list        │  • iframe srcdoc=<latest html>      │
│  • composer:           │  • viewport toggle (desktop/tablet) │
│    - attach button     │  • open in new tab                  │
│    - text input        │  • download HTML                    │
│    - model picker      │                                     │
│    - send              │                                     │
└────────────────────────┴─────────────────────────────────────┘
```

### Chat behaviour

- User bubble: right-aligned, `--foreground` background, attachments shown as chips
- Assistant bubble: left-aligned, plain text confirmation + collapsible section list + download button
- Cmd/Ctrl+Enter sends; Enter inserts newline
- Send disabled while a generation is in flight
- Model picker (Sonnet default; Haiku opt-in) sits next to the send button
- Each historic assistant message is independently downloadable

### Generation states

- Idle / Parsing attachment / Generating (with elapsed-time) / Error (red border + retry button)

### Preview behaviour

- Empty state on first load
- iframe `srcdoc` swap with 200ms cross-fade between versions
- Viewport toggle resizes the iframe wrapper (same HTML, different container width)
- Open-in-new-tab uses a blob URL
- Download produces `wireframe-<slugified-title>.html`

### "Start fresh" button

- Confirmation dialog ("Clear conversation?")
- Wipes chat-store + localStorage
- Resets iframe to empty state

## 10. Error handling

Per Section 4 of the brainstorming summary:

| Error | Surface |
|---|---|
| File >10 MB | Toast on attach |
| Unsupported format | Toast on attach |
| Parse failure | Toast + "paste content directly" hint |
| Empty parsed content | Inline message before send |
| Rate limit (30/hour/IP) | Assistant bubble: "Rate limit — try again in N min" + countdown |
| Anthropic API error | Assistant bubble: error class + retry button |
| Quota / billing error | Distinguished message: "Monthly budget reached — contact admin" |
| Function timeout | "Generation took too long — try smaller content" |
| Malformed HTML in response | "Generated copy but HTML wasn't well-formed — retry" |
| localStorage quota | Auto-prune oldest messages with HTML payloads |
| Network offline | Toast + send button disabled until back online |

## 11. Conversation history management

- All turns stored in `chat-store` (zustand) and persisted to localStorage
- Refresh keeps conversation
- After 8 turns, the function silently summarises older turns into a single "earlier conversation summary" message before sending — keeps total input tokens manageable
- Hard cap: 30 turns per conversation, after which "Start fresh" is required

## 12. Cost & token budget

### Per-turn cost (Sonnet 4.6 default)

| | Input tokens | Output tokens | Cold cost | Warm cost |
|---|---|---|---|---|
| Simple listing | ~10K | ~3K | $0.075 | $0.025 |
| About-us narrative | ~14K | ~7K | $0.147 | $0.045 |
| Detail page | ~12K | ~5K | $0.111 | $0.035 |
| Worst case | ~18K | ~10K | $0.204 | $0.060 |

Prompt caching kicks in on the 2nd request within 5 min of inactivity (90% off cached input).

### Monthly cost estimate

| Usage | Estimated monthly cost |
|---|---|
| Light (50 turns) | ~$3–5 |
| Medium (200 turns) | ~$10–15 |
| Heavy (500 turns) | ~$25–35 |

Anthropic console hard limit: **$50/month** (set as backstop; can raise later).

### Cost monitoring

- Vercel function logs include the model used + input/output token counts per request (no content)
- Weekly Anthropic billing email shows actual spend
- If approaching the $50 cap, the function returns a "Monthly budget reached" error gracefully

## 13. Definition of done

The web app is shippable when:

1. Custom password gate works (correct pw → app; wrong pw → login screen; no API access without auth)
2. All 6 file formats parse and produce sensible text from real-world fixtures
3. Generating from the About Us xls produces output indistinguishable from the skill's direct output (smoke-test parity)
4. Iterative refinement turns produce changed output ("make section 4 a carousel" actually produces a carousel)
5. Per-message download produces a valid self-contained HTML file
6. Conversation persists across refresh, "Start fresh" actually clears
7. Rate limit triggers cleanly at 31st request/hour
8. Each error class from Section 10 is reachable and shows the right message
9. Skill update flow: pushing to skill repo `main` triggers a redeploy within 2 min, new skill is live
10. Cost ceiling: 100 generations/month should cost under $10 against the Anthropic account

## 14. Phasing

| Phase | Scope | Output |
|---|---|---|
| 1 | Backend wiring: API endpoint, Anthropic SDK, fetch-skill script, smart loader | curl-callable `/api/generate` produces valid HTML |
| 2 | Attachment parsing: 6-format dispatcher + dropzone UI | Drop file → see extracted text in console |
| 3 | Chat shell: messages + composer + zustand store + localStorage + stub backend | Fake conversation persists across refresh |
| 4 | Preview pane: iframe + viewport toggle + download | Split layout works against stub |
| 5 | Wire backend: replace stub with real API + error handling + rate limiter + caching | End-to-end real generation |
| 6 | Polish: password gate + GitHub Action webhook + manual test pass + deploy | Live URL handed to colleagues |

Estimate: ~6 focused sessions plus deploy.

## 15. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Sonnet output quality drops on smart-loaded prompt vs full skill | Conservative loader (always include if uncertain); fall back to full skill on self-check failure |
| Anthropic API rate-limited / overloaded | Function retries once with exponential backoff; surfaces clear error after 2 attempts |
| GitHub raw URLs blocked / private-repo token expires | `fetch-skill.mjs` fails the build with a clear error; can rotate token without code change |
| Vercel Hobby Edge runtime cold-start latency | First request after idle takes ~1s extra; acceptable for internal tool |
| User uploads encrypted PDF | Parser detects + falls back to "couldn't read" error; user can paste content directly |
| Conversation grows past localStorage quota (~5 MB) | Auto-prune HTML payloads from older messages, keep text |
| Attachment file >10 MB | Client-side cap; toast asks user to paste or split |

## 16. Decisions made during brainstorming

- **Audience:** internal-only, password-gated (Q1A)
- **Server side:** Vercel Functions added to existing Vite project (Q2A)
- **Interaction model:** full conversational chat (Q3C)
- **Layout:** chat + live preview pane split view (Q4B)
- **File formats:** XLS, XLSX, CSV, PDF, MD, TXT, DOCX (six total) (Q5 expanded)
- **Skill loading:** bundle at build time via `prebuild` script + GitHub Action redeploy webhook (Q6A)
- **Cost target:** Vercel Hobby (free) + minimal Anthropic spend
- **Model default:** Sonnet 4.6 (verified quality) with optional Haiku 4.5 toggle for simple tweaks
- **Auth library:** custom shared-password middleware (Vercel Password Protection is Pro-only, replaced)
- **Function runtime:** Edge (60s timeout on Hobby vs Node 10s)

## 17. Out of scope (explicitly deferred)

- Multi-user accounts
- Cross-device conversation sync
- Per-user rate limits or quotas
- Programmatic API for external automation
- Image / OCR
- Wireframe gallery / saved-conversation library
- Edit-uploaded-HTML mode
- Side-by-side model comparison UI
- Side-by-side viewport preview (only one at a time)
- Auth via SSO / OAuth
- Mobile-native client
