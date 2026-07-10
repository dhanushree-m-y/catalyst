"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({ className = "btn btn-dark" }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => signOut({ callbackUrl: "/" })}>
      Log out
    </button>
  );
}
