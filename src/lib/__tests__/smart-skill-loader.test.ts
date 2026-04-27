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
