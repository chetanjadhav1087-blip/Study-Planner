"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X, Send, Bot, User, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "Add a task: Study Physics at 5pm tomorrow",
  "Show my tasks",
  "Mark my math task as done",
  "Give me a quick study tip",
];

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI Study Buddy. I can chat, answer questions, or manage your tasks. Try asking me to add, complete, update, or delete a task!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get chat response");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "Something went wrong. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.refreshRequired) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I ran into an error connecting to my server. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center transition-all duration-300 scale-100 hover:scale-105 active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <MessageSquare className="h-6 w-6 relative z-10 animate-pulse group-hover:rotate-6 transition-transform" />
        </Button>
      )}

      {/* Glassmorphic Chat Window */}
      {isOpen && (
        <Card className="w-[90vw] sm:w-[380px] h-[520px] flex flex-col border border-border/50 bg-card/85 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">AI Study Buddy</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] text-muted-foreground font-medium">Online & Ready</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
            {messages.map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 max-w-[85%] ${
                    isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold border ${
                      isAssistant
                        ? "bg-muted text-foreground border-border/40"
                        : "bg-primary text-primary-foreground border-primary/20"
                    }`}
                  >
                    {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      isAssistant
                        ? "bg-muted/50 border border-border/30 text-foreground rounded-tl-none"
                        : "bg-primary text-primary-foreground rounded-tr-none shadow-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5 max-w-[85%] mr-auto">
                <div className="h-7 w-7 rounded-full bg-muted border border-border/40 shrink-0 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-muted/50 border border-border/30 rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            {/* Suggestions Chips */}
            {messages.length === 1 && (
              <div className="pt-2 space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  Try saying
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="text-xs px-3 py-1.5 bg-muted/30 hover:bg-muted/70 border border-border/30 hover:border-border rounded-full text-muted-foreground hover:text-foreground transition-all duration-200 text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-4 border-t border-border/40 bg-muted/10 flex items-center gap-2">
            <Input
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
              className="flex-1 bg-background/50 border-border/50 h-10 pr-2"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage(input)}
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground shadow"
            >
              <Send className="h-4.5 w-4.5" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
