import axios from "./axios";

export interface Exercise {
  id: number;
  title: string;
  description: string;
  language: string;
  boilerplate: { code: string };
  user: {
    name: string;
    email: string;
    division: string;
    role: string;
  };
}

export async function fetchExercises(): Promise<Exercise[]> {
  try {
    const res = await axios.get<Exercise[]>("/exercises");
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    // Depending on requirements, you might want to throw the error
    // or handle it differently. Returning an empty array for now.
    return [];
  }
}
