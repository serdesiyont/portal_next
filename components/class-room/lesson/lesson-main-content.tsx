"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  fetchLesson,
  fetchLessonList,
  slugify,
  LessonContent,
} from "@/lib/lesson-loader";

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

export function ClassRoomMainContent() {
  const [lessonFiles, setLessonFiles] = useState<string[]>([]);
  const [loadedLessons, setLoadedLessons] = useState<LessonContent[]>([]);
  const [nextLessonIndex, setNextLessonIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Listen for sidebar requests to load specific lessons
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number[]>).detail;
      if (Array.isArray(detail)) {
        // Load all lessons up to the highest requested index
        const maxIdx = Math.max(...detail);
        loadLessonsUpTo(maxIdx);
      }
    };
    window.addEventListener("sidebar-load-lessons", handler);
    return () => window.removeEventListener("sidebar-load-lessons", handler);
  }, [lessonFiles, loadedLessons]);

  // Helper to load lessons up to a given index
  const loadLessonsUpTo = useCallback(
    async (idx: number) => {
      if (lessonFiles.length === 0) return;
      let toLoad = idx + 1 - loadedLessons.length;
      if (toLoad <= 0) return;
      setIsLoading(true);
      const newLessons: LessonContent[] = [];
      for (
        let i = loadedLessons.length;
        i <= idx && i < lessonFiles.length;
        i++
      ) {
        const lesson = await fetchLesson(lessonFiles[i]);
        newLessons.push(lesson);
      }
      setLoadedLessons((prev) => [...prev, ...newLessons]);
      setNextLessonIndex(idx + 1);
      setIsLoading(false);
    },
    [lessonFiles, loadedLessons]
  );

  // Fetch initial lesson list
  useEffect(() => {
    const loadInitialData = async () => {
      const files = await fetchLessonList();
      setLessonFiles(files);
    };
    loadInitialData();
  }, []);

  // Load the first lesson once files are listed
  useEffect(() => {
    if (lessonFiles.length > 0 && loadedLessons.length === 0) {
      loadNextLesson();
    }
  }, [lessonFiles]);

  const loadNextLesson = useCallback(async () => {
    if (isLoading || nextLessonIndex >= lessonFiles.length) {
      return;
    }
    setIsLoading(true);
    const filename = lessonFiles[nextLessonIndex];
    const lesson = await fetchLesson(filename);
    setLoadedLessons((prev) => [...prev, lesson]);
    setNextLessonIndex((prev) => prev + 1);
    setIsLoading(false);
  }, [isLoading, nextLessonIndex, lessonFiles]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const { scrollHeight, scrollTop, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 500) {
        loadNextLesson();
      }
    }
  }, [loadNextLesson]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="p-8 w-full max-w-6xl mx-auto overflow-y-auto h-full"
    >
      {loadedLessons.map((lesson, index) => (
        <LessonBlock key={index} lesson={lesson} />
      ))}
      {isLoading && <p>Loading next lesson...</p>}
    </div>
  );
}
