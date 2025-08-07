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
import Link from "next/link";
import { useEffect, useState } from "react";
import ClassRoomLesson from "@/components/class-room/class-room-lesson";
import ClassRoomExercise from "@/components/class-room/class-room-exercise";
import Reference from "@/components/class-room/class-room-refernce";

export default function ChromaDocsClone() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [sidebarSection, setSidebarSection] = useState<
    "lesson" | "exercise" | "reference"
  >("lesson");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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
          <button
            type="button"
            className={`flex items-center gap-2 font-medium transition-colors ${
              sidebarSection === "lesson"
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setSidebarSection("lesson")}
          >
            <span>📄</span> Lesson
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 font-medium transition-colors ${
              sidebarSection === "exercise"
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setSidebarSection("exercise")}
          >
            <span>💪</span> Exercises
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 font-medium transition-colors ${
              sidebarSection === "reference"
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setSidebarSection("reference")}
          >
            <span>📚</span> Reference
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        {sidebarSection === "lesson" && <ClassRoomLesson />}
        {sidebarSection === "exercise" && <ClassRoomExercise />}
        {sidebarSection === "reference" && <Reference />}
      </div>
    </div>
  );
}
