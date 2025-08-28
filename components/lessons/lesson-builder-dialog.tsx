"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Save, XIcon, Maximize2, Minimize2 } from "lucide-react";
import { slugify } from "@/lib/lesson-loader";

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

function RenderMarkdown({ markdown }: { markdown: string }) {
  if (!markdown)
    return (
      <p className="text-muted-foreground">
        Start typing markdown on the left…
      </p>
    );
  const blocks = markdown.split(
    /(\n```[a-zA-Z]*\n[\s\S]*?\n```|\n{% Video[\s\S]*?%})/g
  );
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      {blocks.map((block, index) => {
        if (!block) return null;
        const videoMatch = block.match(
          /{% Video link=\"([^\"]+)\" title=\"([^\"]+)\" \/ %}/
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

export default function LessonBuilderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [markdown, setMarkdown] = React.useState<string>(
    '# New Lesson\n\nStart writing your lesson here.\n\n## Code example\n\n```python\nprint(\'Hello, world!\')\n```\n\n{% Video link="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Sample Video" / %}\n'
  );
  const [fileName, setFileName] = React.useState<string>("lesson.md");
  const [fullscreen, setFullscreen] = React.useState(false);

  React.useEffect(() => {
    // derive filename from first heading if available
    const m = markdown.match(/^#\s+(.+)/m);
    if (m && m[1]) {
      const base = slugify(m[1]).replace(/\.+$/, "");
      if (base) setFileName(`${base}.md`);
    }
  }, [markdown]);

  const handleSave = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "lesson.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/40 backdrop-blur-sm sm:backdrop-blur-md" />
        <Dialog.Content
          className={`data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed z-50 bg-background shadow-lg focus:outline-hidden overflow-hidden ${
            fullscreen
              ? "inset-0 w-screen h-screen rounded-none border-0"
              : "left-1/2 top-1/2 w-[96vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-xl border max-h-[92vh]"
          }`}
        >
          <Dialog.Title className="sr-only">Build lesson</Dialog.Title>
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Filename:</span>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="h-8 w-56 rounded-md border bg-background px-2 text-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setFullscreen((f) => !f)}
              >
                {fullscreen ? (
                  <Minimize2 className="mr-2 h-4 w-4" />
                ) : (
                  <Maximize2 className="mr-2 h-4 w-4" />
                )}
                {fullscreen ? "Exit full" : "Full screen"}
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <XIcon className="mr-2 h-4 w-4" /> Quit
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleSave}
              >
                <Save className="mr-2 h-4 w-4" /> Save .md
              </Button>
            </div>
          </div>
          <div
            className={`flex flex-col md:flex-row gap-4 p-4 ${
              fullscreen ? "h-[calc(100vh-56px)]" : "h-[80vh]"
            }`}
          >
            <div className="md:w-1/2 w-full h-full flex flex-col">
              <label className="text-sm font-medium mb-2">Markdown</label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-full min-h-[50vh] resize-none rounded-md border bg-background p-3 font-mono text-sm"
                placeholder="# Title\n\nWrite your markdown here..."
              />
            </div>
            <div className="md:w-1/2 w-full h-full overflow-auto">
              <label className="text-sm font-medium mb-2 block">Preview</label>
              <div className="p-2">
                <RenderMarkdown markdown={markdown} />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
