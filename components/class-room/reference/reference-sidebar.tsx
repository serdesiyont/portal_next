import { useEffect, useState } from "react";
import { fetchPdfList, type PdfDoc } from "@/lib/pdf-loader";

export default function ReferenceSidebar({
  onSelect,
  selectedUrl,
}: {
  onSelect: (pdf: PdfDoc) => void;
  selectedUrl?: string;
}) {
  const [pdfs, setPdfs] = useState<PdfDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await fetchPdfList();
        if (mounted) setPdfs(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Reference</h3>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : pdfs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No PDFs found.</div>
        ) : (
          <ul className="space-y-1 text-sm">
            {pdfs.map((pdf) => (
              <li key={pdf.url}>
                <button
                  type="button"
                  onClick={() => onSelect(pdf)}
                  className={`w-full text-left block py-1 px-2 rounded-md transition-colors ${
                    selectedUrl === pdf.url
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={pdf.name}
                >
                  {pdf.displayName.replace(/\.pdf$/i, "")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
