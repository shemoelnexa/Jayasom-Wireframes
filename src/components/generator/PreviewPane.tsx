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
