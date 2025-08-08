"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import PdfDocumentInternal from "./PdfDocumentInternal";

export default function PdfViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState<number>(0);

  // Reset on URL change
  useEffect(() => {
    setPage(1);
    setNumPages(0);
  }, [url]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onDocLoad = useCallback((n: number) => setNumPages(n), []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        setPage((p) => Math.min(p + 1, numPages || p + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setPage((p) => Math.max(p - 1, 1));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [numPages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b p-2 text-sm">
        <button
          className="px-2 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <div className="flex items-center gap-1">
          <input
            className="w-16 px-2 py-1 border rounded bg-background"
            type="number"
            min={1}
            max={numPages || 1}
            value={page}
            onChange={(e) => {
              const v = Number(e.target.value) || 1;
              setPage(Math.min(Math.max(1, v), numPages || v));
            }}
          />
          <span className="text-muted-foreground">/ {numPages || "—"}</span>
        </div>
        <button
          className="px-2 py-1 rounded border disabled:opacity-50"
          onClick={() =>
            setPage((p) => (numPages ? Math.min(numPages, p + 1) : p + 1))
          }
          disabled={numPages ? page >= numPages : false}
        >
          Next
        </button>
        <div className="ml-auto text-muted-foreground truncate" title={url}>
          {/* {url} */}
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto">
        <PdfDocumentInternal
          key={url}
          url={url}
          width={containerWidth || undefined}
          pageNumber={page}
          onDocumentLoad={onDocLoad}
        />
      </div>
    </div>
  );
}
