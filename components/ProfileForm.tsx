"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const GENDERS = ["Woman", "Non-binary", "Prefer to self-describe", "Prefer not to say"];

type Init = {
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  age?: number;
  city?: string;
  institution?: string;
  avatar?: string;
};

export default function ProfileForm({ initial }: { initial: Init }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [phone, setPhone] = useState(initial.phone ?? "");
  const [gender, setGender] = useState(initial.gender ?? "");
  const [age, setAge] = useState(initial.age ? String(initial.age) : "");
  const [city, setCity] = useState(initial.city ?? "");
  const [institution, setInstitution] = useState(initial.institution ?? "");
  const [avatar, setAvatar] = useState(initial.avatar ?? "");

  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState("");

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        setAvatar(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("saving");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, gender, age, city, institution, avatar }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
    }
  };

  const initials = (initial.name || initial.email).slice(0, 1).toUpperCase();

  return (
    <form className="reg-form profile-form" onSubmit={save} noValidate>
      <div className="profile-head">
        <button type="button" className="avatar-edit" onClick={() => fileRef.current?.click()} aria-label="Upload profile picture">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="Your profile" />
          ) : (
            <span className="avatar-initial">{initials}</span>
          )}
          <span className="avatar-cam">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} hidden />
        <div className="profile-id">
          <div className="profile-name">{initial.name}</div>
          <div className="profile-email">{initial.email}</div>
          <button type="button" className="avatar-link" onClick={() => fileRef.current?.click()}>
            {avatar ? "Change photo" : "Upload a photo"}
          </button>
        </div>
      </div>

      <div className="reg-section">
        <h3 className="reg-legend">Your details</h3>
        <div className="reg-row">
          <label className="reg-field">
            <span>Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" autoComplete="tel" />
          </label>
          <label className="reg-field">
            <span>Age</span>
            <input type="number" min={13} max={100} value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 21" />
          </label>
        </div>
        <div className="reg-row">
          <label className="reg-field">
            <span>Gender</span>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Choose…</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="reg-field">
            <span>City / place</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mysuru" autoComplete="address-level2" />
          </label>
        </div>
        <label className="reg-field">
          <span>Institution / company</span>
          <input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="e.g. NIE Mysuru, or Acme Pvt Ltd"
            autoComplete="organization"
          />
        </label>
      </div>

      {error && <p className="reg-error">{error}</p>}

      <button className="btn btn-primary reg-submit" type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : status === "done" ? "Saved ✓" : "Save profile"}
        {status === "idle" && <span className="arw">→</span>}
      </button>
    </form>
  );
}
