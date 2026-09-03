"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return <button type="button" onClick={signOut} disabled={pending} className="rounded-md bg-ink px-3 py-2 text-white hover:bg-slate-700 disabled:opacity-60">{pending ? "Signing out…" : "Sign out"}</button>;
}
