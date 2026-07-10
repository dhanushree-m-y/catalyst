import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById } from "@/lib/users";
import Flower from "@/components/Flower";
import Footer from "@/components/Footer";
import LogoutButton from "@/components/LogoutButton";
import ProfileForm from "@/components/ProfileForm";

export const metadata: Metadata = { title: "Your account — Catalyst" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const dbUser = session.user.id ? await getUserById(session.user.id) : null;
  const name = dbUser?.name || session.user.name || "";
  const email = dbUser?.email || session.user.email || "";
  const role = session.user.role;

  const initial = {
    name,
    email,
    phone: dbUser?.phone,
    gender: dbUser?.gender,
    age: dbUser?.age,
    city: dbUser?.city,
    institution: dbUser?.institution,
    avatar: dbUser?.avatar,
  };

  const complete = !!(dbUser?.phone && dbUser?.city && dbUser?.institution);

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
          {role === "admin" && <p className="lead">You&apos;re a Catalyst admin.</p>}
        </div>
      </header>

      <section className="reg-wrap">
        <div className="wrap wrap-narrow">
          {!complete && (
            <p className="reg-info">
              Complete your profile so we can keep in touch and speed up event registration.
            </p>
          )}

          <ProfileForm initial={initial} />

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
