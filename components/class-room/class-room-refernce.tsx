"use client";
import ReferenceSidebar from "./reference/reference-sidebar";
import ReferenceMainContent from "./reference/refence-main-content";
import { ChatContent, ChatWidget } from "./chat-widget";
import { useState } from "react";
import type { PdfDoc } from "@/lib/pdf-loader";

export default function Reference() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<PdfDoc | undefined>(undefined);
  const handleChatToggle = (isOpen: boolean) => setIsChatOpen(isOpen);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar for reference */}
      <aside className="w-64 border-r bg-muted/30 flex-shrink-0 overflow-y-auto">
        <ReferenceSidebar
          onSelect={setSelectedPdf}
          selectedUrl={selectedPdf?.url}
        />
      </aside>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <ReferenceMainContent selectedUrl={selectedPdf?.url} />
      </div>
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
  );
}
