"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  fetchLesson,
  fetchLessonList,
  LessonContent,
  SidebarItem,
} from "@/lib/lesson-loader";

interface LessonProviderValue {
  lessonFiles: string[];
  lessons: LessonContent[];
  isLoading: boolean;
  currentLessonIndex: number;
  setCurrentLessonIndex: (idx: number) => void;
}

const LessonContext = createContext<LessonProviderValue | undefined>(undefined);

export function useLessonContext() {
  const ctx = useContext(LessonContext);
  if (!ctx)
    throw new Error("useLessonContext must be used within LessonProvider");
  return ctx;
}

export function LessonProvider({ children }: { children: ReactNode }) {
  const [lessonFiles, setLessonFiles] = useState<string[]>([]);
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    async function loadLessons() {
      setIsLoading(true);
      let files: string[] = [];
      try {
        files = await fetchLessonList();
      } catch (err: any) {
        if (err?.response?.status === 401) {
          setShowAuthPopup(true);
          let seconds = 3;
          setCountdown(seconds);
          const interval = setInterval(() => {
            seconds--;
            setCountdown(seconds);
            if (seconds <= 0) {
              clearInterval(interval);
              window.location.href = "/login";
            }
          }, 1000);
        } else {
          console.error("Failed to fetch lesson list:", err);
        }
        setIsLoading(false);
        return;
      }
      setLessonFiles(files);
      let lessonContents: LessonContent[] = [];
      try {
        lessonContents = await Promise.all(
          files.map(async (file) => {
            try {
              return await fetchLesson(file);
            } catch (err) {
              console.error(`Failed to fetch lesson for file ${file}:`, err);
              return {
                title: "Error",
                content: "Could not load lesson.",
                raw: "",
                sidebar: [],
              } as LessonContent;
            }
          })
        );
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      }
      setLessons(lessonContents);
      setIsLoading(false);
    }
    loadLessons();
  }, []);

  return (
    <LessonContext.Provider
      value={{
        lessonFiles,
        lessons,
        isLoading,
        currentLessonIndex,
        setCurrentLessonIndex,
      }}
    >
      {children}
      {showAuthPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Authentication Required</h2>
            <p style={{ marginBottom: "1rem" }}>
              You need to sign in to view lessons.
              <br />
              Redirecting to login in {countdown} second
              {countdown !== 1 ? "s" : ""}...
            </p>
            <button
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                background: "#ef4444",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => (window.location.href = "/login")}
            >
              Go to Login Now
            </button>
          </div>
        </div>
      )}
    </LessonContext.Provider>
  );
}
