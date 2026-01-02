import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkServerSession } from "@/lib/api/serverApi";
import { parse } from "cookie";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Якщо нема accessToken, але є refreshToken — перевіряємо сесію
  if (!accessToken && refreshToken) {
    try {
      const res = await checkServerSession(refreshToken);
      const setCookie = res.headers["set-cookie"];
      if (setCookie) {
        const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookiesArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: Number(parsed["Max-Age"]),
          };
          if (parsed.accessToken)
            cookieStore.set("accessToken", parsed.accessToken, options);
          if (parsed.refreshToken)
            cookieStore.set("refreshToken", parsed.refreshToken, options);
        }

        if (isPublicRoute)
          return NextResponse.redirect(new URL("/", request.url), {
            headers: { Cookie: cookieStore.toString() },
          });

        if (isPrivateRoute)
          return NextResponse.next({
            headers: { Cookie: cookieStore.toString() },
          });
      }
    } catch {
      if (isPrivateRoute)
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Доступ для приватних маршрутів
  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Редірект на головну для авторизованих користувачів на публічних маршрутах
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Дозвіл для приватних маршрутів
  if (accessToken && isPrivateRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Обов'язково конфігурація matcher
export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
