import cookies from "js-cookie";
import api from "@/lib/axios";

export async function login(formData: {
  email: string;
  password: string;
}) {
  try {
    const data = JSON.stringify(formData);
    const response = await api.post("/auth/login", data);
    localStorage.setItem("ROLE", response.data.ROLE);
    localStorage.setItem("DIVISION", response.data.DIVISION);
    cookies.set("access_token", response.data.ACCESS_TOKEN, { expires: 1 });
    cookies.set("refresh_token", response.data.REFRESH_TOKEN, { expires: 7 });
    
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
