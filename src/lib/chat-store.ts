import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ParsedAttachment } from '@/components/generator/AttachmentDropzone';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string; // user prompt or assistant confirmation
  attachments?: ParsedAttachment[]; // user only
  html?: string; // assistant only — the generated HTML
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  currentHtml: string | null;
  isGenerating: boolean;
  errorMessage: string | null;

  addUserMessage: (input: { text: string; attachments: ParsedAttachment[] }) => void;
  addAssistantMessage: (input: { confirmation: string; html: string }) => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (message: string | null) => void;
  clear: () => void;

  // Returns the messages formatted for /api/generate
  getApiMessages: () => Array<{ role: 'user' | 'assistant'; content: string }>;
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      currentHtml: null,
      isGenerating: false,
      errorMessage: null,

      addUserMessage: ({ text, attachments }) =>
        set((s) => ({
          messages: [...s.messages, {
            id: newId(),
            role: 'user',
            text,
            attachments,
            timestamp: Date.now(),
          }],
          errorMessage: null,
        })),

      addAssistantMessage: ({ confirmation, html }) =>
        set((s) => ({
          messages: [...s.messages, {
            id: newId(),
            role: 'assistant',
            text: confirmation,
            html,
            timestamp: Date.now(),
          }],
          currentHtml: html,
          errorMessage: null,
        })),

      setGenerating: (isGenerating) => set({ isGenerating }),

      setError: (errorMessage) => set({ errorMessage, isGenerating: false }),

      clear: () => set({ messages: [], currentHtml: null, isGenerating: false, errorMessage: null }),

      getApiMessages: () =>
        get().messages.map((m) => {
          if (m.role === 'user') {
            const attachmentText = (m.attachments ?? [])
              .map((a) => `\n\n--- attachment: ${a.name} ---\n${a.text}\n--- end attachment ---\n`)
              .join('');
            return { role: 'user' as const, content: m.text + attachmentText };
          }
          return { role: 'assistant' as const, content: m.html ?? m.text };
        }),
    }),
    {
      name: 'jayasom-wireframe-generator-chat',
      storage: createJSONStorage(() => localStorage),
      // Avoid persisting transient UI state
      partialize: (s) => ({ messages: s.messages, currentHtml: s.currentHtml }),
    }
  )
);
