"use client";
import { useCodeEditorStore } from "@/lib/useCodeEditorStore";
import { useEffect, useMemo } from "react";
import { defineMonacoThemes } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { RotateCcwIcon, TypeIcon } from "lucide-react";
import useMounted from "@/hooks/useMounted";
import RunButton from "./RunButton";
import ThemeSelector from "./ThemeSelector";

interface EditorPanelProps {
  code: string;
  language: string;
  exerciseId: string;
  exercise?: {
    id: number;
    title: string;
    description: string;
    language: string;
  };
}

function EditorPanel({
  code,
  language,
  exerciseId,
  exercise,
}: EditorPanelProps) {
  const { theme, fontSize, editor, setFontSize, setEditor } =
    useCodeEditorStore();
  const mounted = useMounted();

  // Map editor theme to UI colors for surrounding chrome
  const ui = useMemo(() => {
    // defaults (vs-dark like)
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
      // vs-dark and others
      default:
        return base;
    }
  }, [theme]);

  // Use a unique key for each exercise to keep state per exercise
  const codeKey = `editor-code-${exerciseId}`;

  useEffect(() => {
    if (!editor) return;
    let newCode = code;
    const savedCode = localStorage.getItem(codeKey);
    if (typeof savedCode === "string") newCode = savedCode;
    if (typeof newCode === "string") editor.setValue(newCode);
  }, [exerciseId, code, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    if (editor && typeof code === "string") editor.setValue(code);
    localStorage.removeItem(codeKey);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(codeKey, value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  if (!mounted) return null;

  return (
    <div className="relative" style={{ backgroundColor: ui.panelBg }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-2 pt-2">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-6 h-6 rounded-lg"
            style={{
              backgroundColor: ui.cardBg,
              border: `1px solid ${ui.border}`,
            }}
          >
            {/* <Image src={"/" + language + ".png"} alt="Logo" width={24} height={24} /> */}
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: ui.text }}
          >
            Code Editor
          </span>
        </div>
        <div className="flex items-center gap-3 pr-6 pt-3">
          {/* Run Button and Theme Selector to the left of Font Size Slider */}
          {/* Font Size Slider */}
          {exercise ? (
            <RunButton exercise={exercise} />
          ) : (
            <RunButton
              exercise={{
                id: Number(exerciseId),
                title: "",
                description: "",
                language,
              }}
            />
          )}
          <ThemeSelector />
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
            style={{
              backgroundColor: ui.cardBg,
              border: `1px solid ${ui.border}`,
            }}
          >
            <TypeIcon className="size-4" style={{ color: ui.muted }} />
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                className="w-20 h-1 rounded-lg cursor-pointer"
                style={{ backgroundColor: ui.border }}
              />
              <span
                className="text-sm font-medium min-w-[2rem] text-center"
                style={{ color: ui.muted }}
              >
                {fontSize}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: ui.cardBg,
              border: `1px solid ${ui.border}`,
            }}
            aria-label="Reset to default code"
          >
            <RotateCcwIcon className="size-4" style={{ color: ui.muted }} />
          </motion.button>
        </div>
      </div>

      {/* Editor  */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          backgroundColor: ui.cardBg,
          border: `1px solid ${ui.border}`,
        }}
      >
        <Editor
          height="800px"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme={theme}
          beforeMount={defineMonacoThemes}
          onMount={(editor) => setEditor(editor)}
          options={{
            minimap: { enabled: false },
            fontSize,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            renderWhitespace: "selection",
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontLigatures: true,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            contextmenu: true,
            renderLineHighlight: "all",
            lineHeight: 1.6,
            letterSpacing: 0.5,
            roundedSelection: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
}
export default EditorPanel;
