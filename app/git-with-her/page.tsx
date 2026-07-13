import type { Metadata } from "next";
import AccountChip from "@/components/AccountChip";
import HackDetails from "@/components/HackDetails";
import HackProblems from "@/components/HackProblems";
import HackWho from "@/components/HackWho";
import HackPrizes from "@/components/HackPrizes";
import Roadmap from "@/components/Roadmap";
import Speakers from "@/components/Speakers";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Git With Her — Catalyst Hackathon",
  description:
    "Git With Her is Catalyst's flagship women-only hackathon: an eight-hour build day for women across every field, with mentors, workshops and a ₹30,000 prize pool.",
  startDate: "2026-08-23T09:00:00+05:30",
  endDate: "2026-08-23T17:00:00+05:30",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "ImagineEdge Workspace, Mysuru",
    address: { "@type": "PostalAddress", addressLocality: "Mysuru", addressRegion: "Karnataka", addressCountry: "India" },
  },
  organizer: {
    "@type": "Organization",
    name: "Catalyst",
    email: "buildwithcatalyst@gmail.com",
    telephone: "+91-7899731279",
  },
  about: ["Carbon Footprint & Climate Tech", "Rural Empowerment", "Open Innovation"],
};
import ScrollReveal from "@/components/ScrollReveal";
import CursorGlow from "@/components/CursorGlow";
import ScrollUI from "@/components/ScrollUI";

export const metadata: Metadata = {
  title: "Git With Her — Catalyst's flagship hackathon",
  description:
    "Git With Her is Catalyst's flagship all-women hackathon — an eight-hour build day for women across every field. Beginner friendly, mentors on hand, prizes to win.",
};

export default function GitWithHerPage() {
  return (
    <div className="hack-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <nav className="hack-nav">
        <div className="hack-inner">
          <a href="/" className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/catalyst-mark.svg" alt="" />
            Catalyst
          </a>
          <div className="hack-nav-actions">
            <a href="/#about" className="hack-back">
              ← Back to community
            </a>
            <a href="/register" className="btn btn-primary">
              Register
            </a>
            <AccountChip />
          </div>
        </div>
      </nav>

      <header className="hack-hero">
        <div className="wrap hack-hero-inner">
          <div className="hack-hero-left">
            <div className="eyebrow">Catalyst&apos;s flagship hackathon</div>
            <h1 className="hack-title">
              Git With Her <span className="hack-year">2026</span>
            </h1>
            <p className="lead">
              An eight-hour, women-only build day for women across every field —
              software, hardware, design and beyond.
            </p>
            <div className="hero-actions">
              <a href="/register" className="btn btn-primary">
                Register <span className="arw">→</span>
              </a>
              <a href="#details" className="btn btn-ghost">
                Event details
              </a>
            </div>
          </div>
          <div className="hack-hero-right">
            <div className="org-block">
              <span className="org-label">Organised by</span>
              <span className="org-name">Catalyst</span>
            </div>
            <div className="org-block">
              <span className="org-label">Powered by</span>
              <span className="org-name">Webstor Labs</span>
            </div>
          </div>
        </div>
      </header>

      <HackDetails />
      <HackProblems />
      <HackWho />
      <HackPrizes />
      <Roadmap />
      <Speakers />
      <Faq />

      <section className="hack-cta" id="register">
        <div className="wrap">
          <div className="head-block center reveal">
            <div className="eyebrow center">Your seat is waiting</div>
            <h2 className="h2">Ready to build your next idea?</h2>
            <p className="lead">
              Bring a laptop and an open mind —
              we&apos;ll take care of the space, the mentors and the good energy.
            </p>
            <a
              href="/register"
              className="btn btn-primary"
            >
              Register now <span className="arw">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollReveal />
      <CursorGlow />
      <ScrollUI />
    </div>
  );
}
