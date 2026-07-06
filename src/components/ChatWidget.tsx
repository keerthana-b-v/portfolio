"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Bot, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  text: string;
  sender: "user" | "assistant";
  isStreaming?: boolean;
}

const SUGGESTIONS = [
  "What stack does she work with?",
  "Has she deployed to production?",
  "Tell me about her AI experience",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
      }
    }, 1200);

    const hideTimeout = setTimeout(() => {
      setShowTooltip(false);
    }, 5200);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowTooltip(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || exchangeCount >= 6 || isSending) return;

    const userMsg: Message = { text: trimmed, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setExchangeCount((prev) => prev + 1);
    setIsSending(true);

    const assistantMsgPlaceholder: Message = { text: "", sender: "assistant", isStreaming: true };
    setMessages((prev) => [...prev, assistantMsgPlaceholder]);

    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const API_URL = isLocal 
      ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/chat") 
      : "/api/chat";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat service is currently offline.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          if (!event.startsWith("data:")) continue;
          const raw = event.slice(5).trim();
          if (!raw || raw === "[DONE]") continue;

          let payload;
          try {
            payload = JSON.parse(raw);
          } catch {
            continue;
          }

          answer += payload.content || "";
          
          if (answer.includes("[CTA_CONTACT]")) {
            answer = answer.replace("[CTA_CONTACT]", "You can contact Keerthana at keerthana.b.v.codes@gmail.com");
          }

          setMessages((prev) => {
            const updated = [...prev];
            const lastMsgIndex = updated.length - 1;
            if (lastMsgIndex >= 0 && updated[lastMsgIndex].sender === "assistant") {
              updated[lastMsgIndex] = {
                text: answer,
                sender: "assistant",
                isStreaming: true,
              };
            }
            return updated;
          });
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        const lastMsgIndex = updated.length - 1;
        if (lastMsgIndex >= 0 && updated[lastMsgIndex].sender === "assistant") {
          updated[lastMsgIndex] = {
            text: answer,
            sender: "assistant",
            isStreaming: false,
          };
        }
        return updated;
      });

    } catch (error) {
      console.error("RAG assistant error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsgIndex = updated.length - 1;
        if (lastMsgIndex >= 0 && updated[lastMsgIndex].sender === "assistant") {
          updated[lastMsgIndex] = {
            text: "Something went wrong. You can reach out to Keerthana directly at keerthana.b.v.codes@gmail.com",
            sender: "assistant",
            isStreaming: false,
          };
        }
        return updated;
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  return (
    <>
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed z-[60] bottom-[11rem] left-4 md:bottom-[110px] md:left-auto md:right-6 px-4 py-2 bg-black text-white text-sm rounded-full shadow-lg pointer-events-auto"
          >
            Ask about my work &rarr;
          </motion.div>
        )}
      </AnimatePresence>



      {/* Trigger Button */}
      <motion.div 
        drag 
        dragConstraints={{ top: -800, left: -1000, right: 0, bottom: 0 }} 
        dragElastic={0} 
        dragMomentum={false}
        className="fixed bottom-28 right-4 md:bottom-6 md:right-6 md:left-auto md:top-auto z-[9999] pointer-events-auto font-sans"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute z-[60] bottom-[110%] right-[-10px] md:right-0 md:left-auto md:translate-x-0 w-[85vw] md:w-96 sm:w-[28rem] bg-slate-50/95 backdrop-blur-2xl border border-gray-200 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] pointer-events-auto overflow-hidden flex flex-col cursor-default origin-bottom-right"
              style={{ maxHeight: "80vh" }}
            >
              {/* Header */}
              <div className="bg-white/50 border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-black text-white p-2 rounded-full">
                    <Bot size={18} />
                  </div>
                  <div className="font-semibold text-sm text-gray-800">Keerthana's AI</div>
                </div>
                <button onClick={handleToggle} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="p-4 flex-1 overflow-y-auto bg-transparent flex flex-col gap-4 min-h-[450px] max-h-[600px] md:min-h-[300px] md:max-h-[400px]">
                <div className="flex gap-3">
                  <div className="bg-black text-white p-2 rounded-full h-fit flex-shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gray-100 text-gray-800 text-lg p-3 rounded-2xl rounded-tl-none cursor-text">
                    Hi! I am Keerthana's AI assistant. Ask me anything about her projects, stack, or experience.
                  </div>
                </div>

                {messages.map((msg, index) => (
                  <div key={index} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "assistant" && (
                       <div className="bg-black text-white p-2 rounded-full h-fit flex-shrink-0">
                        <Bot size={16} />
                      </div>
                    )}
                    <div className={`text-lg p-3 rounded-2xl cursor-text ${
                      msg.sender === "user" 
                        ? "bg-black text-white rounded-tr-none" 
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}>
                      {msg.text === "" && msg.sender === "assistant" && msg.isStreaming ? (
                        <span className="animate-pulse">Thinking...</span>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="flex flex-col gap-2 mt-4">
                    {SUGGESTIONS.map((chipText) => (
                      <button
                        key={chipText}
                        onClick={() => handleSend(chipText)}
                        className="text-left text-sm text-gray-600 bg-gray-50 border border-gray-100 hover:bg-gray-100 p-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        {chipText}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white/50 cursor-default">
                <div className="relative">
                  <input
                    type="text"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={exchangeCount >= 6 || isSending}
                    placeholder={exchangeCount >= 6 ? "Limit reached." : "Ask a question..."}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-full pl-4 pr-10 py-3 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-50 cursor-text"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || exchangeCount >= 6 || isSending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black text-white rounded-full disabled:opacity-50 transition-opacity"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={handleToggle}
          className="relative w-16 h-16 sm:w-20 sm:h-20 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform pointer-events-auto border-2 border-white/20 cursor-move"
        >
          {!isOpen && (
            <span className="absolute top-0 right-0 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500"></span>
            </span>
          )}
          {isOpen ? <X size={36} /> : <Bot size={44} />}
        </button>
      </motion.div>
    </>
  );
}
