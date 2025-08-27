export interface PdfDoc {
  title: string;
  address: string;
  user?: any;
}

export async function fetchPdfList(): Promise<PdfDoc[]> {
  const axios = (await import("./axios")).default;
  const res = await axios.get<PdfDoc[]>("/resources");
  return res.data || [];
}

