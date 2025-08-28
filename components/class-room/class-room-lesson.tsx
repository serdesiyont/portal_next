import React, { useState } from "react";
import LessonSidebar from "./lesson/lesson-sidebar";
import { ClassRoomMainContent } from "./lesson/lesson-main-content";
import { LessonProvider } from "./lesson/LessonProvider";
import { ChatWidget, ChatContent } from "./chat-widget";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon } from "lucide-react";

export default function ClassRoomLesson() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleChatToggle = (isOpen: boolean) => setIsChatOpen(isOpen);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <LessonProvider>
      <div className="flex flex-1 overflow-hidden relative">
        {/* Top bar with sidebar trigger on mobile */}
        <div className="md:hidden sticky top-0 z-20 w-full border-b bg-background p-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 -ml-1"
            aria-expanded={isSidebarOpen}
            aria-controls="mobile-lesson-sidebar"
            onClick={() => setIsSidebarOpen((v) => !v)}
          >
            <PanelLeftIcon />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <span className="text-sm">Menu</span>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 border-r bg-muted/30 flex-shrink-0 overflow-y-auto">
          <LessonSidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto mb-6">
          <ClassRoomMainContent />
        </div>

        {/* Chat Widget/Panel */}
        {isChatOpen ? (
          <aside className="w-full md:w-[500px] flex-shrink-0 overflow-hidden border-l">
            <ChatContent
              onClose={() => handleChatToggle(false)}
              showHeader={true}
              className="h-full"
            />
          </aside>
        ) : (
          <ChatWidget onChatToggle={handleChatToggle} />
        )}

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 flex md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside
              id="mobile-lesson-sidebar"
              className="relative ml-0 h-full w-4/5 max-w-xs bg-background border-r shadow-xl"
            >
              <div className="flex items-center justify-between border-b p-2">
                <span className="text-sm font-medium">Lessons</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  Close
                </Button>
              </div>
              <div className="h-[calc(100%-44px)] overflow-y-auto">
                <LessonSidebar />
              </div>
            </aside>
          </div>
        )}
      </div>
    </LessonProvider>
  );
}
