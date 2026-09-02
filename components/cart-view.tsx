"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Cart = { items: { id: string; quantity: number; product: { name: string; slug: string }; lineTotal: number }[]; subtotal: number };

export function CartView() {
  const [cart, setCart] = useState<Cart | null>(null); const [error, setError] = useState("");
  async function load() { const response = await fetch("/api/cart"); const body = await response.json(); if (!body.success) return setError(body.error?.message ?? "Unable to load cart"); setCart(body.data); }
  useEffect(() => { void load(); }, []);
  async function remove(id: string) { await fetch(`/api/cart/items/${id}`, { method: "DELETE" }); await load(); }
  if (error) return <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">{error} <Link href="/login" className="font-semibold underline">Sign in</Link></div>;
  if (!cart) return <p>Loading cart…</p>;
  if (!cart.items.length) return <div className="rounded-lg border bg-white p-8"><h1 className="text-2xl font-semibold">Your cart is empty</h1><Link href="/products" className="mt-4 inline-block font-semibold text-accent">Browse products</Link></div>;
  return <div className="grid gap-8 md:grid-cols-[1fr_18rem]"><div className="space-y-3">{cart.items.map((item) => <div key={item.id} className="flex items-center justify-between rounded-lg border bg-white p-4"><div><Link className="font-semibold" href={`/products/${item.product.slug}`}>{item.product.name}</Link><p className="text-sm text-slate-500">Quantity: {item.quantity}</p></div><div className="text-right"><p className="font-semibold">${item.lineTotal.toFixed(2)}</p><button onClick={() => remove(item.id)} className="mt-2 text-sm text-red-600">Remove</button></div></div>)}</div><aside className="h-fit rounded-lg border bg-white p-5"><h2 className="text-lg font-semibold">Order summary</h2><div className="mt-4 flex justify-between"><span>Subtotal</span><strong>${cart.subtotal.toFixed(2)}</strong></div><Link href="/checkout" className="mt-5 block rounded bg-ink py-3 text-center font-semibold text-white">Checkout</Link></aside></div>;
}
