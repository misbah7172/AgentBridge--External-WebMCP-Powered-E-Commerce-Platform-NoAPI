"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter(); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function submit(form: FormData) { setPending(true); setError(""); const payload = Object.fromEntries(form); const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }); const body = await response.json(); setPending(false); if (!body.success) return setError(body.error?.message ?? "Unable to continue"); router.push("/account"); router.refresh(); }
  return <form action={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h1 className="text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>{mode === "register" && <div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium">First name<input required name="firstName" className="mt-1 w-full rounded border p-2" /></label><label className="text-sm font-medium">Last name<input required name="lastName" className="mt-1 w-full rounded border p-2" /></label></div>}<label className="block text-sm font-medium">Email<input required type="email" name="email" className="mt-1 w-full rounded border p-2" /></label><label className="block text-sm font-medium">Password<input required minLength={mode === "register" ? 8 : 1} type="password" name="password" className="mt-1 w-full rounded border p-2" /></label>{error && <p className="text-sm text-red-600">{error}</p>}<button disabled={pending} className="w-full rounded bg-ink py-3 font-semibold text-white disabled:opacity-60">{pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button></form>;
}
