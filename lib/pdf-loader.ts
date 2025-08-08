export interface PdfDoc {
  name: string;
  url: string;
  displayName: string;
}

export async function fetchPdfList(): Promise<PdfDoc[]> {
  const res = await fetch("/api/pdfs", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.pdfs as PdfDoc[];
}
