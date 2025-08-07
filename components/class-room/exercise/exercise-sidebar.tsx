import Link from "next/link";
import { useState } from "react";

export default function ExerciseSidebar() {
  // Example: list of exercises
  const exercises = [
    { id: 1, title: "Reverse a String" },
    { id: 2, title: "Sum of Array" },
    { id: 3, title: "Find Maximum Number" },
    { id: 4, title: "Is Palindrome" },
  ];
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Exercises</h3>
        <ul className="space-y-1 text-sm">
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <Link
                href={`#exercise-${exercise.id}`}
                className={`block py-1 px-2 rounded-md transition-colors cursor-pointer ${
                  activeId === exercise.id
                    ? "bg-blue-500/10 text-blue-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setActiveId(exercise.id)}
              >
                {exercise.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
