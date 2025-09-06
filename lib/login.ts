import api from "@/lib/axios";
import cookies from "js-cookie";

export async function login(formData: { email: string; password: string }) {
  try {
    const data = JSON.stringify(formData);
    const response = await api.post("/auth/login", data);
    localStorage.setItem("ROLE", response.data.ROLE);
    localStorage.setItem("DIVISION", response.data.DIVISION);
    cookies.set("NAME", response.data.NAME);
    cookies.set("EMAIL", response.data.EMAIL);
    cookies.set("HAS_API_KEY", response.data.HAS_API_KEY);
    // Store division in cookies as well so client components can access it easily
    cookies.set("DIVISION", response.data.DIVISION);
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

export function logout(): boolean {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ROLE");
      localStorage.removeItem("DIVISION");
    }
    cookies.remove("NAME");
    cookies.remove("EMAIL");
    cookies.remove("access_token");
    cookies.remove("refresh_token");
    cookies.remove("HAS_API_KEY");
    // Remove division cookie
    cookies.remove("DIVISION");
    return true;
  } catch (e) {
    return false;
  }
}
