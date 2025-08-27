import type { PdfDoc } from "@/lib/pdf-loader";

export default function ReferenceSidebar({
  pdfs,
  selectedPdf,
  onSelectPdf,
  loading,
}: {
  pdfs: PdfDoc[];
  selectedPdf: PdfDoc | null;
  onSelectPdf: (pdf: PdfDoc) => void;
  loading: boolean;
}) {
  return (
    <div className="p-6 w-80 border-r">
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Reference</h3>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : pdfs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No PDFs found.</div>
        ) : (
          <ul className="space-y-1 text-sm">
            {pdfs.map((pdf) => (
              <li key={pdf.address}>
                <button
                  type="button"
                  onClick={() => onSelectPdf(pdf)}
                  className={`w-full text-left block py-1 px-2 rounded-md transition-colors ${
                    selectedPdf?.address === pdf.address
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={pdf.title}
                >
                  {pdf.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
