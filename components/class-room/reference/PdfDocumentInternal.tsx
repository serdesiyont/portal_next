"use client";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure pdf.js worker via URL string so each Document manages its own worker
if (typeof window !== "undefined") {
  try {
    const workerUrl = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  } catch {
    // Fallback to CDN with exact version
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }
}

export default function PdfDocumentInternal({
  url,
  width,
  pageNumber,
  onDocumentLoad,
}: {
  url: string;
  width?: number;
  pageNumber: number;
  onDocumentLoad?: (numPages: number) => void;
}) {
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    // reset pages on url change
    setNumPages(0);
  }, [url]);

  return (
    <Document
      file={url}
      onLoadSuccess={({ numPages }) => {
        setNumPages(numPages);
        onDocumentLoad?.(numPages);
      }}
      loading={
        <div className="p-6 text-sm text-muted-foreground">Loading PDF…</div>
      }
      error={
        <div className="p-6 text-sm text-destructive">Failed to load PDF.</div>
      }
    >
      <Page
        key={`page_${pageNumber}_${url}`}
        pageNumber={pageNumber}
        width={width || undefined}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        className="mx-auto my-2"
      />
    </Document>
  );
}
