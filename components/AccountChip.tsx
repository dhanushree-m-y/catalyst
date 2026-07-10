"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AccountChip() {
  const { data: session, status } = useSession();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    let alive = true;
    if (session?.user) {
      fetch("/api/me")
        .then((r) => r.json())
        .then((d) => {
          if (!alive || !d.user) return;
          setAvatar(d.user.avatar ?? null);
          setName(d.user.name ?? "");
        })
        .catch(() => {});
    }
    return () => {
      alive = false;
    };
  }, [session]);

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <a href="/login" className="nav-auth">
        Log in
      </a>
    );
  }

  const initial = (name || session.user.name || session.user.email || "?").slice(0, 1).toUpperCase();

  return (
    <a href="/account" className="nav-chip" aria-label="Your account" title="Your account">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" className="nav-chip-img" />
      ) : (
        <span className="nav-chip-init">{initial}</span>
      )}
    </a>
  );
}
