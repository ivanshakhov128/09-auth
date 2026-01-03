import { api } from "./api"; // готовий Axios екземпляр
import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { AxiosResponse } from "axios";

/**
 * Повертає cookie header для серверних запитів (Next.js App Router)
 */
async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString(); // "accessToken=...; refreshToken=..."
}

/**
 * Отримати всі нотатки (серверний варіант)
 */
export async function fetchNotes(params?: {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get("/notes", {
    params,
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}

/**
 * Отримати нотатку за ID
 */
export async function fetchNoteById(id: Note["id"]): Promise<Note> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}

/**
 * Отримати поточного користувача
 */
export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}

/**
 * Перевірка сесії (наприклад для middleware або proxy)
 * Повертає повний AxiosResponse для доступу до set-cookie
 */
export async function checkServerSession(): Promise<AxiosResponse<User>> {
  const cookieHeader = await getCookieHeader();

  return api.get<User>("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });
}
