import api from "@/lib/axios";
import axios from "axios";

export interface LessonDto {
  id: number;
  title: string;
  address: string;
  user?: {
    name: string;
    email: string;
    division: string;
    role: string;
  };
}

export interface SidebarItem {
  id: string;
  title: string;
  link?: string; // Add link property for anchor navigation
  children?: SidebarItem[];
}

export interface LessonContent {
  raw: string;
  sidebar: SidebarItem[];
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function parseMarkdownHeadings(markdown: string): SidebarItem[] {
  const lines = markdown.split("\n");
  const items: SidebarItem[] = [];
  let currentMain: SidebarItem | null = null;
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    if (line.startsWith("# ")) {
      const title = line.replace(/^# /, "").trim();
      currentMain = {
        id: slugify(title),
        title,
        link: `#${slugify(title)}`, // Set link for main heading
        children: [],
      } as SidebarItem & { link: string };
      items.push(currentMain);
    } else if (line.startsWith("## ")) {
      if (currentMain) {
        const title = line.replace(/^## /, "").trim();
        (currentMain.children as any[]).push({
          id: slugify(title),
          title,
          link: `#${slugify(title)}`, // Set link for subheading
          children: [],
        });
      }
    } else if (line.startsWith("### ")) {
      if (
        currentMain &&
        currentMain.children &&
        currentMain.children.length > 0
      ) {
        const lastH2 = currentMain.children[currentMain.children.length - 1];
        const title = line.replace(/^### /, "").trim();
        lastH2.children = lastH2.children || [];
        (lastH2.children as any[]).push({
          id: slugify(title),
          title,
          link: `#${slugify(title)}`, // Set link for sub-subheading
        });
      }
    }
  }
  return items;
}

// Load a lesson's markdown using its address (absolute URL or backend-relative path) via axios
export async function fetchLesson(address: string): Promise<LessonContent> {
  const client = axios.create();

  const url = address; // if relative, api.get will prefix baseURL

  const res = await client.get<string>(url, {
    responseType: "text",
  });
  const raw = res.data as unknown as string;
  return {
    raw,
    sidebar: parseMarkdownHeadings(raw),
  };
}

// Fetch the list of lessons from backend and return their addresses for consumption
export async function fetchLessonList(): Promise<string[]> {
  const { data } = await api.get<LessonDto[]>("/lessons");
  return (data || []).map((l) => l.address);
}

export async function fetchLessons(): Promise<LessonDto[]> {
  const { data } = await api.get<LessonDto[]>("/lessons");
  return data || [];
}

export { slugify };
