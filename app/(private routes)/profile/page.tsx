import Image from "next/image";
import css from "@/components/Profile/Profile.module.css";
import { Metadata } from "next";
import { getMe } from "@/lib/api/serverApi";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "User profile page in NoteHub app",
};

export default async function Profile() {
  const cookieStore = await cookies();

  // ❗️ проверяем accessToken
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    redirect("/sign-in");
  }

  // 🔥 передаём ВСЕ cookies
  const cookieHeader = cookieStore.toString();

  let user;
  try {
    user = await getMe(cookieHeader);
  } catch {
    redirect("/sign-in");
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
