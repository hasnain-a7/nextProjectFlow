"use client";

import CopyButton from "@/components/CopyText";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string;
  timestamp?: Date;
}

// --- Main Component ---
export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full py-4 px-4 transition-colors group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex items-start gap-4 w-full",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm mt-1",
            isUser ? "bg-accent " : "bg-white text-gray-600 border-gray-200"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-5 w-5" />}
        </div> */}

        {/* Message Content Bubble */}
        <div className="flex flex-col min-w-0">
          <div
            className={cn(
              "text-lg font-semibold mb-1",
              isUser ? "text-right mr-1" : "ml-1"
            )}
          >
            {isUser ? "" : "Gemini AI"}
          </div>

          <div
            // CHANGED: moved prose classes here because ReactMarkdown v9+ doesn't accept className
            className={cn(
              "text-sm leading-relaxed shadow-sm relative overflow-hidden prose prose-sm max-w-none wrap-break-word",
              isUser
                ? "bg-accent text-white rounded-tl-2xl rounded-br-2xl rounded-bl-2xl px-4 py-3 prose-invert prose-p:text-white prose-headings:text-white prose-li:text-white"
                : " text-primary rounded-2xl rounded-tl-sm px-3 py-4 prose-p:text-gray-700 prose-headings:text-gray-900 prose-li:text-gray-700 prose-strong:text-gray-900"
            )}
          >
            {/* Markdown Renderer */}
            <ReactMarkdown
              components={{
                // Override standard elements for custom styling
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline underline-offset-4 font-medium"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2 text-gray-500">
                    {children}
                  </blockquote>
                ),
                // Code Block Handling
                code({ inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeText = String(children).replace(/\n$/, "");

                  if (!inline) {
                    // Block Code (Multi-line)
                    return (
                      <div className="relative group my-4 rounded-lg  border  bg-gray-900 shadow-md">
                        <div className="flex items-center justify-between px-4  py-2 bg-gray-800 text-gray-300 text-xs border-b border-gray-700">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-3 h-3" />
                            <span className="font-mono">
                              {match?.[1] || "code"}
                            </span>
                          </div>
                          <CopyButton text={codeText} />
                        </div>
                        <div className="p-4 bg-accent overflow-x-auto">
                          <code
                            className="font-mono text-sm text-gray-100"
                            {...props}
                          >
                            {children}
                          </code>
                        </div>
                      </div>
                    );
                  }

                  // Inline Code (Single words like `const`)
                  return (
                    <code
                      className={cn(
                        "px-1.5 py-0.5 rounded font-mono text-xs font-medium",
                        isUser
                          ? "bg-blue-700 text-blue-100 border border-blue-600"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
