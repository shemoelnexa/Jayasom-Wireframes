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
    expect(text).toContain('Hello world');
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

  // .docx fixture creation requires extra tooling; smoke-tested manually in Task 11
  it.skip('parses .docx into plain text', async () => {
    const file = loadFixture('sample.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const text = await parseAttachment(file);
    expect(text).toContain('Hello');
  });

  // .pdf fixture creation requires extra tooling; smoke-tested manually in Task 11
  it.skip('parses .pdf into plain text', async () => {
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
