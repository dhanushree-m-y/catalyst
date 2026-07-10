import type { Metadata } from "next";
import AuthPanel from "@/components/AuthPanel";

export const metadata: Metadata = {
  title: "Log in — Catalyst",
  description: "Log in or create your Catalyst account.",
};

const social = {
  google: !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET,
  github: !!process.env.AUTH_GITHUB_ID && !!process.env.AUTH_GITHUB_SECRET,
  linkedin: !!process.env.AUTH_LINKEDIN_ID && !!process.env.AUTH_LINKEDIN_SECRET,
};

export default function LoginPage() {
  return (
    <main className="auth-stage">
      <AuthPanel initialMode="signin" social={social} />
    </main>
  );
}
