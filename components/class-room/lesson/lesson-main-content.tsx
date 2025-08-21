"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { slugify, LessonContent } from "@/lib/lesson-loader";
import { useLessonContext } from "./LessonProvider";

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

const CodeBlock = ({ title, code }: { title: string; code: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
        codeTagProps={{
          className: "text-sm font-mono",
        }}
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
};

const VideoPlayer = ({ link, title }: { link: string; title: string }) => (
  <div className="mb-8">
    <div
      className="relative bg-black rounded-lg overflow-hidden shadow-lg"
      style={{ paddingBottom: "56.25%" }}
    >
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={link}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
    <p className="text-sm text-muted-foreground mt-2 text-center">{title}</p>
  </div>
);

const LessonBlock = ({ lesson }: { lesson: LessonContent }) => {
  const renderContent = () => {
    if (!lesson.raw) {
      return null;
    }

    const blocks = lesson.raw.split(
      /(\n```[a-zA-Z]*\n[\s\S]*?\n```|\n{% Video[\s\S]*?%})/g
    );

    return blocks.map((block, index) => {
      if (!block) return null;

      // Video block
      const videoMatch = block.match(
        /{% Video link="([^"]+)" title="([^"]+)" \/ %}/
      );
      if (videoMatch) {
        return (
          <VideoPlayer key={index} link={videoMatch[1]} title={videoMatch[2]} />
        );
      }

      // Code block
      const codeMatch = block.match(/```([a-zA-Z]*)\n([\s\S]*?)\n```/);
      if (codeMatch) {
        const title = codeMatch[1] || "code";
        const code = codeMatch[2].trim();
        return <CodeBlock key={index} title={title} code={code} />;
      }

      // Headings and Paragraphs
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
    });
  };

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none border-b pb-8 mb-8">
      {renderContent()}
    </div>
  );
};

function ClassRoomMainContent() {
  const { lessons, isLoading, currentLessonIndex, setCurrentLessonIndex } =
    useLessonContext();

  const currentLesson = lessons[currentLessonIndex] || null;
  const prevLesson =
    currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < lessons.length - 1
      ? lessons[currentLessonIndex + 1]
      : null;

  const getMainHeading = (lesson: LessonContent | null) => {
    if (!lesson || !lesson.raw) return "";
    const match = lesson.raw.match(/^#\s+(.+)/m);
    return match ? match[1].trim() : "";
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto h-full flex flex-col items-center">
      {isLoading || !currentLesson ? (
        <p>Loading lesson...</p>
      ) : (
        <>
          <LessonBlock lesson={currentLesson} />
          <div className="flex justify-between w-full mt-8 ">
            <Button
              variant="outline"
              disabled={currentLessonIndex === 0}
              onClick={() =>
                setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))
              }
            >
              {`Previous${
                getMainHeading(prevLesson)
                  ? ": " + getMainHeading(prevLesson)
                  : ""
              }`}
            </Button>
            <Button
              variant="outline"
              disabled={currentLessonIndex === lessons.length - 1}
              onClick={() =>
                setCurrentLessonIndex(
                  Math.min(lessons.length - 1, currentLessonIndex + 1)
                )
              }
            >
              {`Next${
                getMainHeading(nextLesson)
                  ? ": " + getMainHeading(nextLesson)
                  : ""
              }`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export { ClassRoomMainContent };
