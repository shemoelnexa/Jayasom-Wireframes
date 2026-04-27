import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChatStore } from '@/lib/chat-store';
import { callGenerate, describeError, type GenerateModel } from '@/lib/api-client';
import { MessageBubble } from './MessageBubble';
import { AttachmentDropzone, type ParsedAttachment } from './AttachmentDropzone';
import { ModelPicker } from './ModelPicker';

export function ChatPanel() {
  const messages = useChatStore((s) => s.messages);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const errorMessage = useChatStore((s) => s.errorMessage);
  const addUserMessage = useChatStore((s) => s.addUserMessage);
  const addAssistantMessage = useChatStore((s) => s.addAssistantMessage);
  const setGenerating = useChatStore((s) => s.setGenerating);
  const setError = useChatStore((s) => s.setError);
  const getApiMessages = useChatStore((s) => s.getApiMessages);

  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ParsedAttachment[]>([]);
  const [model, setModel] = useState<GenerateModel>('claude-sonnet-4-6');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const send = async () => {
    if (isGenerating) return;
    const text = input.trim();
    if (!text && pendingAttachments.length === 0) return;
    addUserMessage({ text: text || '(see attached)', attachments: pendingAttachments });
    setInput('');
    setPendingAttachments([]);
    setGenerating(true);
    const apiMessages = getApiMessages();
    const res = await callGenerate({ messages: apiMessages, model });
    setGenerating(false);
    if (res.ok) {
      addAssistantMessage({ confirmation: res.confirmation, html: res.html });
    } else {
      setError(describeError(res));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-border">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Send a message or upload content to generate your first wireframe.
          </p>
        )}
        {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Generating wireframe…</span>
          </div>
        )}
        {errorMessage && (
          <div className="border border-destructive bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="border-t border-border p-3 space-y-2">
        <AttachmentDropzone disabled={isGenerating} onAttachmentsReady={(a) => setPendingAttachments((prev) => [...prev, ...a])} />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          rows={3}
          placeholder="Type your prompt… (Ctrl/Cmd+Enter to send)"
          className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between">
          <ModelPicker value={model} onChange={setModel} disabled={isGenerating} />
          <button
            onClick={send}
            disabled={isGenerating || (!input.trim() && pendingAttachments.length === 0)}
            className="text-xs flex items-center gap-1 border border-foreground bg-foreground text-background px-3 py-2 disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
