import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category, q } = await searchParams;
  const products = await db.product.findMany({ where: { ...(category ? { category: { slug: category } } : {}), ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }] } : {}) }, include: { category: true }, orderBy: { createdAt: "desc" } });
  return <main className="mx-auto max-w-6xl px-5 py-12"><p className="text-sm font-semibold text-accent">CATALOG</p><h1 className="mt-1 text-4xl font-semibold">Shop all products</h1><form action="/products" data-agentbridge-form="product-search" className="mt-6 flex max-w-xl gap-2"><input name="q" defaultValue={q} data-agentbridge-field="query" placeholder="Search products" className="min-w-0 flex-1 rounded border p-2" /><button data-agentbridge-action="search-products" className="rounded bg-ink px-4 text-white">Search</button></form><p className="mt-4 text-slate-600">{products.length} products available</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></main>;
}
