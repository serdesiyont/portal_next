import { CodeEditorState } from "../types/index";
import { create } from "zustand";
import type * as monaco from "monaco-editor";
import axios from "./axios";

const getInitialState = () => {
  // if we're on the server, return default values
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
    };
  }

  // if we're on the client, return values from local storage bc localStorage is a browser API.
  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || 16;

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    output: "",
    isRunning: false,
    error: null,
    editor: null,
    executionResult: null,

    getCode: () => get().editor?.getValue() || "",

    setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) editor.setValue(savedCode);

      set({ editor });
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setLanguage: (language: string) => {
      // Save current language code before switching
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);

      set({
        language,
        output: "",
        error: null,
      });
    },

    runCode: async (exercise: {
      id: number;
      title: string;
      description: string;
      language: string;
    }) => {
      const { getCode } = get();
      const code = getCode();

      if (!code) {
        set({ error: "Please enter some code" });
        return;
      }

      set({ isRunning: true, output: "", error: null });

      try {
        // Build backend DTO (skip user)
        const exerciseDto = {
          id: exercise.id,
          title: exercise.title,
          description: exercise.description,
          language: exercise.language,
          boilerplate: {
            code,
          },
        };

        const resp = await axios.post("/submit", exerciseDto);
        const payload = resp?.data;

        // If backend indicates an error, surface it
        if (
          payload &&
          typeof payload === "object" &&
          (payload.error || payload.message)
        ) {
          const errMsg = (payload.error || payload.message) as string;
          set({
            error: errMsg,
            executionResult: { code, output: "", error: errMsg },
          });
          return;
        }

        // Normalize output to string
        const outputStr =
          typeof payload === "string"
            ? payload
            : payload?.output ??
              payload?.result ??
              JSON.stringify(payload, null, 2);

        set({
          output: String(outputStr ?? "").trim(),
          error: null,
          executionResult: {
            code,
            output: String(outputStr ?? "").trim(),
            error: null,
          },
        });
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Error running code";
        console.log("Error running code:", error);
        set({
          error: errMsg,
          executionResult: { code, output: "", error: errMsg },
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

export const getExecutionResult = () =>
  useCodeEditorStore.getState().executionResult;
