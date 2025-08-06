"use client";
import { useEffect, useState } from "react";
import { fetchLesson, SidebarItem } from "@/lib/lesson-loader";

interface SidebarItemWithLink extends SidebarItem {
  link?: string;
  children?: SidebarItemWithLink[];
}

const FILES = [
  { label: "Lesson", filename: "lesson.md" },
  { label: "Exercise", filename: "exercise.md" },
  { label: "Reference", filename: "reference.md" },
];

export function ClassRoomSidebar({ section, onFileSelect, selectedFile }: {
  section: "lesson" | "exercise" | "reference";
  onFileSelect: (filename: string) => void;
  selectedFile: string;
}) {
  const [sidebarItems, setSidebarItems] = useState<SidebarItemWithLink[]>([]);

  useEffect(() => {
    fetchLesson(selectedFile).then((lesson) => setSidebarItems(lesson.sidebar as SidebarItemWithLink[]));
  }, [selectedFile]);

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-2">
        {FILES.map((file) => (
          <button
            key={file.filename}
            onClick={() => onFileSelect(file.filename)}
            className={`px-3 py-1 rounded ${selectedFile === file.filename ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
          >
            {file.label}
          </button>
        ))}
      </div>
      {sidebarItems.map((item) => (
        <div key={item.id} className="mb-4">
          <a
            href={item.link}
            className="font-semibold mb-2 block hover:text-primary transition-colors"
          >
            {item.title}
          </a>
          {item.children && (
            <ul className="space-y-1 text-sm">
              {item.children.map((child) => (
                <li key={child.id}>
                  <a
                    href={child.link}
                    className="text-muted-foreground block py-1 px-2 rounded-md hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {child.title}
                  </a>
                  {child.children && (
                    <ul className="ml-4">
                      {child.children.map((sub) => (
                        <li key={sub.id}>
                          <a
                            href={sub.link}
                            className="text-xs text-muted-foreground block py-1 px-2 rounded-md hover:text-foreground hover:bg-muted/50 transition-colors"
                          >
                            {sub.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
