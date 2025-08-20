import React from "react";

export interface ExerciseSidebarSection {
  heading: string;
  exercises: { title: string; id: string }[];
}

export interface ExerciseContent {
  id: string;
  title: string;
  description: string;
  code: string;
}

// Utility to fetch markdown file (should be used outside this parser)
export async function fetchMarkdownFile(path: string): Promise<string> {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to fetch markdown file");
  return await res.text();
}

export function parseExercisesMarkdown(markdown: string) {
  const lines = markdown.split("\n");
  const sidebar: ExerciseSidebarSection[] = [];
  const exerciseContents: ExerciseContent[] = [];

  let currentHeading = "";
  let currentExercise: ExerciseContent | null = null;
  let buffer: string[] = [];
  let codeBuffer: string[] = [];
  let inCode = false;
  let codeLang = "";

  const pushCurrentExercise = () => {
    if (currentExercise) {
      currentExercise.description = buffer.join("\n").trim();
      currentExercise.code = codeBuffer.join("\n").trim();
      exerciseContents.push(currentExercise);
      buffer = [];
      codeBuffer = [];
      currentExercise = null;
    }
  };

  lines.forEach((line) => {
    if (line.startsWith("# ")) {
      pushCurrentExercise();
      currentHeading = line.replace("# ", "").trim();
      sidebar.push({ heading: currentHeading, exercises: [] });
    } else if (line.startsWith("## ")) {
      pushCurrentExercise();
      const title = line.replace("## ", "").trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      currentExercise = { id, title, description: "", code: "" };
      if (sidebar.length) {
        sidebar[sidebar.length - 1].exercises.push({ title, id });
      }
    } else if (line.startsWith("### ")) {
      buffer.push(line.replace("### ", ""));
    } else if (line.startsWith("```")) {
      if (!inCode) {
        inCode = true;
        codeLang = line.replace("```", "").trim();
      } else {
        inCode = false;
      }
    } else if (inCode) {
      codeBuffer.push(line);
    } else {
      buffer.push(line);
    }
  });

  pushCurrentExercise();

  // Sidebar JSX
  const Sidebar: React.FC<{ onSelect?: (id: string) => void }> = ({ onSelect }) => (
    <div>
      {sidebar.map((section) => (
        <div key={section.heading}>
          <h3>{section.heading}</h3>
          <ul>
            {section.exercises.map((ex) => (
              <li key={ex.id}>
                <a
                  href={`#${ex.id}`}
                  onClick={e => {
                    e.preventDefault();
                    onSelect?.(ex.id);
                  }}
                >
                  {ex.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  // Exercise main content JSX
  const ExerciseMainContent: React.FC<{ id: string }> = ({ id }) => {
    const ex = exerciseContents.find((e) => e.id === id);
    if (!ex) return <div>Exercise not found.</div>;
    return (
      <div>
        <h2>{ex.title}</h2>
        <p>{ex.description}</p>
        <div style={{ marginTop: 24 }}>
          {/* Replace with your actual EditorPanel and OutputPanel components */}
          <div>{/* <EditorPanel code={ex.code} /> */}</div>
          <div>{/* <OutputPanel /> */}</div>
        </div>
      </div>
    );
  };

  return { Sidebar, ExerciseMainContent, exerciseContents, sidebar };
}
