"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getChatResponse, getChatHistory } from "@/lib/chat";
import type { ChatHistoryItem } from "@/lib/chat";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useResizable } from "@/hooks/use-resizable";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AiMessageContent = ({ content }: { content: string }) => {
  // Custom renderer for code blocks to apply syntax highlighting
  const CodeBlock = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  // 1. Replace custom newline {.} with markdown newline `  \n`
  // 2. Replace custom italic {..word..} with markdown italic *word*
  const formattedContent = content
    .replace(/\{\*\}/g, "  \n")
    .replace(/\{\*\*(.*?)\*\*\}/g, "*$1*");

  return (
    <ReactMarkdown components={CodeBlock}>{formattedContent}</ReactMarkdown>
  );
};

interface ChatContentProps {
  onClose?: () => void;
  showHeader?: boolean;
  className?: string;
}

export function ChatContent({
  onClose,
  showHeader = true,
  className = "",
}: ChatContentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      setLoadingHistory(true);
      const history = await getChatHistory(0, 20); // Fetch more items
      if (history && history.content && history.content.length > 0) {
        const chatMessages = history.content
          .reverse()
          .flatMap((item: ChatHistoryItem) => [
            {
              id: `user-${item.id}`,
              content: item.userMessage,
              sender: "user" as const,
              timestamp: new Date(item.createdAt),
            },
            {
              id: `ai-${item.id}`,
              content: item.aiResponse,
              sender: "ai" as const,
              timestamp: new Date(item.createdAt),
            },
          ]);
        setMessages(chatMessages);
      } else {
        setMessages([
          {
            id: "1",
            content:
              "Hello! I'm your AI assistant. How can I help you with your questions today?",
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
      }
      setLoadingHistory(false);
    };

    loadHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsTyping(true);

    const aiMessageId = `ai-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        content: "",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);

    const fullResponse = await getChatResponse({ message: messageToSend });

    if (typeof fullResponse !== "string") {
      console.error("Invalid response from getChatResponse:", fullResponse);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content:
                  "Sorry, I received an invalid response from the server.",
              }
            : msg
        )
      );
      setIsTyping(false);
      return;
    }

    const words = fullResponse.split(" ");
    let wordIndex = 0;

    const typeWord = () => {
      if (wordIndex < words.length) {
        const nextWord = words[wordIndex];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: msg.content + (wordIndex > 0 ? " " : "") + nextWord,
                }
              : msg
          )
        );
        wordIndex++;
        setTimeout(typeWord, 50); // Faster typing speed
      } else {
        setIsTyping(false);
      }
    };

    typeWord();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-background border-l ${className}`}>
      {/* Chat Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Chat</h3>
          </div>
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`prose dark:prose-invert max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                }`}
              >
                {message.sender === "ai" ? (
                  <AiMessageContent content={message.content} />
                ) : (
                  <p>{message.content}</p>
                )}
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.sender === "user" && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ChatWidgetProps {
  onChatToggle: (isOpen: boolean) => void;
  canOpen?: boolean;
}

export function ChatWidget({ onChatToggle, canOpen = true }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { width, handleMouseDown } = useResizable({
    initialWidth: 384, // w-96 is 384px
    minWidth: 320,
    maxWidth: 800,
  });

  const toggleChat = () => {
    // If trying to open and not allowed, ensure it stays closed and notify parent
    if (!isOpen && !canOpen) {
      setIsOpen(false);
      onChatToggle(false);
      return;
    }
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onChatToggle(newIsOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open AI Chat</span>
        </Button>
      )}

      {/* Floating Chat Panel - Only show when not integrated */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 h-[80vh] bg-background border rounded-lg shadow-2xl z-50 flex"
          style={{ width }}
        >
          <div
            onMouseDown={handleMouseDown}
            className="flex items-center justify-center w-2 cursor-col-resize"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <ChatContent onClose={toggleChat} className="flex-1" />
        </div>
      )}
    </>
  );
}
