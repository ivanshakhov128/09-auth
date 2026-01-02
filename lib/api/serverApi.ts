import axios from "axios";
import type { User } from "../types/user";
import type { Note } from "../types/note";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

// Серверный axios с поддержкой передачи куки через headers
export const serverApi = (cookies: string) =>
  axios.create({
    baseURL,
    headers: {
      Cookie: cookies, // передаем куки для авторизации
    },
    withCredentials: true,
  });

// ==== Notes ====
export const fetchNotes = async (
  cookies: string,
  params?: {
    search?: string;
    page?: number;
    perPage?: number;
    tag?: string;
  }
): Promise<Note[]> => {
  const { data } = await serverApi(cookies).get("/notes", { params });
  return data;
};

export const fetchNoteById = async (
  cookies: string,
  id: string
): Promise<Note> => {
  const { data } = await serverApi(cookies).get(`/notes/${id}`);
  return data;
};

// ==== User ====
export const getMe = async (cookies: string): Promise<User> => {
  const { data } = await serverApi(cookies).get("/users/me");
  return data;
};

export const checkSession = async (cookies: string): Promise<User | null> => {
  try {
    const { data } = await serverApi(cookies).get("/auth/session");
    return data || null;
  } catch {
    return null;
  }
};
