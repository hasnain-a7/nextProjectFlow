import { Send, Paperclip, Mic, ImageIcon } from "lucide-react";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <div className="mx-auto bg-background">
      <div className="mx-auto max-w-3xl  ">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end rounded-2xl border  ">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Gemini Anything..."
              className="max-h-40 min-h-14 resize-none border-0 bg-card px-4 py-4 pr-32 text-[15px] leading-6 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add image</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Voice input</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="h-9 w-9 rounded-lg  disabled:bg-gray-200 disabled:text-gray-400"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
        <p className="mt-2 text-center text-xs text-gray-500">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
