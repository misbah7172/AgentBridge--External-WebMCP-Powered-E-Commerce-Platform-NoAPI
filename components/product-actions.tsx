"use client";

import { useState } from "react";

export function ProductActions({ productId, variantId }: { productId: string; variantId?: string }) {
  const [message, setMessage] = useState("");
  async function addToCart() {
    setMessage("Adding…"); const response = await fetch("/api/cart/items", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId, variantId, quantity: 1 }) }); const body = await response.json();
    setMessage(body.success ? "Added to cart." : body.error?.message ?? "Unable to add item.");
  }
  async function addToWishlist() { const response = await fetch("/api/wishlist/items", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId }) }); const body = await response.json(); setMessage(body.success ? "Saved to wishlist." : body.error?.message ?? "Unable to save item."); }
  return <div className="mt-8"><div className="flex gap-3"><button onClick={addToCart} className="rounded-md bg-ink px-5 py-3 font-semibold text-white">Add to cart</button><button onClick={addToWishlist} className="rounded-md border border-slate-300 px-5 py-3 font-semibold">Save</button></div>{message && <p className="mt-3 text-sm text-slate-600">{message}</p>}</div>;
}
