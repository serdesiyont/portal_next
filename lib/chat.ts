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

export interface ChatHistoryItem {
  id: number;
  userMessage: string;
  aiResponse: string;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export async function getChatHistory(
  page = 0,
  size = 10
): Promise<Page<ChatHistoryItem> | null> {
  try {
    const response = await api.get<Page<ChatHistoryItem>>("/chat", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting chat history:", error);
    return null;
  }
}
