import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import RegistrationForm from "@/components/RegistrationForm";
import SubNav from "@/components/SubNav";
import Flower from "@/components/Flower";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import CursorGlow from "@/components/CursorGlow";
import ScrollUI from "@/components/ScrollUI";

export const metadata: Metadata = {
  title: "Register — Git With Her | Catalyst",
  description:
    "Team registration for Git With Her, Catalyst's flagship women-only hackathon on 23 August 2026 in Mysuru — opening soon.",
};

// Flip to "true" (env var on Vercel or here) to turn the live team form back on.
const REGISTRATION_OPEN = process.env.NEXT_PUBLIC_REGISTRATION_OPEN === "true";

export default async function RegisterPage() {
  // require an account before registering a team (only matters once registration is open)
  if (REGISTRATION_OPEN) {
    const session = await auth();
    if (!session?.user) redirect("/login?callbackUrl=/register");
  }

  return (
    <div className="reg-page">
      <SubNav />

      <header className="reg-hero band-rose">
        <Flower className="reg-flower" />
        <div className="wrap">
          <div className="eyebrow center">Git With Her · 23 Aug 2026 · Mysuru</div>
          {REGISTRATION_OPEN ? (
            <>
              <h1 className="display">Register your team.</h1>
              <p className="lead">
                Teams of 2–4 women · beginner friendly. Registration is free — we&apos;ll
                shortlist teams, and selected teams pay the ₹400 fee afterwards.
              </p>
            </>
          ) : (
            <>
              <h1 className="display">Registration opens soon.</h1>
              <p className="lead">
                Team sign-ups for Git With Her are almost here — teams of 2–4 women,
                ₹400 per team, beginner friendly.
              </p>
            </>
          )}
        </div>
      </header>

      <section className="reg-wrap">
        <div className="wrap">
          {REGISTRATION_OPEN ? (
            <RegistrationForm />
          ) : (
            <div className="reg-done">
              <div className="reg-check" aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <h2 className="h2">Registrations open soon.</h2>
              <p className="lead">
                We&apos;re putting the finishing touches on the team registration for
                Git With Her — <strong>23 August 2026, Mysuru</strong>. Leave us a note
                and we&apos;ll tell you the moment it goes live.
              </p>
              <div className="reg-done-cta">
                <a
                  href="mailto:buildwithcatalyst@gmail.com?subject=Notify%20me%20%E2%80%94%20Git%20With%20Her%20registration"
                  className="btn btn-primary"
                >
                  Notify me <span className="arw">→</span>
                </a>
                <a href="/git-with-her" className="btn btn-ghost">
                  Explore the hackathon
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <ScrollReveal />
      <CursorGlow />
      <ScrollUI />
    </div>
  );
}
