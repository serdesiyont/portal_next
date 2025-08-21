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

  useEffect(() => {
    async function loadLessons() {
      setIsLoading(true);
      const files = await fetchLessonList();
      setLessonFiles(files);
      const lessonContents = await Promise.all(files.map(fetchLesson));
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
    </LessonContext.Provider>
  );
}
