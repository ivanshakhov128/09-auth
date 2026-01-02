"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession } from "@/lib/api/clientApi";
import { useRouter, usePathname } from "next/navigation";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();

          // если пытаемся попасть на приватный маршрут
          if (
            pathname.startsWith("/profile") ||
            pathname.startsWith("/notes")
          ) {
            router.replace("/sign-in"); // replace вместо push предотвращает "назад" на приватную страницу
          }
        }
      } catch {
        clearIsAuthenticated();
        if (pathname.startsWith("/profile") || pathname.startsWith("/notes")) {
          router.replace("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    // проверка только если не авторизован
    if (!isAuthenticated) {
      verifySession();
    } else {
      setLoading(false);
    }
  }, [pathname, isAuthenticated, setUser, clearIsAuthenticated, router]);

  if (loading) return <p>Loading...</p>; // можно заменить на компонент спиннера

  return <>{children}</>;
}
