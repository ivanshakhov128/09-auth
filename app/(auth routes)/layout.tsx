"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    // При монтуванні оновлюємо сторінку, щоб клієнтський стан аутентифікації був актуальним
    router.refresh();
  }, [router]);

  return <section>{children}</section>;
}
