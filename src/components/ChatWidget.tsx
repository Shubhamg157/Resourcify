'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on first open
  useEffect(() => {
    if (isOpen && !hasLoaded) {
      fetch('/api/chat')
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages || []);
          setHasLoaded(true);
        })
        .catch(() => setHasLoaded(true));
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, hasLoaded]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Optimistic add
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: 'user', content: userMessage, createdAt: new Date().toISOString() },
    ]);

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `resp-${Date.now()}`,
          role: 'assistant',
          content: data.content || data.error || 'Sorry, I had trouble understanding that.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Connection error. Please try again.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ─── FAB Button ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-crimson text-white rounded-full shadow-lg
                   flex items-center justify-center hover:bg-crimson-light
                   transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label={isOpen ? 'Close chat' : 'Open study assistant'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* ─── Chat Panel ─── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)]
                        bg-white border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-pearl flex items-center gap-3">
            <div className="w-8 h-8 bg-crimson rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold font-[family-name:var(--font-serif)]">R</span>
            </div>
            <div>
              <p className="text-sm font-bold text-obsidian font-[family-name:var(--font-serif)]">Study Assistant</p>
              <p className="text-xs text-obsidian-subtle">Ask about concepts, formulas, or what to study next</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-sm text-obsidian-subtle mb-3">
                  👋 Hi! I&apos;m your study assistant.
                </p>
                <div className="space-y-2">
                  {['Explain angular momentum', 'What should I study next?', 'Help me with kinematics formulas'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => { setInput(suggestion); }}
                      className="block w-full text-left px-3 py-2 text-xs bg-pearl hover:bg-pearl-dark rounded-lg
                                 text-obsidian-subtle hover:text-obsidian transition-colors cursor-pointer"
                    >
                      &ldquo;{suggestion}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-crimson text-white rounded-br-sm'
                      : 'bg-pearl text-obsidian rounded-bl-sm border border-border/60'
                  }`}
                >
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-pearl border border-border/60 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-obsidian-subtle rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-obsidian-subtle rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-obsidian-subtle rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a doubt or concept question..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 text-sm bg-pearl border border-border rounded-xl
                           focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson
                           placeholder:text-obsidian-subtle/50 disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-crimson text-white rounded-xl flex items-center justify-center
                           hover:bg-crimson-light disabled:opacity-40 disabled:cursor-not-allowed
                           transition-colors flex-shrink-0 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
