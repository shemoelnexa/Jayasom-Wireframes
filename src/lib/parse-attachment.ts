// Dispatches a File to the appropriate parser based on its mime type or extension.
// Returns extracted plain text. Runs entirely in the browser — file binaries
// never leave the client until the user explicitly sends.

import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
// pdfjs is imported lazily inside parsePdf() to avoid crashing non-browser
// environments (e.g. jsdom in tests) where DOMMatrix is not defined.

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
// Imported lazily so the module doesn't crash in jsdom/node test environments
// where DOMMatrix is not defined.
async function parsePdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
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
