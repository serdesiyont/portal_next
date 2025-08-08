import React, { useEffect, useState } from "react";
import {
  parseExercisesMarkdown,
  ExerciseSidebarSection,
} from "../../../lib/exercise-loader";
import { cn } from "@/lib/utils";

// Path to your markdown file
const MARKDOWN_PATH = "/resources/questions.md";

export default function ExerciseSidebar({
  activeId,
  setActiveId,
}: {
  activeId: string | null;
  setActiveId: (id: string) => void;
}) {
  const [sidebarSections, setSidebarSections] = useState<
    ExerciseSidebarSection[]
  >([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(MARKDOWN_PATH);
      const md = await res.text();
      const { sidebar } = parseExercisesMarkdown(md);
      setSidebarSections(sidebar);
    }
    load();
  }, []);

  return (
    <div className="p-6">
      {sidebarSections.map((section) => (
        <div key={section.heading} className="mb-6">
          <h3 className="font-semibold mb-2 text-lg text-primary">
            {section.heading}
          </h3>
          <ul className="space-y-1 text-sm">
            {section.exercises.map((exercise) => (
              <li key={exercise.id}>
                <button
                  type="button"
                  className={cn(
                    "w-full text-left py-1 px-2 rounded-md font-medium transition-colors",
                    activeId === exercise.id
                      ? "bg-muted/50 text-primary shadow-lg"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setActiveId(exercise.id)}
                  aria-current={activeId === exercise.id ? "page" : undefined}
                >
                  <span>{exercise.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
