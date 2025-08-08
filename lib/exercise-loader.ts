export interface ExerciseSidebarSection {
  heading: string;
  exercises: { title: string; id: string }[];
}

export interface ExerciseContent {
  id: string;
  title: string;
  description: string;
  code: string;
  language?: string;
}

export async function fetchMarkdownFile(path: string): Promise<string> {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to fetch markdown file");
  return await res.text();
}

export function parseExercisesMarkdown(markdown: string): {
  sidebar: ExerciseSidebarSection[];
  exerciseContents: ExerciseContent[];
} {
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
      currentExercise.language = codeLang;
      exerciseContents.push(currentExercise);
      buffer = [];
      codeBuffer = [];
      currentExercise = null;
      codeLang = "";
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
        codeLang = line.substring(3).trim();
        codeBuffer = [];
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

  return { sidebar, exerciseContents };
}
