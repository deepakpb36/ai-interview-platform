import React, { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { askInterviewCoach } from "../utils/aiCoach";

const WELCOME_MESSAGE = {
  role: "assistant",
  text: "Hi Deepak! I’m your AI Interview Coach. Ask me anything about React, JavaScript, Python, Java, HR interviews, resumes, or interview preparation.",
};

function AIAssistant({ category = "General" }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;

    const userMessage = { role: "user", text: prompt };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages
        .filter((m) => m !== WELCOME_MESSAGE)
        .slice(-10);

      const reply = await askInterviewCoach(prompt, category, history);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply || "Sorry, I couldn’t generate a response.",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect to Gemini right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Interview Coach
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Powered by Gemini
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-950/40">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={idx}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-700 rounded-bl-md"
                }`}
              >
                <div className="flex items-start gap-2">
                  {!isUser && (
                    <Bot size={16} className="mt-0.5 text-blue-500 flex-shrink-0" />
                  )}
                  {isUser && (
                    <User size={16} className="mt-0.5 text-white flex-shrink-0" />
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Loader2 size={16} className="animate-spin text-blue-500" />
              Thinking…
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about interview questions, answers, projects, or HR preparation…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white flex items-center justify-center transition-colors"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;