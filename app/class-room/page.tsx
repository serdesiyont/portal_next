"use client";

import {
  Search,
  Github,
  Twitter,
  Youtube,
  Users,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatWidget, ChatContent } from "@/components/chat-widget";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ClassRoomSidebar } from "@/components/class-room-sidebar";
import { ClassRoomMainContent } from "@/components/class-room-main-content";

export default function ChromaDocsClone() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChatToggle = (isOpen: boolean) => {
    setIsChatOpen(isOpen);
  };

  return (
    <div
      className={`h-screen bg-background text-foreground flex flex-col${
        theme === "dark" ? " dark" : ""
      }`}
    >
      {/* Header - Fixed */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded"></div>
              <Link href="/">
                <span className="font-semibold text-lg">Home</span>
              </Link>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 pr-16 w-64 bg-muted/50 border-input"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded font-mono">
                  ⌘
                </kbd>
                <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded font-mono">
                  K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right side stats */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>795 online</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Github className="w-4 h-4" />
              <span>21k</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Twitter className="w-4 h-4" />
              <span>22.1k</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Youtube className="w-4 h-4" />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Secondary Navigation Bar */}
      <nav className="border-t border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center gap-6 px-4 py-2">
          <Link
            href="#"
            className="flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition-colors"
          >
            <span>📄</span> Lesson
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>💪</span> Exercises
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>📚</span> Reference
          </Link>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r bg-muted/30 flex-shrink-0 overflow-y-auto">
          <ClassRoomSidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <ClassRoomMainContent />
        </div>

        {/* Chat Panel */}
        {isChatOpen && (
          <aside className="w-[500px] flex-shrink-0 overflow-hidden border-l">
            <ChatContent
              onClose={() => handleChatToggle(false)}
              showHeader={true}
              className="h-full"
            />
          </aside>
        )}
      </div>

      {/* Chat Widget - Only show floating button when chat is closed */}
      {!isChatOpen && <ChatWidget onChatToggle={handleChatToggle} />}
    </div>
  );
}
