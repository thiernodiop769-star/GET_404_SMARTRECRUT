import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, X, MessageSquare } from 'lucide-react';
import { getAgentResponse, suggestedPrompts, type AgentMessage } from '@/lib/agentEngine';
import type { Candidate } from '@/data/candidates';

interface AgentWidgetProps {
  candidates: Candidate[];
}

const welcome: AgentMessage = {
  id: 'welcome',
  role: 'agent',
  text: "Bonjour, je suis myrecrut, votre assistant IA de recrutement. Posez-moi une question sur vos candidats ou choisissez une suggestion ci-dessous.",
  timestamp: Date.now(),
};

export default function AgentWidget({ candidates }: AgentWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([welcome]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: AgentMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    const response = getAgentResponse(trimmed, candidates);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'agent',
          text: response,
          timestamp: Date.now(),
        },
      ]);
    }, 700);
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-corporate-700 text-white shadow-xl shadow-corporate-700/30 transition-all hover:bg-corporate-800 hover:scale-105 ${
          open ? 'px-4 py-3.5' : 'h-14 w-14 justify-center'
        }`}
        aria-label="Ouvrir myrecrut"
      >
        {open ? (
          <>
            <X className="h-5 w-5" />
            <span className="text-sm font-semibold pr-1">Fermer</span>
          </>
        ) : (
          <span className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent-500 ring-2 ring-white" />
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm sm:max-w-md animate-fade-up">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden" style={{ height: 'min(70vh, 560px)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 bg-corporate-700 px-4 py-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                  myrecrut
                  <Sparkles className="h-3.5 w-3.5 text-accent-400" />
                </p>
                <p className="text-xs text-corporate-200 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Assistant IA — en ligne
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-corporate-200 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-corporate-700 text-white rounded-br-sm'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-white border border-slate-200 px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 bg-slate-50">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-full border border-corporate-200 bg-white px-3 py-1.5 text-xs font-medium text-corporate-700 hover:bg-corporate-50 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-slate-200 bg-white p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4 text-slate-300 shrink-0" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question à myrecrut…"
                  className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-corporate-700 text-white transition hover:bg-corporate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
