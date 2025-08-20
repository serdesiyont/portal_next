import axios from "axios";

const BASE_URL = process.env.BASE_DEV_URL || "http://localhost:8888";
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: BASE_URL,
  withCredentials: true
});

export async function login(formData: {
  email: string;
  password: string;
}) {
  try {
    const data = JSON.stringify(formData);
    console.log(formData)
    const response = await api.post("/auth/login", data);
    console.log(response.data)
    localStorage.setItem("ROLE", response.data.ROLE)
    localStorage.setItem("DIVISION", response.data.DIVISION);
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
