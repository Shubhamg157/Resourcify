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
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 border-[3px] border-brutalBlack text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-brutal cursor-pointer font-black text-2xl ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-brutalBlack'
        }`}
        aria-label={isOpen ? 'Close terminal' : 'Open AI terminal'}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* ─── Chat Panel ─── */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-8rem)]
                        bg-paper-100 border-[4px] border-brutalBlack shadow-brutal flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-5 py-3 border-b-[4px] border-brutalBlack bg-schoolYellow flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-black bg-white text-brutalBlack px-2 py-0.5 border-[2px] border-brutalBlack shadow-brutal-sm uppercase">
                  AI TERMINAL
                </span>
              </div>
              <span className="font-mono text-[10px] font-black uppercase text-brutalBlack">v4.2</span>
            </div>
            <p className="font-serif text-sm font-black text-brutalBlack mt-2">Study Assistant AI</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-8 border-[2.5px] border-dashed border-brutalBlack p-4 bg-paper-200">
                <p className="font-mono text-sm font-black text-brutalBlack mb-4 uppercase">
                  SYSTEM READY. AWAITING INPUT...
                </p>
                <div className="space-y-3">
                  {['Explain angular momentum', 'What should I study next?', 'Help me with kinematics formulas'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => { setInput(suggestion); }}
                      className="block w-full text-left px-3 py-2 text-xs font-bold font-mono bg-white border-[2px] border-brutalBlack hover:bg-retroTeal hover:text-white shadow-brutal-sm transition-colors cursor-pointer uppercase"
                    >
                      &gt; {suggestion}
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
                  className={`max-w-[85%] px-4 py-3 border-[2.5px] border-brutalBlack text-sm font-semibold shadow-brutal-sm ${
                    msg.role === 'user'
                      ? 'bg-schoolYellow text-brutalBlack'
                      : 'bg-paper-200 text-brutalBlack'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="font-mono text-[10px] font-black uppercase bg-brutalBlack text-white px-1.5 py-0.5 w-fit mb-2">
                      SYSTEM
                    </div>
                  )}
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-paper-200 border-[2.5px] border-brutalBlack shadow-brutal-sm px-4 py-3 flex items-center gap-2">
                  <div className="font-mono text-[10px] font-black uppercase bg-brutalBlack text-white px-1.5 py-0.5">
                    SYSTEM
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-brutalBlack animate-pulse" />
                    <span className="w-2.5 h-2.5 bg-brutalBlack animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 bg-brutalBlack animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t-[4px] border-brutalBlack bg-paper-100">
            <div className="flex items-stretch gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a doubt..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-sm font-mono font-bold bg-white border-[3px] border-brutalBlack shadow-brutal-sm
                           focus:outline-none focus:bg-schoolYellow-light
                           placeholder:text-neutral-400 disabled:opacity-60 uppercase"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-12 bg-brutalBlack text-white font-black text-xl border-[3px] border-brutalBlack flex items-center justify-center shadow-brutal-sm
                           hover:bg-retroTeal disabled:opacity-40 disabled:cursor-not-allowed
                           transition-colors flex-shrink-0 cursor-pointer"
              >
                ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
