"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { fetchLesson, LessonContent, slugify } from "@/lib/lesson-loader";

const languageMap: { [key: string]: string | undefined } = {
  terminal: "bash",
  python: "python",
  typescript: "typescript",
  javascript: "javascript",
  html: "html",
  css: "css",
  json: "json",
  yaml: "yaml",
  markdown: "markdown",
};

function CodeBlock({ title, code }: { title: string; code: string }) {
  const [isCopied, setIsCopied] = React.useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch {}
  };
  const language = languageMap[title.toLowerCase()] || "bash";
  return (
    <div className="bg-slate-950 dark:bg-slate-900 rounded-lg border my-4 relative group">
      <div className="flex items-center justify-between mb-2 bg-slate-800 rounded-t-lg p-2">
        <span className="text-slate-400 text-sm font-medium capitalize">
          {title}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-slate-400 hover:text-white h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copy code"
        >
          <Copy className="w-3 h-3" />
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          borderRadius: "0 0 0.5rem 0.5rem",
        }}
        codeTagProps={{ className: "text-sm font-mono" }}
      >
        {code}
      </SyntaxHighlighter>
      {isCopied && (
        <span className="text-xs text-green-500 absolute right-12 top-2.5">
          Copied!
        </span>
      )}
    </div>
  );
}

function LessonPreview({ content }: { content: LessonContent }) {
  if (!content?.raw) return null;
  const blocks = content.raw.split(
    /(\n```[a-zA-Z]*\n[\s\S]*?\n```|\n{% Video[\s\S]*?%})/g
  );
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none border-b pb-8 mb-8">
      {blocks.map((block, index) => {
        if (!block) return null;
        const videoMatch = block.match(
          /{% Video link="([^"]+)" title="([^"]+)" \/ %}/
        );
        if (videoMatch) {
          const [_, link, title] = videoMatch;
          return (
            <div key={index} className="mb-8">
              <div
                className="relative bg-black rounded-lg overflow-hidden shadow-lg"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={link}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {title}
              </p>
            </div>
          );
        }
        const codeMatch = block.match(/```([a-zA-Z]*)\n([\s\S]*?)\n```/);
        if (codeMatch) {
          const title = codeMatch[1] || "code";
          const code = codeMatch[2].trim();
          return <CodeBlock key={index} title={title} code={code} />;
        }
        return block.split("\n").map((line, lineIndex) => {
          if (line.startsWith("## ")) {
            const text = line.substring(3);
            return (
              <h2
                key={`${index}-${lineIndex}`}
                id={slugify(text)}
                className="text-2xl font-bold mt-8 mb-4"
              >
                {text}
              </h2>
            );
          }
          if (line.startsWith("# ")) {
            const text = line.substring(2);
            return (
              <h1
                key={`${index}-${lineIndex}`}
                id={slugify(text)}
                className="text-3xl font-bold mb-8"
              >
                {text}
              </h1>
            );
          }
          if (line.trim()) {
            return (
              <p
                key={`${index}-${lineIndex}`}
                className="text-lg text-muted-foreground mb-6"
              >
                {line}
              </p>
            );
          }
          return null;
        });
      })}
    </div>
  );
}

export default function LessonPreviewSheet({
  open,
  onOpenChange,
  title,
  address,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  address?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [content, setContent] = React.useState<LessonContent | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!open || !address) return;
      try {
        setLoading(true);
        setError(null);
        const c = await fetchLesson(address);
        if (!cancelled) setContent(c);
      } catch (e) {
        if (!cancelled) setError("Failed to load preview");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [open, address]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[92vw] sm:w-[80vw] max-w-none sm:max-w-none"
      >
        <SheetHeader>
          <SheetTitle>{title || "Preview"}</SheetTitle>
        </SheetHeader>
        <div className="p-8 w-full max-w-4xl mx-auto overflow-auto">
          {loading && (
            <div className="text-sm text-muted-foreground">
              Loading preview…
            </div>
          )}
          {error && <div className="text-sm text-destructive">{error}</div>}
          {!loading && !error && content && <LessonPreview content={content} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
