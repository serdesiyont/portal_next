"use client";
import { fetchLesson, fetchLessonList, SidebarItem } from "@/lib/lesson-loader";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SidebarItemWithLink extends SidebarItem {
  link?: string;
  children?: SidebarItemWithLink[];
}

interface LessonSidebar {
  filename: string;
  title: string;
  items: SidebarItemWithLink[];
}

export default function LessonSidebar() {
  const [lessonSidebars, setLessonSidebars] = useState<LessonSidebar[]>([]);
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [loadedLessonIndexes, setLoadedLessonIndexes] = useState<Set<number>>(
    new Set([0])
  );

  useEffect(() => {
    const loadAllSidebars = async () => {
      const lessonFiles = await fetchLessonList();
      const allSidebarsData = await Promise.all(
        lessonFiles.map(async (filename) => {
          const lesson = await fetchLesson(filename);
          const lessonTitle =
            lesson.sidebar.length > 0 ? lesson.sidebar[0].title : filename;
          return {
            filename,
            title: lessonTitle,
            items: lesson.sidebar as SidebarItemWithLink[],
          };
        })
      );
      setLessonSidebars(allSidebarsData);
      const open: { [key: string]: boolean } = {};
      allSidebarsData.forEach((lessonSidebar) => {
        lessonSidebar.items.forEach((item) => {
          open[item.id] = true;
        });
      });
      setOpenItems(open);
    };
    loadAllSidebars();
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sidebar-load-lessons", {
        detail: Array.from(loadedLessonIndexes),
      })
    );
  }, [loadedLessonIndexes]);

  const loadLessonByIndex = (idx: number) => {
    window.dispatchEvent(
      new CustomEvent("sidebar-load-lessons", {
        detail: [idx],
      })
    );
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: string | undefined,
    lessonIdx: number
  ) => {
    if (!link) return;
    e.preventDefault();
    loadLessonByIndex(lessonIdx);
    setTimeout(() => {
      const id = link.replace(/^#/, "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", link);
      }
    }, 100);
  };

  return (
    <div className="p-1">
      {lessonSidebars.map((lessonSidebar, lessonIdx) => (
        <div key={lessonSidebar.filename} className="mb-6">
          <h3 className="font-semibold mb-2 text-lg text-primary">
            {/* {lessonSidebar.title} */}
          </h3>
          <ul className="space-y-1 text-sm">
            {lessonSidebar.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenItems((prev) => ({
                      ...prev,
                      [item.id]: !prev[item.id],
                    }))
                  }
                  className={
                    "w-full text-left py-1 px-2 rounded-md font-medium transition-colors mb-1.5" +
                    (item.children && openItems[item.id]
                      ? " bg-muted/50 text-primary shadow-lg"
                      : " text-muted-foreground")
                  }
                  aria-expanded={!!openItems[item.id]}
                >
                  <span>{item.title}</span>
                  {item.children && (
                    <span className="ml-1 text-xs">
                      {openItems[item.id] ? "▼" : "▶"}
                    </span>
                  )}
                </button>
                {item.children && openItems[item.id] && (
                  <ul className="ml-2 space-y-1 text-sm">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={child.link}
                          onClick={(e) =>
                            handleLinkClick(e, child.link, lessonIdx)
                          }
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
                                  onClick={(e) =>
                                    handleLinkClick(e, sub.link, lessonIdx)
                                  }
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
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
