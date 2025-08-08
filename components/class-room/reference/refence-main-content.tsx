"use client";
import PdfViewer from "./PdfViewer";

export default function ReferenceMainContent({
  selectedUrl,
}: {
  selectedUrl?: string;
}) {
  return (
    <div className="p-6 h-full">
      {!selectedUrl ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Reference Documentation</h2>
          <p className="mb-4 text-muted-foreground">
            Select a PDF from the sidebar to view it here.
          </p>
        </div>
      ) : (
        <div className="h-[calc(100vh-8rem)] -m-6">
          <PdfViewer url={selectedUrl} />
        </div>
      )}
    </div>
  );
}
