import type { Metadata } from "next";
import SponsorForm from "@/components/SponsorForm";
import SubNav from "@/components/SubNav";
import Flower from "@/components/Flower";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import CursorGlow from "@/components/CursorGlow";
import ScrollUI from "@/components/ScrollUI";

export const metadata: Metadata = {
  title: "Sponsor — Git With Her | Catalyst",
  description:
    "Sponsor Git With Her, Catalyst's flagship women-only hackathon, and back the next generation of women who build.",
};

export default function SponsorPage() {
  return (
    <div className="reg-page">
      <SubNav />

      <header className="reg-hero band-rose">
        <Flower className="reg-flower" />
        <div className="wrap">
          <div className="eyebrow center">Partner with Catalyst</div>
          <h1 className="display">Sponsor Git With Her.</h1>
          <p className="lead">
            Power a room full of women building the future — from prize pools and
            meals to venue and swag. Tell us how you&apos;d like to help.
          </p>
        </div>
      </header>

      <section className="reg-wrap">
        <div className="wrap">
          <SponsorForm />
        </div>
      </section>

      <Footer />
      <ScrollReveal />
      <CursorGlow />
      <ScrollUI />
    </div>
  );
}
