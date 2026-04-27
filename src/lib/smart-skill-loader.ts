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
    files.skillMd,
    files.designTokensCss,
    files.outputTemplateHtml,
    files.componentLibraryHtml,
    extractSection(files.contentInferenceMd, 'Part A'),
    extractSection(files.contentInferenceMd, 'Part B'),
    extractSection(files.contentInferenceMd, 'Part C'),
    extractSection(files.contentInferenceMd, 'Part E'),
    extractSection(files.contentInferenceMd, 'Part F'),
    extractSection(files.contentInferenceMd, 'Part G'),
    extractSection(files.contentInferenceMd, 'Part H'),
  ];

  for (const slug of ALWAYS_ARCHETYPES) {
    const block = extractArchetype(files.sectionPatternsMd, slug);
    if (block) parts.push(block);
  }

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
  parts.push(extractSection(files.contentInferenceMd, 'Part D'));

  return parts.filter((p) => p !== '').join('\n');
}
