import type { Metadata } from "next";
import JoinForm from "@/components/JoinForm";
import Flower from "@/components/Flower";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import CursorGlow from "@/components/CursorGlow";
import ScrollUI from "@/components/ScrollUI";

export const metadata: Metadata = {
  title: "Join Catalyst — the community",
  description:
    "Join Catalyst — a free community for women across every field. Get first access to events, mentorship, hackathons and a network that keeps showing up.",
};

export default function JoinPage() {
  return (
    <div className="reg-page">
      <nav className="hack-nav">
        <div className="hack-inner">
          <a href="/" className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/catalyst-mark.svg" alt="" />
            Catalyst
          </a>
          <a href="/#community" className="hack-back">
            ← Back to Catalyst
          </a>
        </div>
      </nav>

      <header className="reg-hero band-rose">
        <Flower className="reg-flower" />
        <div className="wrap">
          <div className="eyebrow center">Free to join · Women across every field</div>
          <h1 className="display">Join Catalyst.</h1>
          <p className="lead">
            Find your people, sharpen your craft and grow together. Membership is free —
            you&apos;ll get first access to every event, mentor and opportunity.
          </p>
        </div>
      </header>

      <section className="reg-wrap">
        <div className="wrap">
          <JoinForm />
        </div>
      </section>

      <Footer />
      <ScrollReveal />
      <CursorGlow />
      <ScrollUI />
    </div>
  );
}
