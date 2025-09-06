"use client";
import React, { useEffect, useState, useRef } from "react";
import ReferenceSidebar from "./reference/reference-sidebar";
import ReferenceMainContent from "./reference/refence-main-content";
import { fetchPdfList, type PdfDoc } from "@/lib/pdf-loader";
import { ChatContent, ChatWidget } from "./chat-widget";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon, Lock } from "lucide-react";
import cookies from "js-cookie";

export default function Reference({
  hasApiKeyProp,
}: {
  hasApiKeyProp?: boolean;
}) {
  const [pdfs, setPdfs] = useState<PdfDoc[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<PdfDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleChatToggle = (isOpen: boolean) => setIsChatOpen(isOpen);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const [showApiKeyMsg, setShowApiKeyMsg] = useState(false);

  useEffect(() => {
    const getPdfs = async () => {
      try {
        const pdfList = await fetchPdfList();
        setPdfs(pdfList);
        if (pdfList.length > 0) {
          setSelectedPdf(pdfList[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    getPdfs();
  }, []);

  useEffect(() => {
    const v = cookies.get("HAS_API_KEY");
    const enabled = v === "true" || v === "1" || v?.toLowerCase?.() === "yes";
    setHasApiKey(!!enabled);
  }, []);

  useEffect(() => {
    if (typeof hasApiKeyProp === "boolean") {
      setHasApiKey(hasApiKeyProp);
    }
  }, [hasApiKeyProp]);

  // Helper to trigger profile button glow
  const triggerProfileGlow = () => {
    setShowApiKeyMsg(true);
    const btn = document.getElementById("profile-btn");
    if (btn) {
      btn.classList.add(
        "ring-4",
        "ring-green-400",
        "ring-offset-2",
        "animate-pulse"
      );
      setTimeout(() => {
        btn.classList.remove(
          "ring-4",
          "ring-green-400",
          "ring-offset-2",
          "animate-pulse"
        );
      }, 5000);
    }
    setTimeout(() => setShowApiKeyMsg(false), 5000);
  };

  return (
    <div className="flex h-full relative flex-col md:flex-row">
      {/* Top bar with sidebar trigger on mobile */}
      <div className="md:hidden sticky top-0 z-20 w-full border-b bg-background p-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 -ml-1"
          aria-expanded={isSidebarOpen}
          aria-controls="mobile-sidebar"
          onClick={() => setIsSidebarOpen((v) => !v)}
        >
          <PanelLeftIcon />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <span className="text-sm">Menu</span>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 border-r bg-muted/30 flex-shrink-0 overflow-y-auto">
        <ReferenceSidebar
          pdfs={pdfs}
          selectedPdf={selectedPdf}
          onSelectPdf={setSelectedPdf}
          loading={loading}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <ReferenceMainContent selectedUrl={selectedPdf?.address} />
      </div>

      {/* Chat panel / widget */}
      {isChatOpen ? (
        <aside className="w-full md:w-[500px] flex-shrink-0 overflow-hidden border-l relative">
          {hasApiKey === false && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="bg-background/95 border rounded-xl p-6 text-center shadow-lg w-[90%] max-w-sm relative">
                <button
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsChatOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h3 className="mt-2 text-base font-semibold">
                  API Key Required
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add Google Gemini API Key to use this feature.
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={triggerProfileGlow}
                >
                  Go to Profile
                </Button>
              </div>
            </div>
          )}
          <ChatContent
            onClose={() => setIsChatOpen(false)}
            showHeader={true}
            className={
              hasApiKey === false ? "pointer-events-none opacity-60" : ""
            }
          />
        </aside>
      ) : (
        <ChatWidget onChatToggle={handleChatToggle} />
      )}

      {/* Profile button glow helper (invisible, just for id) */}
      {/* The actual profile button in the navbar should have id="profile-btn" */}

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
            id="mobile-sidebar"
            className="relative ml-0 h-full w-4/5 max-w-xs bg-background border-r shadow-xl"
          >
            <div className="flex items-center justify-between border-b p-2">
              <span className="text-sm font-medium">References</span>
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
              <ReferenceSidebar
                pdfs={pdfs}
                selectedPdf={selectedPdf}
                onSelectPdf={(pdf) => {
                  setSelectedPdf(pdf);
                  setIsSidebarOpen(false);
                }}
                loading={loading}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
