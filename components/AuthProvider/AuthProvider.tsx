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
        // Перевірка сесії
        const sessionValid = await checkSession();

        if (!sessionValid) {
          clearIsAuthenticated();
          if (
            pathname.startsWith("/profile") ||
            pathname.startsWith("/notes")
          ) {
            router.replace("/sign-in");
          }
        } else {
          try {
            const user = await getMe();
            if (user) {
              setUser(user);
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
