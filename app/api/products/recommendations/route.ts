import { ok } from "@/lib/api-response";
import { db } from "@/lib/db";
import { productDto } from "@/lib/serializers";

export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get("category");
  const products = await db.product.findMany({ where: category ? { category: { slug: category } } : {}, orderBy: [{ rating: "desc" }, { reviewCount: "desc" }], take: 8, include: { category: true } });
  return ok({ products: products.map(productDto) });
}
