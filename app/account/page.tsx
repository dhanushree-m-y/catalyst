import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Flower from "@/components/Flower";
import Footer from "@/components/Footer";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Your account — Catalyst",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");
  const { name, email, role } = session.user;

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

      <header className="reg-hero band-rose auth-hero">
        <Flower className="reg-flower" />
        <div className="wrap">
          <div className="eyebrow center">Your account</div>
          <h1 className="display">Hi{name ? `, ${name.split(" ")[0]}` : ""}.</h1>
        </div>
      </header>

      <section className="reg-wrap">
        <div className="wrap wrap-narrow">
          <div className="account-card">
            <div className="account-row">
              <span>Name</span>
              <strong>{name || "—"}</strong>
            </div>
            <div className="account-row">
              <span>Email</span>
              <strong>{email}</strong>
            </div>
            {role === "admin" && (
              <div className="account-row">
                <span>Role</span>
                <strong className="account-badge">Admin</strong>
              </div>
            )}
          </div>

          <div className="account-actions">
            {role === "admin" && (
              <a href="/admin" className="btn btn-primary">
                Open admin dashboard <span className="arw">→</span>
              </a>
            )}
            <a href="/register" className={`btn ${role === "admin" ? "btn-dark" : "btn-primary"}`}>
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
