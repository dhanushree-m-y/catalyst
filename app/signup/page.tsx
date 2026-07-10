import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";
import Flower from "@/components/Flower";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "Create an account — Catalyst",
  description: "Create a Catalyst account to join the community and register for events.",
};

export default function SignupPage() {
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
          <div className="eyebrow center">Join Catalyst</div>
          <h1 className="display">Create your account.</h1>
        </div>
      </header>

      <section className="reg-wrap">
        <div className="wrap wrap-narrow">
          <SignupForm googleEnabled={!!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET} />
        </div>
      </section>

      <Footer />
      <CursorGlow />
    </div>
  );
}
