"use client";

import { useCodeEditorStore } from "@/lib/useCodeEditorStore";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import { useMemo } from "react";

function RunButton({
  exercise,
}: {
  exercise: {
    id: number;
    title: string;
    description: string;
    language: string;
  };
}) {
  const { runCode, isRunning, getCode, theme } = useCodeEditorStore();

  const ui = useMemo(() => {
    const base = {
      accent: "#3b82f6", // blue-500
      accentTo: "#2563eb",
      textOnAccent: "#ffffff",
      ring: "rgba(255,255,255,0.08)",
    };
    switch (theme) {
      case "vs-light":
        return {
          accent: "#2563eb",
          accentTo: "#1d4ed8",
          textOnAccent: "#ffffff",
          ring: "rgba(0,0,0,0.08)",
        };
      case "github-dark":
        return {
          accent: "#58a6ff",
          accentTo: "#1f6feb",
          textOnAccent: "#0d1117",
          ring: "rgba(255,255,255,0.08)",
        };
      case "monokai":
        return {
          accent: "#a6e22e",
          accentTo: "#7ec10a",
          textOnAccent: "#272822",
          ring: "rgba(255,255,255,0.08)",
        };
      case "solarized-dark":
        return {
          accent: "#268bd2",
          accentTo: "#0f6aa6",
          textOnAccent: "#002b36",
          ring: "rgba(255,255,255,0.08)",
        };
      default:
        return base;
    }
  }, [theme]);

  const handleRun = async () => {
    const code = getCode();
    await runCode(exercise);
  };

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl
        disabled:cursor-not-allowed focus:outline-none
      `}
      style={{
        backgroundImage: `linear-gradient(90deg, ${ui.accent}, ${ui.accentTo})`,
        color: ui.textOnAccent,
        boxShadow: `0 0 0 1px ${ui.ring} inset`,
      }}
    >
      {/* inner content */}
      <div className="relative flex items-center gap-2.5">
        {isRunning ? (
          <>
            <div className="relative">
              <Loader2 className="w-4 h-4 animate-spin" />
              <div className="absolute inset-0 blur animate-pulse" />
            </div>
            <span className="text-sm font-medium">Executing...</span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center w-4 h-4">
              <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-sm font-medium">Run Code</span>
          </>
        )}
      </div>
    </motion.button>
  );
}

export default RunButton;
