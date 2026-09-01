import React, { useState, useRef, useEffect } from "react";
import { MessageSquareText, X, Send, Sparkles, Bot, User, BookmarkPlus, Check, ExternalLink } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatWidgetProps {
  onNavigateToRecords?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onNavigateToRecords }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Namaste! 🙏 I am your AgroSense smart farming assistant. Ask me anything about crop recommendations, fertilizer schedules (NPK), leaf disease treatments, or irrigation planning!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedMessageIds, setSavedMessageIds] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "🌾 Which crop fits black soil?",
    "🍂 How to cure leaf rust?",
    "🌱 Best NPK ratio for wheat?",
    "💧 When to irrigate before rain?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.slice(-4),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "For optimal results, please check your local soil pH and humidity conditions.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "I am ready to help! You can use our Crop AI tool for soil recommendations or Disease Detection to inspect leaf photos.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecommendation = async (botMsgId: string, botText: string) => {
    // Find preceding user question if available
    const msgIndex = messages.findIndex((m) => m.id === botMsgId);
    let questionText = "Farmer AI Advisory";
    if (msgIndex > 0 && messages[msgIndex - 1].sender === "user") {
      questionText = messages[msgIndex - 1].text;
    }

    // Determine crop or title
    let detectedCrop = "General Advisory";
    const lower = (questionText + " " + botText).toLowerCase();
    if (lower.includes("rice") || lower.includes("paddy")) detectedCrop = "Rice";
    else if (lower.includes("wheat")) detectedCrop = "Wheat";
    else if (lower.includes("cotton")) detectedCrop = "Cotton";
    else if (lower.includes("sugarcane")) detectedCrop = "Sugarcane";
    else if (lower.includes("maize") || lower.includes("corn")) detectedCrop = "Maize";
    else if (lower.includes("ragi")) detectedCrop = "Ragi";
    else if (lower.includes("tomato")) detectedCrop = "Tomato";
    else if (lower.includes("leaf rust") || lower.includes("disease") || lower.includes("blight")) detectedCrop = "Disease Treatment";
    else if (lower.includes("fertilizer") || lower.includes("npk") || lower.includes("urea")) detectedCrop = "Fertilizer Schedule";

    try {
      const res = await fetch("/api/records/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "Farmer AI Chat Log",
          crop: detectedCrop,
          details: {
            source: "Farmer Chat",
            question: questionText,
            advice: botText,
            notes: `Question: "${questionText}"\nAdvice: ${botText.slice(0, 180)}...`,
          },
        }),
      });

      if (res.ok) {
        setSavedMessageIds((prev) => ({ ...prev, [botMsgId]: true }));
        setSaveStatus("Saved to Field Records! View in Records tab.");
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (err) {
      console.error("Failed to save chat recommendation:", err);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          id="open-chat-btn"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xl hover:shadow-emerald-900/30 transition-all hover:scale-105 border border-emerald-500/50"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-800 flex items-center justify-center text-xs">
            💬
          </div>
          <span>Farmer Help Chat</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-emerald-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Top Bar */}
          <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-base">
                🌿
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">AgroSense Assistant</h4>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  AI Farming Support
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Save Status Notification Banner */}
          {saveStatus && (
            <div className="bg-emerald-100/90 text-emerald-900 text-[11px] px-3.5 py-1.5 flex items-center justify-between border-b border-emerald-200 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>{saveStatus}</span>
              </div>
              {onNavigateToRecords && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToRecords();
                  }}
                  className="text-emerald-800 underline font-bold hover:text-emerald-950 text-[10px]"
                >
                  View
                </button>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-gray-50/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 items-start ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 ${
                    msg.sender === "user" ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-900 font-bold"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-3 h-3" /> : "🌿"}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-700 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-emerald-100 rounded-tl-none space-y-2"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {/* Action row for bot messages: Save to Past Records */}
                  {msg.sender === "bot" && msg.id !== "welcome" && (
                    <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <button
                        onClick={() => handleSaveRecommendation(msg.id, msg.text)}
                        disabled={savedMessageIds[msg.id]}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold transition-all ${
                          savedMessageIds[msg.id]
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 shadow-2xs"
                        }`}
                      >
                        {savedMessageIds[msg.id] ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Saved to Records</span>
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3 h-3 text-emerald-700" />
                            <span>Save Advice</span>
                          </>
                        )}
                      </button>
                      <span className="text-gray-400 text-[9px]">{msg.timestamp}</span>
                    </div>
                  )}

                  {msg.sender === "user" && (
                    <span className="text-[9px] block text-right mt-1 text-emerald-200">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-gray-500 bg-white p-2.5 rounded-2xl border border-gray-100 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-gray-500 pl-1">Consulting agricultural data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60 rounded-lg text-[10px] whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crops, disease, soil..."
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
