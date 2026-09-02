import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products] = await Promise.all([db.category.findMany({ orderBy: { name: "asc" } }), db.product.findMany({ take: 3, orderBy: { reviewCount: "desc" }, include: { category: true } })]);
  return <main><section className="bg-ink text-white"><div className="mx-auto max-w-6xl px-5 py-20"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Electronics, thoughtfully selected</p><h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">Technology that fits the way you live.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">Explore reliable gear for work, play, and everything in between.</p><Link href="/products" className="mt-8 inline-flex rounded-md bg-white px-5 py-3 font-semibold text-ink">Browse products</Link></div></section><section className="mx-auto max-w-6xl px-5 py-14"><div className="flex items-end justify-between"><div><p className="text-sm font-semibold text-accent">SHOP BY CATEGORY</p><h2 className="mt-1 text-3xl font-semibold">Find your next essential</h2></div><Link href="/products" className="text-sm font-semibold text-accent">View all</Link></div><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{categories.map((category) => <Link key={category.id} href={`/products?category=${encodeURIComponent(category.slug)}`} className="rounded-lg border border-slate-200 bg-white p-4 text-center text-sm font-medium shadow-sm hover:border-blue-300">{category.name}</Link>)}</div></section><section className="mx-auto max-w-6xl px-5 pb-16"><h2 className="text-3xl font-semibold">Popular right now</h2><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></section></main>;
}
