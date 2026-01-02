"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "@/components/EditProfilePage/EditProfilePage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { updateMe, checkSession } from "@/lib/api/clientApi";
import { AxiosError } from "axios";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser, isAuthenticated, clearIsAuthenticated } =
    useAuthStore();

  const [username, setUsername] = useState(""); // пустая строка изначально
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  // Проверка сессии при монтировании
  useEffect(() => {
    const verify = async () => {
      if (!isAuthenticated) {
        try {
          const me = await checkSession();
          if (me) {
            setUser(me);
          } else {
            clearIsAuthenticated();
            router.replace("/sign-in");
            return;
          }
        } catch {
          clearIsAuthenticated();
          router.replace("/sign-in");
          return;
        }
      }
      setInitialLoading(false);
    };
    verify();
  }, [isAuthenticated, setUser, clearIsAuthenticated, router]);

  // Синхронизация username после того, как пользователь точно есть
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  if (initialLoading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push("/profile");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to update profile");
      } else {
        setError("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={
              user.avatar ||
              "https://ac.goit.global/fullstack/react/default-avatar.jpg"
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
