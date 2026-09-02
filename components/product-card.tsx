import Link from "next/link";

type ProductCardProps = { product: { slug: string; name: string; brand: string; category: { name: string }; price: unknown; rating: unknown; images: unknown } };

export function ProductCard({ product }: ProductCardProps) {
  const image = Array.isArray(product.images) && typeof product.images[0] === "string" ? product.images[0] : "/placeholder-product.svg";
  return <Link href={`/products/${product.slug}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"><div className="flex h-48 items-center justify-center rounded-lg bg-slate-100"><img src={image} alt="" className="h-36 w-36 object-contain" /></div><p className="mt-4 text-sm text-slate-500">{product.brand} · {product.category.name}</p><h3 className="mt-1 font-semibold">{product.name}</h3><p className="mt-2 font-semibold">${Number(product.price).toFixed(2)}</p><p className="mt-1 text-sm text-slate-500">★ {Number(product.rating).toFixed(1)}</p></Link>;
}
