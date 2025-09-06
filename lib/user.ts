import api from "@/lib/axios";

export async function addApiKey(
  apiKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await api.post("/users/add-api", { apiKey });
    if (res.status === 200 && res.data?.status === "success") {
      return { success: true };
    }
    return { success: false, error: "Operation failed" };
  } catch (e: any) {
    return {
      success: false,
      error: e?.response?.data?.error || "Operation failed",
    };
  }
}

export async function changePassword(
  oldPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await api.post("/users/change-password", { oldPass, newPass });
    if (res.status === 200 && res.data?.status === "success") {
      return { success: true };
    }
    if (res.status === 404) {
      return { success: false, error: "The password you provided is wrong" };
    }
    return { success: false, error: "Operation failed" };
  } catch (e: any) {
    if (e?.response?.status === 404) {
      return { success: false, error: "The password you provided is wrong" };
    }
    return {
      success: false,
      error: e?.response?.data?.error || "Operation failed",
    };
  }
}
