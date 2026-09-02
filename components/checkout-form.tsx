"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutForm() {
  const [message, setMessage] = useState(""); const router = useRouter();
  async function submit(form: FormData) { setMessage("Processing…"); const response = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(form), paymentMethod: "mock" }) }); const body = await response.json(); if (!body.success) return setMessage(body.error?.message ?? "Checkout failed"); router.push(`/order-success/${body.data.order.id}`); }
  return <form action={submit} className="max-w-lg space-y-4 rounded-xl border bg-white p-6"><h1 className="text-2xl font-semibold">Checkout</h1><p className="text-sm text-slate-600">Demo checkout. No payment information is collected.</p><label className="block text-sm font-medium">Country<input required name="country" defaultValue="United States" className="mt-1 w-full rounded border p-2" /></label><label className="block text-sm font-medium">Postal code<input required name="postalCode" className="mt-1 w-full rounded border p-2" /></label><button className="w-full rounded bg-ink py-3 font-semibold text-white">Place mock order</button>{message && <p className="text-sm text-slate-600">{message}</p>}</form>;
}
