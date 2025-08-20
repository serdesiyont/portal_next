import React, { useEffect, useState } from "react";
import { parseExercisesMarkdown } from "../../../lib/exercise-loader";
import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";

const MARKDOWN_PATH = "/resources/questions.md";

export default function ExerciseMainContent() {
  const [sidebar, setSidebar] = useState<any[]>([]);
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

  if (!exerciseContents.length || !activeId) return <div>Loading...</div>;

  const exercise = exerciseContents.find((e) => e.id === activeId);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto relative">
        <div className="h-full w-full flex flex-col relative">
          <div className="pt-2 px-6 pb-6 flex-1 flex flex-col">
            {exercise ? (
              <div>
                <h2 className="text-2xl font-bold mb-2">{exercise.title}</h2>
                <p className="mb-4 text-muted-foreground whitespace-pre-line">
                  {exercise.description}
                </p>
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
