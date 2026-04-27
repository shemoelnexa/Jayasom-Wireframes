import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '../chat-store';

describe('useChatStore', () => {
  beforeEach(() => {
    useChatStore.getState().clear();
  });

  it('starts empty', () => {
    expect(useChatStore.getState().messages).toEqual([]);
    expect(useChatStore.getState().currentHtml).toBeNull();
    expect(useChatStore.getState().isGenerating).toBe(false);
  });

  it('appends user messages', () => {
    useChatStore.getState().addUserMessage({ text: 'Hello', attachments: [] });
    expect(useChatStore.getState().messages).toHaveLength(1);
    expect(useChatStore.getState().messages[0].role).toBe('user');
    expect(useChatStore.getState().messages[0].text).toBe('Hello');
  });

  it('appends assistant messages and updates currentHtml', () => {
    useChatStore.getState().addAssistantMessage({
      confirmation: 'Generated 5 sections',
      html: '<!doctype html><html></html>',
    });
    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].role).toBe('assistant');
    expect(state.currentHtml).toBe('<!doctype html><html></html>');
  });

  it('toggles isGenerating', () => {
    useChatStore.getState().setGenerating(true);
    expect(useChatStore.getState().isGenerating).toBe(true);
    useChatStore.getState().setGenerating(false);
    expect(useChatStore.getState().isGenerating).toBe(false);
  });

  it('clears all state', () => {
    useChatStore.getState().addUserMessage({ text: 'x', attachments: [] });
    useChatStore.getState().addAssistantMessage({ confirmation: 'y', html: '<!doctype html></html>' });
    useChatStore.getState().clear();
    const state = useChatStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.currentHtml).toBeNull();
    expect(state.isGenerating).toBe(false);
  });

  it('returns ANTHROPIC-format messages for the API', () => {
    useChatStore.getState().addUserMessage({
      text: 'Wireframe this',
      attachments: [{ id: '1', name: 'a.md', size: 100, text: '# Title\n\npara' }],
    });
    const apiMessages = useChatStore.getState().getApiMessages();
    expect(apiMessages).toHaveLength(1);
    expect(apiMessages[0].role).toBe('user');
    expect(apiMessages[0].content).toContain('Wireframe this');
    expect(apiMessages[0].content).toContain('# Title');
    expect(apiMessages[0].content).toContain('a.md');
  });
});
