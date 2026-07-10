import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById } from "@/lib/users";
import { emailConfigured } from "@/lib/email";
import Flower from "@/components/Flower";
import Footer from "@/components/Footer";
import LogoutButton from "@/components/LogoutButton";
import AccountProfile, { type AccountUser } from "@/components/AccountProfile";

export const metadata: Metadata = { title: "My profile — Catalyst" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const db = session.user.id ? await getUserById(session.user.id) : null;
  const user: AccountUser = {
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
    <div className="reg-page">
      <nav className="hack-nav">
        <div className="hack-inner">
          <a href="/" className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/catalyst-mark.svg" alt="" />
            Catalyst
          </a>
          <a href="/" className="hack-back">
            ← Back to Catalyst
          </a>
        </div>
      </nav>

      <header className="reg-hero band-rose">
        <Flower className="reg-flower" />
        <div className="wrap">
          <div className="eyebrow center">Your account</div>
          <h1 className="display">My profile.</h1>
          <p className="lead">
            Keep your details up to date — they help us reach you and speed up event registration.
          </p>
        </div>
      </header>

      <section className="reg-wrap">
        <div className="wrap">
          <AccountProfile user={user} emailEnabled={emailConfigured()} />

          <div className="account-actions">
            {user.role === "admin" && (
              <a href="/admin" className="btn btn-primary">
                Admin dashboard <span className="arw">→</span>
              </a>
            )}
            <a href="/register" className={`btn ${user.role === "admin" ? "btn-dark" : "btn-primary"}`}>
              Register your team <span className="arw">→</span>
            </a>
            <a href="/join" className="btn btn-dark">
              Join the community
            </a>
            <a href="/git-with-her" className="btn btn-ghost">
              Explore Git With Her
            </a>
            <LogoutButton />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
