import { fail, ok } from "@/lib/api-response";
import { db } from "@/lib/db";
import { productDto } from "@/lib/serializers";
import { productSearchSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const parsed = productSearchSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return fail("INVALID_QUERY", parsed.error.issues[0]?.message ?? "Invalid query", 422);
  const { q, category, minPrice, maxPrice, brand, minRating, page, limit, sort } = parsed.data;
  const where: any = {
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }] } : {}),
    ...(category ? { category: { slug: category.toLowerCase().replaceAll(" ", "-") } } : {}),
    ...(brand ? { brand: { equals: brand, mode: "insensitive" } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined ? { price: { ...(minPrice !== undefined ? { gte: minPrice } : {}), ...(maxPrice !== undefined ? { lte: maxPrice } : {}) } } : {}),
    ...(minRating !== undefined ? { rating: { gte: minRating } } : {}),
  };
  const orderBy: any = sort === "price_asc" ? { price: "asc" } : sort === "price_desc" ? { price: "desc" } : sort === "rating" ? { rating: "desc" } : sort === "newest" ? { createdAt: "desc" } : sort === "popularity" ? { reviewCount: "desc" } : { createdAt: "desc" };
  const [products, total] = await Promise.all([db.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit, include: { category: true } }), db.product.count({ where })]);
  return ok({ products: products.map(productDto), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}
