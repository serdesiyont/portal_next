"use client";
import { useCodeEditorStore } from "@/lib/useCodeEditorStore";
import { useEffect } from "react";
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
    <div className="relative bg-[#181825]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e]">
            {/* <Image src={"/" + language + ".png"} alt="Logo" width={24} height={24} /> */}
          </div>
          <span className="text-sm font-medium text-gray-300">Code Editor</span>
        </div>
        <div className="flex  items-center gap-3 pr-6 pt-3">
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
          <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ">
            <TypeIcon className="size-4 text-gray-400" />
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                {fontSize}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg transition-colors"
            aria-label="Reset to default code"
          >
            <RotateCcwIcon className="size-4 text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Editor  */}
      <div className="relative bg-[#1e1e2e]/50 backdrop-blur-sm rounded-xl overflow-hidden">
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
