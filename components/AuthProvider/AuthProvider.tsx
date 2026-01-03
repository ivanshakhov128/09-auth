"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useRouter, usePathname } from "next/navigation";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        // 1️⃣ Перевірка сесії
        const sessionValid = await checkSession();

        if (!sessionValid) {
          // Якщо сесія невалідна — очистити стан і редірект
          clearIsAuthenticated();
          if (
            pathname.startsWith("/profile") ||
            pathname.startsWith("/notes")
          ) {
            router.replace("/sign-in");
          }
        } else {
          // 2️⃣ Якщо сесія валідна — отримати дані користувача
          try {
            const user = await getMe();
            if (user) {
              setUser(user); // записуємо користувача у глобальний стан
            } else {
              clearIsAuthenticated();
              if (
                pathname.startsWith("/profile") ||
                pathname.startsWith("/notes")
              ) {
                router.replace("/sign-in");
              }
            }
          } catch {
            // Якщо не вдалось отримати користувача
            clearIsAuthenticated();
            if (
              pathname.startsWith("/profile") ||
              pathname.startsWith("/notes")
            ) {
              router.replace("/sign-in");
            }
          }
        }
      } catch {
        // Будь-яка інша помилка — очистити стан
        clearIsAuthenticated();
        if (pathname.startsWith("/profile") || pathname.startsWith("/notes")) {
          router.replace("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
