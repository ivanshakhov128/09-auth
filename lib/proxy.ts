import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Проверка приватного маршрута
 */
export async function protectPrivateRoute() {
  const cookieStore = await cookies(); // ✅ добавляем await
  const sessionCookie = cookieStore.get("notehub-session");
  if (!sessionCookie) {
    redirect("/sign-in");
  }
}

/**
 * Проверка публичного маршрута (sign-in / sign-up)
 */
export async function protectPublicRoute() {
  const cookieStore = await cookies(); // ✅ добавляем await
  const sessionCookie = cookieStore.get("notehub-session");
  if (sessionCookie) {
    redirect("/profile");
  }
}
