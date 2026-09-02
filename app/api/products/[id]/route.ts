import { fail, ok } from "@/lib/api-response";
import { db } from "@/lib/db";
import { productDto } from "@/lib/serializers";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const product = await db.product.findFirst({ where: { OR: [{ id }, { slug: id }] }, include: { category: true, variants: true } });
  if (!product) return fail("PRODUCT_NOT_FOUND", "Product not found", 404);
  return ok(productDto(product));
}
