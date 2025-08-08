import React, { useEffect, useState } from "react";
import {
  parseExercisesMarkdown,
  ExerciseSidebarSection,
} from "../../../lib/exercise-loader";
import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";
import { cn } from "@/lib/utils";

function ExerciseSidebar({
  sidebarSections,
  activeId,
  setActiveId,
}: {
  sidebarSections: ExerciseSidebarSection[];
  activeId: string | null;
  setActiveId: (id: string) => void;
}) {
  return (
    <div className="p-1">
      {sidebarSections.map((section) => (
        <div key={section.heading} className="mb-6">
          <h3 className="font-semibold mb-2  text-lg text-primary">
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

const MARKDOWN_PATH = "/resources/questions.md";

export default function ExercisePage() {
  const [sidebar, setSidebar] = useState<ExerciseSidebarSection[]>([]);
  const [exerciseContents, setExerciseContents] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(MARKDOWN_PATH);
      const md = await res.text();
      const parsed = parseExercisesMarkdown(md);
      setSidebar(parsed.sidebar);
      setExerciseContents(parsed.exerciseContents);
      if (parsed.exerciseContents.length)
        setActiveId(parsed.exerciseContents[0].id);
    }
    load();
  }, []);

  if (!sidebar.length || !exerciseContents.length || !activeId)
    return <div>Loading...</div>;

  const exercise = exerciseContents.find((e) => e.id === activeId);

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-[300px] h-full flex-shrink-0 overflow-hidden border-r bg-background rounded-xl shadow-lg p-6 flex flex-col">
        <ExerciseSidebar
          sidebarSections={sidebar}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      </aside>
      <div className="flex-1 overflow-y-auto relative">
        <div className="h-full w-full flex flex-col relative">
          <div className="pt-2 px-6 pb-6 flex-1 flex flex-col">
            {exercise ? (
              <div>
                <h2 className="text-2xl font-bold mb-2">{exercise.title}</h2>
                <div className="mb-4 rounded-xl bg-muted/40 shadow-lg border border-muted p-4">
                  <p className="text-muted-foreground whitespace-pre-line">
                    {exercise.description}
                  </p>
                </div>
                <div className="mb-6">
                  <EditorPanel
                    code={exercise.code}
                    language={exercise.language}
                    exerciseId={exercise.id}
                  />
                </div>
              </div>
            ) : (
              <div>Exercise not found.</div>
            )}
          </div>
        </div>
      </div>
      <aside className="w-[500px] h-full flex-shrink-0 overflow-hidden border-l bg-background rounded-xl shadow-lg p-6 flex flex-col justify-between">
        <OutputPanel />
      </aside>
    </div>
  );
}
