import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function protectPrivateRoute() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("notehub-session");
  if (!sessionCookie) {
    redirect("/sign-in");
  }
}

export async function protectPublicRoute() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("notehub-session");
  if (sessionCookie) {
    redirect("/profile");
  }
}
