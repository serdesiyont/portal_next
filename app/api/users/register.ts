import api from "@/lib/axios";

export async function register(formData: {
  name: string;
  email: string;
  phone_num: string;
  gender: string;
  division: string;
  additional: string;
}) {
  try {
    console.log(formData);
    const data = JSON.stringify(formData);
    console.log(data);
    const response = await api.post("/users", data);
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.error || error.message || "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
