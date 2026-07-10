"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { id: string; type?: "submission" | "user"; label?: string };

export default function AdminDeleteButton({ id, type = "submission", label }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onDelete = async () => {
    if (!window.confirm(`Delete ${label ?? "this entry"}? This can't be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      window.alert("Couldn't delete that just now — please try again.");
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className="admin-del"
      onClick={onDelete}
      disabled={busy}
      aria-label="Delete"
      title="Delete"
    >
      {busy ? (
        <span className="admin-del-spin" aria-hidden />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      )}
    </button>
  );
}
