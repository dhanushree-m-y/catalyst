import type { Metadata } from "next";
import HostForm from "@/components/HostForm";
import SubNav from "@/components/SubNav";
import Flower from "@/components/Flower";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import CursorGlow from "@/components/CursorGlow";
import ScrollUI from "@/components/ScrollUI";

export const metadata: Metadata = {
  title: "Propose an event — Catalyst",
  description:
    "Have an idea for a workshop, panel, study jam or meetup? Propose it and Catalyst will help you find the space, the people and the support to make it happen.",
};

export default function HostPage() {
  return (
    <div className="reg-page">
      <SubNav />

      <header className="reg-hero band-rose">
        <Flower className="reg-flower" />
        <div className="wrap">
          <div className="eyebrow center">For the community · Catalyst</div>
          <h1 className="display">Propose an event.</h1>
          <p className="lead">
            Workshops, panels, study jams, meetups — if there&apos;s something you want to run,
            we&apos;ll help you find the space, the people and the support to make it happen.
          </p>
        </div>
      </header>

      <section className="reg-wrap">
        <div className="wrap">
          <HostForm />
        </div>
      </section>

      <Footer />
      <ScrollReveal />
      <CursorGlow />
      <ScrollUI />
    </div>
  );
}
