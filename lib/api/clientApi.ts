// lib/api/clientApi.ts
import { api } from "./api";
import type { User } from "@/types/user";

// регистрация
export const register = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
};

// логин
export const login = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await api.post<User>("/auth/login", data);
  return response.data;
};

// логаут
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

// проверка сессии
export const checkSession = async (): Promise<User | null> => {
  const response = await api.get<User>("/auth/session");
  return response.data || null;
};

// получение своего профиля
export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

// обновление профиля
export const updateMe = async (
  data: Partial<{ username: string; email: string; avatar: string }>
): Promise<User> => {
  const response = await api.patch<User>("/users/me", data);
  return response.data;
};
