import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductActions } from "@/components/product-actions";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = await db.product.findUnique({ where: { slug }, include: { category: true, variants: true } }); if (!product) notFound();
  const image = Array.isArray(product.images) && typeof product.images[0] === "string" ? product.images[0] : "/placeholder-product.svg";
  return <main className="mx-auto grid max-w-5xl gap-10 px-5 py-12 md:grid-cols-2"><div className="flex min-h-80 items-center justify-center rounded-2xl bg-slate-100"><img src={image} alt={product.name} className="h-64 w-64 object-contain" /></div><div><p className="text-sm font-medium text-slate-500">{product.brand} · {product.category.name}</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{product.name}</h1><p className="mt-4 text-lg leading-8 text-slate-600">{product.description}</p><p className="mt-6 text-2xl font-semibold">${Number(product.price).toFixed(2)}</p><p className="mt-3 text-sm text-slate-500">★ {Number(product.rating).toFixed(1)} ({product.reviewCount} reviews) · {product.stock} in stock</p><ProductActions productId={product.id} variantId={product.variants[0]?.id} /></div></main>;
}
