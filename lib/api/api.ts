import axios from "axios";

// Берем URL из переменной окружения
const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

// Общий экземпляр axios для клиента и сервера
export const api = axios.create({
  baseURL,
  withCredentials: true, // важно для авторизации через куки
});
