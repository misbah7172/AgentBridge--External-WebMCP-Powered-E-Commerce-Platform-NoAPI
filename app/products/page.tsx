import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const products = await db.product.findMany({ where: category ? { category: { slug: category } } : {}, include: { category: true }, orderBy: { createdAt: "desc" } });
  return <main className="mx-auto max-w-6xl px-5 py-12"><p className="text-sm font-semibold text-accent">CATALOG</p><h1 className="mt-1 text-4xl font-semibold">Shop all products</h1><p className="mt-2 text-slate-600">{products.length} products available</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></main>;
}
