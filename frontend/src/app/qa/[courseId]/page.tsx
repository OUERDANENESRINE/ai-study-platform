"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send } from "lucide-react";
import { askQuestion } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  text: string;
  sources?: number[];
};

export default function QAPage() {
  const params = useParams();
  const courseId = Number(params.courseId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const data = await askQuestion(courseId, question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer, sources: data.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Une erreur est survenue, réessaie." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="min-h-screen bg-[#F4E9F8] flex justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col h-[90vh]">
        

        {/* Zone de chat */}
        <div className="bg-[#EAD4F0] rounded-2xl p-4 flex-1 overflow-y-auto flex flex-col gap-3">
          {messages.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-10">
              Pose une question sur ton cours
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-[#B15FCB] text-white self-end"
                  : "bg-white text-gray-800 self-start"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.sources && msg.sources.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  Sources : pages {msg.sources.join(", ")}
                </p>
              )}
            </div>
          ))}

          {loading && (
            <div className="bg-white rounded-xl px-4 py-3 self-start text-sm text-gray-400">
              En train de réfléchir...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 mt-4 bg-white rounded-full px-4 py-2 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Question ? blaablablaa"
            className="flex-1 outline-none text-sm text-gray-700"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="text-[#B15FCB] disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}