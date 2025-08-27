"use client";
import { useEffect, useState } from "react";
import ReferenceSidebar from "./reference/reference-sidebar";
import ReferenceMainContent from "./reference/refence-main-content";
import { fetchPdfList, type PdfDoc } from "@/lib/pdf-loader";
import {ChatContent, ChatWidget } from "./chat-widget";

export default function Reference() {
  const [pdfs, setPdfs] = useState<PdfDoc[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<PdfDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleChatToggle = (isOpen: boolean) => setIsChatOpen(isOpen);

  

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

  return (
    <div className="flex h-full relative">
      <ReferenceSidebar
        pdfs={pdfs}
        selectedPdf={selectedPdf}
        onSelectPdf={setSelectedPdf}
        loading={loading}
      />
      <div className="flex-1 overflow-y-auto">
        <ReferenceMainContent selectedUrl={selectedPdf?.address} />
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
