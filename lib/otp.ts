import api from "@/lib/axios";

export async function sendOtp(name: string, email: string, purpose: string) {
  try {
    const response = await api.post("/otp", {
      name,
      email,
      purpose: purpose,
    });
    return new Response(JSON.stringify(response.data), {
      status: response.status,
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

export async function verifyOtp(email: string, code: number, purpose: string) {
  try {
    const response = await api.post("/otp/verify", {
      email,
      purpose: purpose,
      code,
    });
    return new Response(JSON.stringify(response.data), {
      status: response.status,
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
