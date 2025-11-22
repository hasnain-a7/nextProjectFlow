"use client";

import { useState, useEffect, useRef } from "react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { Lightbulb } from "lucide-react";

type Role = "assistant" | "user";

interface Message {
  role: Role;
  content: string;
}

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // CHANGED: Updated endpoint to match 'pages/api/chat.ts'
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      setMessages((prev: Message[]) => [
        ...prev,
        {
          role: "assistant",
          content: data.generated_text || "Failed to get response.",
        },
      ]);
      console.log("Response data:", data);
    } catch (err) {
      console.error(err);
      setMessages((prev: Message[]) => [
        ...prev,
        { role: "assistant", content: "Failed to get response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Explain quantum computing in simple terms",
    "Give me a recipe for chocolate cake",
    "Write a short poem about AI",
  ];

  return (
    <div className="flex flex-col  flex-1 relative">
      <div className="flex-1  px-5 pt-12 pb-24">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center mt-24 text-center">
            <Lightbulb className="w-12 h-12 mb-4 text-bacground" />
            <p className="text-lg font-semibold text-foreground">
              Try one of these prompts:
            </p>
            <div className="mt-6 flex flex-col gap-3 w-full max-w-md">
              {suggestions.map((sugg, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(sugg)}
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 bg-muted hover:bg-accent/10 text-foreground transition"
                >
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">{sugg}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full md:max-w-3xl mx-auto">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              role={msg.role}
              content={msg.content}
              // Note: This sets time to 'now' on every render.
              // Ideally, you'd store a timestamp in your Message interface.
              timestamp={new Date()}
            />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <span className="ml-2 text-sm">Assistant is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed py-1 bg-background bottom-0 left-0 w-full px-6">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
