import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import Flower from "@/components/Flower";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "Log in — Catalyst",
  description: "Log in to your Catalyst account.",
};

export default function LoginPage() {
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
          <div className="eyebrow center">Welcome back</div>
          <h1 className="display">Log in.</h1>
        </div>
      </header>

      <section className="reg-wrap">
        <div className="wrap wrap-narrow">
          <LoginForm googleEnabled={!!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET} />
        </div>
      </section>

      <Footer />
      <CursorGlow />
    </div>
  );
}
