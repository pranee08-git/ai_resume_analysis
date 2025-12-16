import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const OPENROUTER_API_KEY =
  "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";
const OPENROUTER_API_URL =
  "https://openrouter.ai/api/v1/chat/completions";

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text:
        "Hi! I'm your AI Resume Assistant powered by advanced AI. I can help you understand how to improve your resume, answer questions about the ATS scoring, or guide you through uploading your resume. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (
    userMessage: string
  ): Promise<string> => {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Resume Analyzer Chatbot",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful AI assistant for a Resume Analyzer application.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      return (
        data.choices?.[0]?.message?.content ||
        "Unable to generate response."
      );
    } catch {
      return "Connection error. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const botResponseText =
      await generateBotResponse(inputValue);

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setIsLoading(false);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    /* 🔼 MOVED UP HERE */
    <div className="fixed bottom-20 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-96 flex flex-col mb-4 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">
                Resume Assistant
              </h3>
              <p className="text-xs text-blue-100">
                Always here to help
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 rounded-full p-1 transition"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={clsx("flex", {
                  "justify-end":
                    message.sender === "user",
                  "justify-start":
                    message.sender === "bot",
                })}
              >
                <div
                  className={clsx(
                    "max-w-xs px-4 py-2 rounded-lg",
                    {
                      "bg-blue-500 text-white rounded-br-none":
                        message.sender ===
                        "user",
                      "bg-gray-200 text-gray-800 rounded-bl-none":
                        message.sender ===
                        "bot",
                    }
                  )}
                >
                  <p className="text-sm">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) =>
                  setInputValue(e.target.value)
                }
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={
                  isLoading ||
                  !inputValue.trim()
                }
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg px-4 py-2 text-sm font-medium transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition transform hover:scale-110"
        title="Open Resume Assistant"
      >
        <span className="text-2xl">💬</span>
      </button>
    </div>
  );
}
