// lib/api/clientApi.ts
import { api } from "./api"; // твой axios с baseURL и withCredentials
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

// ==========================
// Notes
// ==========================
export interface FetchNotesProps {
  search?: string;
  page: number;
  perPage?: number;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNoteProps {
  id?: string;
  title: string;
  content: string;
  tag: string;
}

export async function fetchNotes({
  search,
  page,
  perPage = 12,
  tag,
}: FetchNotesProps): Promise<FetchNotesResponse> {
  const response = await api
    .get<FetchNotesResponse>("/notes", {
      params: { search, page, perPage, tag },
    })
    .then((res) => res.data);
  return response;
}

export async function fetchNoteById(id: Note["id"]): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`).then((res) => res.data);
  return response;
}

export async function createNote(data: CreateNoteProps): Promise<Note> {
  const response = await api.post<Note>("/notes", data);
  return response.data;
}

export async function deleteNote(id: Note["id"]): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

// ==========================
// Auth & User
// ==========================
export interface RegisterRequest {
  email: string;
  password: string;
}

export async function register(data: RegisterRequest): Promise<User> {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
}

export async function login(data: RegisterRequest): Promise<User> {
  const response = await api.post<User>("/auth/login", data);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

interface UpdateMeProps {
  username?: string;
}

export async function updateMe({ username }: UpdateMeProps): Promise<User> {
  const response = await api.patch<User>("/users/me", { username });
  return response.data;
}

interface CheckSessionResponse {
  success: boolean;
}

export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>("/auth/session");
    return data || null; // null если нет сессии
  } catch {
    return null;
  }
};
