import axios from "axios";
import type { User } from "../../types/user";
import type { Note } from "../../types/note";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

/**
 * Создаём серверный экземпляр axios с передачей куки для авторизации
 * @param sessionCookie - значение куки "notehub-session"
 */
export const serverApi = (sessionCookie?: string) =>
  axios.create({
    baseURL,
    headers: sessionCookie
      ? { Cookie: `notehub-session=${sessionCookie}` }
      : {},
    withCredentials: true,
  });

export const fetchNotes = async (
  sessionCookie?: string,
  params?: {
    search?: string;
    page?: number;
    perPage?: number;
    tag?: string;
  }
): Promise<Note[]> => {
  const { data } = await serverApi(sessionCookie).get("/notes", { params });
  return data;
};

export const fetchNoteById = async (
  sessionCookie: string,
  id: string
): Promise<Note> => {
  const { data } = await serverApi(sessionCookie).get(`/notes/${id}`);
  return data;
};

export const getMe = async (sessionCookie: string): Promise<User> => {
  const { data } = await serverApi(sessionCookie).get("/users/me");
  return data;
};

export const checkSession = async (
  sessionCookie?: string
): Promise<User | null> => {
  if (!sessionCookie) return null;

  try {
    const { data } = await serverApi(sessionCookie).get("/auth/session");
    return data || null;
  } catch {
    return null;
  }
};
