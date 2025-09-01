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
  const { output, error, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);

  const hasContent = error || output;

  const testResults = useMemo(() => parseTestResults(output), [output]);

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#181825]  p-4 ring-1 ring-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-300">Output</span>
        </div>

        {hasContent && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
            rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
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
          className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
        rounded-xl p-4 h-full min-h-[600px] overflow-auto font-mono text-sm"
        >
          {isRunning ? (
            <RunningCodeSkeleton />
          ) : error ? (
            <div className="flex items-start gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <div className="font-medium">Execution Error</div>
                <pre className="whitespace-pre-wrap text-red-400/80">
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
                    const summaryColor =
                      passed === total ? "text-emerald-400" : "text-red-400";
                    return (
                      <div className={`text-sm ${summaryColor}`}>
                        {passed}/{total} passed
                      </div>
                    );
                  })()}

                  {testResults.map((t, i) => (
                    <div
                      key={(t.name || "test") + i}
                      className="rounded-md bg-transparent"
                    >
                      {t.status === "PASSED" ? (
                        <div className="text-emerald-400">passed</div>
                      ) : (
                        <div className="text-red-400">
                          failed - expected: {t.expected ?? ""} | output:{" "}
                          {t.code ?? ""}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-gray-300">
                  {output}
                </pre>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-center">
                Run your code to see the output here...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;
