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

// Extended DTO for mentors endpoint
export interface ExerciseAllDto {
  id: number;
  title: string;
  description: string;
  language: string;
  boilerplate: Record<string, unknown>;
  user: {
    name: string;
    email: string;
    division?: string;
    role?: string;
  };
  testCases: Record<string, unknown>;
  schedule?: string; // ISO string from OffsetDateTime
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

// Fetch exercises for mentors page
export async function fetchMentorExercises(): Promise<ExerciseAllDto[]> {
  try {
    const res = await axios.get<ExerciseAllDto[]>("/exercises/mentors");
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch mentor exercises:", error);
    return [];
  }
}

// Delete exercise by id
export async function deleteExercise(id: number): Promise<string> {
  try {
    const res = await axios.delete(`/exercises/${id}`);
    // assume API returns a message, otherwise default
    // @ts-ignore
    return res?.data?.message || "Exercise deleted";
  } catch (error: any) {
    console.error(`Failed to delete exercise ${id}:`, error);
    throw new Error(error?.message || "Failed to delete exercise");
  }
}

export async function createExercise(payload: {
  title: string;
  description: string;
  language: string;
  boilerplate: Record<string, unknown>;
  testCases: Record<string, unknown>;
  schedule?: string; // ISO string
}): Promise<any> {
  try {
    const res = await axios.post("/exercises", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to create exercise:", error);
    throw new Error(error?.message || "Failed to create exercise");
  }
}
