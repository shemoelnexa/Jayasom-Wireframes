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
