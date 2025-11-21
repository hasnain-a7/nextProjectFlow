"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

import ReactMarkdown from "react-markdown";
interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
  timestamp?: Date;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full py-2 px-4 transition-colors",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex items-start gap-3 max-w-[80%]  p-3 ",
          isUser
            ? "bg-accent text-accent-foreground rounded-tl-2xl rounded-br-2xl rounded-bl-2xl transition-all duration-300 shadow-md hover:shadow-lg"
            : " bg-transparent"
        )}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm",
            isUser
              ? "bg-accent text-accent-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {isUser ? "You" : "AI Assistant"}
            </span>
          </div>

          <div className="mt-1 text-sm leading-relaxed whitespace-pre-wrap ">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
