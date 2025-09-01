"use client";

import { useCodeEditorStore } from "@/lib/useCodeEditorStore";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Copy,
  Terminal,
} from "lucide-react";
import { useMemo, useState } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";

// Parse JSON or server-style map string into normalized test results
function parseTestResults(raw?: string | null): null | Array<{
  name: string;
  status: "PASSED" | "FAILED";
  code?: string;
  expected?: string;
}> {
  if (!raw) return null;

  // Try JSON first
  try {
    const json = JSON.parse(raw);
    if (json && typeof json === "object" && !Array.isArray(json)) {
      const out: Array<{
        name: string;
        status: "PASSED" | "FAILED";
        code?: string;
        expected?: string;
      }> = [];
      for (const [name, value] of Object.entries<any>(json)) {
        if (!value || typeof value !== "object") continue;
        const statusVal = String(value.status || "").toUpperCase();
        if (statusVal !== "PASSED" && statusVal !== "FAILED") continue;
        const toStr = (v: any) =>
          Array.isArray(v)
            ? `[${v.join(", ")}]`
            : typeof v === "string"
            ? v
            : v !== undefined
            ? JSON.stringify(v)
            : undefined;
        out.push({
          name,
          status: statusVal as any,
          code: toStr(value.code),
          expected: toStr(value.expected),
        });
      }
      if (out.length) return out;
    }
  } catch {}

  // Fallback: Parse map-like string: {test1={code=[...], expected=[...], status=FAILED}, ...}
  if (!raw.includes("status=") || raw.indexOf("{") === -1) return null;
  try {
    const results: Array<{
      name: string;
      status: "PASSED" | "FAILED";
      code?: string;
      expected?: string;
    }> = [];

    const entryRegex = /(\w+)\s*=\s*\{([\s\S]*?)\}/g; // top-level test entries
    let match: RegExpExecArray | null;

    while ((match = entryRegex.exec(raw)) !== null) {
      const name = match[1];
      const body = match[2];

      const statusMatch = /status\s*=\s*(PASSED|FAILED)/i.exec(body);
      const status = (statusMatch?.[1] || "").toUpperCase() as
        | "PASSED"
        | "FAILED";
      if (!status) continue;

      let code: string | undefined;
      let expected: string | undefined;
      if (status === "FAILED") {
        const codeMatch = /code\s*=\s*\[([\s\S]*?)\]/i.exec(body);
        const expectedMatch = /expected\s*=\s*\[([\s\S]*?)\]/i.exec(body);
        code = codeMatch ? `[${codeMatch[1].trim()}]` : undefined;
        expected = expectedMatch ? `[${expectedMatch[1].trim()}]` : undefined;
      }

      results.push({ name, status, code, expected });
    }

    return results.length ? results : null;
  } catch {
    return null;
  }
}

function OutputPanel() {
  const { output, error, isRunning, theme } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);

  const hasContent = error || output;

  const testResults = useMemo(() => parseTestResults(output), [output]);

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  const ui = useMemo(() => {
    const base = {
      panelBg: "#181825",
      cardBg: "#1e1e2e",
      border: "#313244",
      text: "#e5e7eb",
      muted: "#9ca3af",
      accent: "#60a5fa",
    };
    switch (theme) {
      case "vs-light":
        return {
          panelBg: "#ffffff",
          cardBg: "#f7f7f7",
          border: "#e5e7eb",
          text: "#111827",
          muted: "#6b7280",
          accent: "#2563eb",
        };
      case "github-dark":
        return {
          panelBg: "#0d1117",
          cardBg: "#161b22",
          border: "#30363d",
          text: "#c9d1d9",
          muted: "#8b949e",
          accent: "#58a6ff",
        };
      case "monokai":
        return {
          panelBg: "#272822",
          cardBg: "#3E3D32",
          border: "#49483E",
          text: "#F8F8F2",
          muted: "#c7c7c7",
          accent: "#a6e22e",
        };
      case "solarized-dark":
        return {
          panelBg: "#002b36",
          cardBg: "#073642",
          border: "#0a3940",
          text: "#93a1a1",
          muted: "#7c9191",
          accent: "#268bd2",
        };
      default:
        return base;
    }
  }, [theme]);

  return (
    <div className="relative p-4" style={{ backgroundColor: ui.panelBg, border: `1px solid ${ui.border}` }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-6 h-6 rounded-lg"
            style={{ backgroundColor: ui.cardBg, border: `1px solid ${ui.border}` }}
          >
            <Terminal className="w-4 h-4" style={{ color: ui.accent, opacity: 0.9 }} />
          </div>
          <span className="text-sm font-medium" style={{ color: ui.text }}>
            Output
          </span>
        </div>

        {hasContent && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-all"
            style={{ color: ui.muted, backgroundColor: ui.cardBg, border: `1px solid ${ui.border}` }}
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" style={{ color: ui.accent }} />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Output Area */}
      <div className="relative">
        <div
          className="relative rounded-xl p-4 h-full min-h-[600px] overflow-auto font-mono text-sm"
          style={{ backgroundColor: `${ui.cardBg}80`, border: `1px solid ${ui.border}`, color: ui.text }}
        >
          {isRunning ? (
            <RunningCodeSkeleton />
          ) : error ? (
            <div className="flex items-start gap-3" style={{ color: "#fca5a5" }}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <div className="font-medium">Execution Error</div>
                <pre className="whitespace-pre-wrap" style={{ color: "#fca5a5" }}>
                  {error}
                </pre>
              </div>
            </div>
          ) : output ? (
            <div className="space-y-3">
              {testResults ? (
                <div className="space-y-1">
                  {(() => {
                    const total = testResults.length;
                    const passed = testResults.filter(
                      (t) => t.status === "PASSED"
                    ).length;
                    const summaryColor = passed === total ? "#34d399" : "#f87171";
                    return (
                      <div className="text-sm" style={{ color: summaryColor }}>
                        {passed}/{total} passed
                      </div>
                    );
                  })()}

                  {testResults.map((t, i) => (
                    <div key={(t.name || "test") + i} className="rounded-md bg-transparent">
                      {t.status === "PASSED" ? (
                        <div style={{ color: "#34d399" }}>passed</div>
                      ) : (
                        <div style={{ color: "#f87171" }}>
                          failed - expected: {t.expected ?? ""} | output: {t.code ?? ""}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap" style={{ color: ui.text }}>
                  {output}
                </pre>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center" style={{ color: ui.muted }}>
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                style={{ backgroundColor: `${ui.cardBg}80`, border: `1px solid ${ui.border}` }}
              >
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-center">Run your code to see the output here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;
