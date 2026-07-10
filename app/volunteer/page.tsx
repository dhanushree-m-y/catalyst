import type { Metadata } from "next";
import VolunteerForm from "@/components/VolunteerForm";
import SubNav from "@/components/SubNav";
import Flower from "@/components/Flower";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import CursorGlow from "@/components/CursorGlow";
import ScrollUI from "@/components/ScrollUI";

export const metadata: Metadata = {
  title: "Volunteer — Git With Her | Catalyst",
  description:
    "Volunteer with Catalyst for Git With Her — host, photography, event management, mentoring and more.",
};

export default function VolunteerPage() {
  return (
    <div className="reg-page">
      <SubNav />

      <header className="reg-hero band-rose">
        <Flower className="reg-flower" />
        <div className="wrap">
          <div className="eyebrow center">Join the crew · Git With Her</div>
          <h1 className="display">Volunteer with us.</h1>
          <p className="lead">
            A few hours from you helps make the day happen. Pick your roles and
            we&apos;ll take it from there.
          </p>
        </div>
      </header>

      <section className="reg-wrap">
        <div className="wrap">
          <VolunteerForm />
        </div>
      </section>

      <Footer />
      <ScrollReveal />
      <CursorGlow />
      <ScrollUI />
    </div>
  );
}
