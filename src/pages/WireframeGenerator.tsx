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
