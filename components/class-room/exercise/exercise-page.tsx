import React, { useEffect, useState } from "react";
import { fetchExercises, Exercise } from "@/lib/exercise-loader";
import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronsDown,
  ChevronsUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

function ExerciseSidebar({
  exercises,
  activeId,
  setActiveId,
  expandedIds,
  toggleExpand,
}: {
  exercises: Exercise[];
  activeId: number | null;
  setActiveId: (id: number) => void;
  expandedIds: number[];
  toggleExpand: (id: number) => void;
}) {
  return (
    <div className="p-1">
      <ul className="space-y-2">
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <button
              type="button"
              className={cn(
                "w-full text-left py-1 px-2 rounded-md font-medium transition-colors flex justify-between items-center",
                activeId === exercise.id
                  ? "bg-muted/50 text-primary shadow-lg"
                  : "text-muted-foreground"
              )}
              onClick={() => {
                setActiveId(exercise.id);
                toggleExpand(exercise.id);
              }}
              aria-current={activeId === exercise.id ? "page" : undefined}
            >
              <span>{exercise.title}</span>
              {expandedIds.includes(exercise.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedIds.includes(exercise.id) && (
              <div
                className="mt-2 ml-2 p-2 rounded bg-muted/20 border cursor-pointer"
                onClick={() => setActiveId(exercise.id)}
              >
                <p className="text-muted-foreground whitespace-pre-line">
                  {exercise.description}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExercisePage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isOutputVisible, setIsOutputVisible] = useState(true);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    async function load() {
      const data = await fetchExercises();
      setExercises(data);
      if (data.length) setActiveId(data[0].id);
      setExpandedIds(data.length ? [data[0].id] : []);
    }
    load();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  if (!exercises.length || activeId === null) return <div>Loading...</div>;

  const exercise = exercises.find((e) => e.id === activeId);

  const handleRun = async (code: string) => {
    setOutput("Result: " + code.slice(0, 40));
    setIsOutputVisible(true);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-[520px] h-full flex-shrink-0 overflow-hidden border-r bg-background rounded-xl shadow-lg p-6 flex flex-col">
        <ExerciseSidebar
          exercises={exercises}
          activeId={activeId}
          setActiveId={setActiveId}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
        />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className={
            isOutputVisible ? "pt-1 pb-1 flex-1 min-h-0" : "pt-1 pb-1 flex-1"
          }
          style={{
            height: isOutputVisible ? "calc(100% - 300px)" : "100%",
            transition: "height 0.2s",
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {exercise && (
            <EditorPanel
              code={exercise.boilerplate.code.replace(/\/n/g, "\n")}
              language={exercise.language.toLowerCase()}
              exerciseId={exercise.id.toString()}
              exercise={{
                id: exercise.id,
                title: exercise.title,
                description: exercise.description,
                language: exercise.language.toLowerCase(),
              }}
            />
          )}
        </div>
        {output && (
          <div className="w-full bg-green-50 border border-green-200 rounded p-4 mb-2 text-green-800 font-mono">
            {output}
          </div>
        )}
        <div className="border-t">
          <Button
            onClick={() => setIsOutputVisible(!isOutputVisible)}
            variant="ghost"
            className="w-full justify-center items-center gap-2"
          >
            {isOutputVisible ? (
              <ChevronsDown className="h-4 w-4" />
            ) : (
              <ChevronsUp className="h-4 w-4" />
            )}
            <span>{isOutputVisible ? "Hide Output" : "Show Output"}</span>
          </Button>
        </div>
        {isOutputVisible && (
          <div className="h-[300px] flex-shrink-0 bg-background">
            <OutputPanel />
          </div>
        )}
      </div>
    </div>
  );
}
