import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function OrdersPage() { const user = await currentUser(); if (!user) return <main className="mx-auto max-w-4xl px-5 py-16">Please <Link className="text-accent" href="/login">sign in</Link> to see orders.</main>; const orders = await db.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }); return <main className="mx-auto max-w-4xl px-5 py-12"><h1 className="text-3xl font-semibold">Order history</h1><div className="mt-6 space-y-3">{orders.length ? orders.map((order) => <Link key={order.id} href={`/order-success/${order.id}`} className="flex justify-between rounded-lg border bg-white p-4"><span className="font-mono text-sm">{order.id}</span><span>{order.status} · ${Number(order.total).toFixed(2)}</span></Link>) : <p className="text-slate-600">You have not placed an order yet.</p>}</div></main>; }
