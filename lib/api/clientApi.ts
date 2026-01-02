// lib/api/clientApi.ts
import { api } from "./api";
import type { User } from "@/types/user";

// регистрация
export const register = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await api.post("/auth/register", data);
  return response.data.user ?? response.data;
};

// логин
export const login = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await api.post("/auth/login", data);
  return response.data.user ?? response.data;
};

// логаут
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

// проверка сессии
export const checkSession = async (): Promise<User | null> => {
  const response = await api.get("/auth/session");
  return response.data.user ?? response.data ?? null;
};

// получение своего профиля
export const getMe = async (): Promise<User> => {
  const response = await api.get("/users/me");
  return response.data.user ?? response.data;
};

// обновление профиля (убрали проверку id)
export const updateMe = async (
  data: Partial<{ username: string; email: string; avatar: string }>
): Promise<User> => {
  const response = await api.patch("/users/me", data);
  return response.data.user ?? response.data;
};
