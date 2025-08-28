import api from "@/lib/axios";

export interface ResourceDto {
  id: number;
  title: string;
  address: string; // direct URL to the resource (e.g., PDF)
  user?: {
    name: string;
    email: string;
    division: string;
    role: string;
  };
}

export async function fetchResources(): Promise<ResourceDto[]> {
  const { data } = await api.get<ResourceDto[]>("/resources");
  return data || [];
}

export async function createResource(params: {
  title: string;
  file: File | Blob; // PDF file
}): Promise<ResourceDto> {
  const form = new FormData();
  form.append("title", params.title);
  form.append("file", params.file);

  const { data } = await api.post<ResourceDto>("/resources", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function deleteResource(id: number): Promise<any> {
  const { data } = await api.delete(`/resources/${id}`);
  return data;
}
