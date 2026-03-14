import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { chatApi, type ChatMessage } from '../../api/chat';
import { useUIStore } from '../../store/uiStore';
import { timeAgo } from '../../utils/formatDate';
import type { Article } from '../../types/article';

interface ChatPanelProps {
  onArticleSelect: (article: Article) => void;
}

const SUGGESTIONS = [
  'What are the latest AI agent frameworks?',
  'Explain digital twins in smart cities',
  'Best resources to learn data science',
  'How is ML used in digital twins?',
];

export default function ChatPanel({ onArticleSelect }: ChatPanelProps) {
  const { isChatOpen, setIsChatOpen } = useUIStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isChatOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatApi.send(trimmed, messages);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        articles: response.articles,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsChatOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed right-4 bottom-4 top-20 z-50 w-[420px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            style={{ background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(24px)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <Sparkles size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">AI Assistant</p>
                  <p className="text-[10px] text-slate-500">Ask anything about AI, agents, digital twins & more</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="flex flex-col gap-4 mt-2">
                  <p className="text-xs text-slate-500 text-center">Ask me anything — I'll answer and show related articles</p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-left text-xs text-slate-300 px-3 py-2 rounded-xl border border-white/8 hover:border-primary/30 hover:bg-primary/5 transition-all"
                        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-primary/20 border border-primary/30'
                      : 'bg-indigo-900/40 border border-indigo-500/20'
                  }`}>
                    {msg.role === 'user' ? <User size={13} className="text-primary" /> : <Bot size={13} className="text-indigo-300" />}
                  </div>

                  <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {/* Bubble */}
                    <div
                      className="px-3 py-2.5 rounded-2xl text-sm leading-relaxed"
                      style={msg.role === 'user'
                        ? { background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.3)', color: '#e2e8f0' }
                        : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1' }
                      }
                    >
                      {msg.content}
                    </div>

                    {/* Related articles */}
                    {msg.articles && msg.articles.length > 0 && (
                      <div className="flex flex-col gap-1.5 w-full">
                        <p className="text-[10px] text-slate-500 px-1">Related articles</p>
                        {msg.articles.slice(0, 3).map(article => (
                          <button
                            key={article.id}
                            onClick={() => onArticleSelect(article)}
                            className="flex flex-col gap-0.5 px-3 py-2 rounded-xl text-left transition-all hover:bg-white/5 group"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                          >
                            <span className="text-xs text-slate-200 line-clamp-2 group-hover:text-white transition-colors">{article.title}</span>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-slate-500">{article.source_name} · {timeAgo(article.published_at || article.fetched_at)}</span>
                              <ExternalLink size={10} className="text-slate-600 group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-900/40 border border-indigo-500/20">
                    <Bot size={13} className="text-indigo-300" />
                  </div>
                  <div className="px-3 py-2.5 rounded-2xl flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Loader2 size={13} className="text-slate-400 animate-spin" />
                    <span className="text-xs text-slate-500">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: input.trim() && !isLoading ? 'rgba(99,102,241,0.4)' : 'transparent' }}
                >
                  <Send size={13} className="text-primary" />
                </button>
              </div>
              <p className="text-[10px] text-slate-600 text-center mt-2">Powered by Claude · Answers may not always be accurate</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
