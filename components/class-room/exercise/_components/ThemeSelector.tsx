"use client";

import { useCodeEditorStore } from "@/lib/useCodeEditorStore";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { THEMES } from "../_constants";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleOff,
  Cloud,
  Github,
  Laptop,
  Moon,
  Palette,
  Sun,
} from "lucide-react";
import useMounted from "@/hooks/useMounted";

const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon className="size-4" />,
  "vs-light": <Sun className="size-4" />,
  "github-dark": <Github className="size-4" />,
  monokai: <Laptop className="size-4" />,
  "solarized-dark": <Cloud className="size-4" />,
};

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useMounted();
  const { theme, setTheme } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES.find((t) => t.id === theme);

  const ui = useMemo(() => {
    const base = {
      panelBg: "#181825",
      cardBg: "#1e1e2e",
      border: "#313244",
      text: "#e5e7eb",
      muted: "#9ca3af",
    };
    switch (theme) {
      case "vs-light":
        return {
          panelBg: "#ffffff",
          cardBg: "#f7f7f7",
          border: "#e5e7eb",
          text: "#111827",
          muted: "#6b7280",
        };
      case "github-dark":
        return {
          panelBg: "#0d1117",
          cardBg: "#161b22",
          border: "#30363d",
          text: "#c9d1d9",
          muted: "#8b949e",
        };
      case "monokai":
        return {
          panelBg: "#272822",
          cardBg: "#3E3D32",
          border: "#49483E",
          text: "#F8F8F2",
          muted: "#c7c7c7",
        };
      case "solarized-dark":
        return {
          panelBg: "#002b36",
          cardBg: "#073642",
          border: "#0a3940",
          text: "#93a1a1",
          muted: "#7c9191",
        };
      default:
        return base;
    }
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-48 group relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200"
        style={{ backgroundColor: ui.cardBg, border: `1px solid ${ui.border}` }}
      >
        {/* hover state bg decorator */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />

        <Palette className="w-4 h-4 transition-colors" style={{ color: ui.muted }} />

        <span className="min-w-[80px] text-left transition-colors" style={{ color: ui.text }}>
          {currentTheme?.label}
        </span>

        {/* color indicator */}

        <div
          className="relative w-4 h-4 rounded-full transition-colors"
          style={{ background: currentTheme?.color, border: `1px solid ${ui.border}` }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-full min-w-[240px] backdrop-blur-xl rounded-xl shadow-2xl py-2 z-50"
            style={{ backgroundColor: ui.cardBg, border: `1px solid ${ui.border}` }}
          >
            <div className="px-2 pb-2 mb-2" style={{ borderBottom: `1px solid ${ui.border}` }}>
              <p className="text-xs font-medium px-2" style={{ color: ui.muted }}>
                Select Theme
              </p>
            </div>

            {THEMES.map((t, index) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                relative group w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-200
                ${
                  theme === t.id
                    ? "bg-blue-500/10 text-blue-400"
                    : ""
                }
              `}
                style={{ color: ui.text }}
                onClick={() => setTheme(t.id)}
              >
                {/* bg gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 
              group-hover:opacity-100 transition-opacity"
                />

                {/* icon */}
                <div
                  className={`
                flex items-center justify-center size-8 rounded-lg
                ${
                  theme === t.id
                    ? "bg-blue-500/10 text-blue-400"
                    : ""
                }
                group-hover:scale-110 transition-all duration-200
              `}
                  style={{ backgroundColor: theme === t.id ? undefined : ui.panelBg, color: ui.muted }}
                >
                  {THEME_ICONS[t.id] || <CircleOff className="w-4 h-4" />}
                </div>
                {/* label */}
                <span className="flex-1 text-left transition-colors" style={{ color: ui.text }}>
                  {t.label}
                </span>

                {/* color indicator */}
                <div
                  className="relative size-4 rounded-full transition-colors"
                  style={{ background: t.color, border: `1px solid ${ui.border}` }}
                />

                {/* active theme border */}
                {theme === t.id && (
                  <motion.div
                    className="absolute inset-0 border-2 border-blue-500/30 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ThemeSelector;
