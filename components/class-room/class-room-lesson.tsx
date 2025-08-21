import React, { useState } from "react";
import LessonSidebar from "./lesson/lesson-sidebar";
import { ClassRoomMainContent } from "./lesson/lesson-main-content";
import { LessonProvider } from "./lesson/LessonProvider";
import { ChatWidget, ChatContent } from "./chat-widget";

export default function ClassRoomLesson() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleChatToggle = (isOpen: boolean) => setIsChatOpen(isOpen);

  return (
    <LessonProvider>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for lessons */}
        <aside className="w-64 border-r bg-muted/30 flex-shrink-0 overflow-y-auto">
          <LessonSidebar />
        </aside>
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto mb-6">
          <ClassRoomMainContent />
        </div>
        {/* Chat Widget/Panel */}
        {isChatOpen ? (
          <aside className="w-[500px] flex-shrink-0 overflow-hidden border-l">
            <ChatContent
              onClose={() => handleChatToggle(false)}
              showHeader={true}
              className="h-full"
            />
          </aside>
        ) : (
          <ChatWidget onChatToggle={handleChatToggle} />
        )}
      </div>
    </LessonProvider>
  );
}
