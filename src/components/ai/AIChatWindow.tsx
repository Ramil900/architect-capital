"use client";

import { useState, useRef, useEffect } from "react";
import { Send, BrainCircuit } from "lucide-react";
import type { ChatMessage } from "@/types/ai";
import { quickQuestions, initialMessages } from "@/constants/aiData";

export default function AIChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput]       = useState("");
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text };

    const matched = quickQuestions.find((q) => q.label === text);
    const aiContent = matched?.answer ??
      "Анализирую данные... На данный момент у меня нет конкретного ответа на этот вопрос. Попробуйте один из предложенных вопросов.";

    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "ai", content: aiContent };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div
      className="rounded-lg border flex flex-col"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)", height: 480 }}
    >
      <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
        <BrainCircuit size={14} style={{ color: "var(--accent)" }} />
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          AI Strategy Terminal
        </p>
      </div>

      {/* Quick questions */}
      <div className="px-4 pt-3 flex flex-wrap gap-2">
        {quickQuestions.map((q) => (
          <button
            key={q.label}
            onClick={() => sendMessage(q.label)}
            className="text-xs px-2.5 py-1 rounded border transition-colors"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
              background: "var(--bg-hover)",
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed"
              style={
                msg.role === "user"
                  ? { background: "var(--accent)", color: "#fff" }
                  : { background: "var(--bg-hover)", color: "var(--text-secondary)", borderLeft: "2px solid var(--accent)" }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t flex items-center gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Задайте вопрос AI..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
        />
        <button
          type="submit"
          className="p-1.5 rounded transition-colors"
          style={{ color: "var(--accent)" }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
