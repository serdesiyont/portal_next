import api from "./axios";

interface ChatRequest {
  message: string;
}

/**
 * Fetches a chat response from the backend.
 * @param chatRequest The message from the user.
 * @returns A promise that resolves to the AI's response string.
 */
export const getChatResponse = async (
  chatRequest: ChatRequest
): Promise<string> => {
  try {
    // The backend is expected to return a string directly
    const response = await api.post<string>("/chat", chatRequest);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat response:", error);
    // Return a user-friendly error message
    return "Sorry, I encountered an error. Please try again.";
  }
};
