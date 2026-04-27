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

  const ready = pending.filter((p) => p.status === 'done');

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