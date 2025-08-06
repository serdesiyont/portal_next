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

export async function fetchLesson(filename: string): Promise<LessonContent> {
  const res = await fetch(`/resources/${filename}`);
  const raw = await res.text();
  return {
    raw,
    sidebar: parseMarkdownHeadings(raw),
  };
}

// New function to fetch the list of lesson files
export async function fetchLessonList(): Promise<string[]> {
  const res = await fetch(`/resources/lessons.json`);
  const data = await res.json();
  return data.lessons;
}

export { slugify };
