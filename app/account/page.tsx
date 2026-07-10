import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById } from "@/lib/users";
import AccountDashboard, { type DashUser } from "@/components/AccountDashboard";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = { title: "My Profile — Catalyst" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const db = session.user.id ? await getUserById(session.user.id) : null;
  const user: DashUser = {
    name: db?.name || session.user.name || "",
    email: db?.email || session.user.email || "",
    role: session.user.role,
    verified: db?.verified,
    phone: db?.phone,
    gender: db?.gender,
    dob: db?.dob,
    city: db?.city,
    state: db?.state,
    institution: db?.institution,
    bio: db?.bio,
    skills: db?.skills,
    avatar: db?.avatar,
  };

  return (
    <>
      <AccountDashboard user={user} />
      <CursorGlow />
    </>
  );
}
