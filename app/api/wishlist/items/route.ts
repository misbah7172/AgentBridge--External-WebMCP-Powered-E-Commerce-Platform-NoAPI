import { fail, ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { routeError } from "@/lib/route";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null); const productId = typeof body?.productId === "string" ? body.productId : "";
  if (!productId) return fail("INVALID_INPUT", "productId is required", 422);
  try { const user = await requireUser(); const product = await db.product.findUnique({ where: { id: productId } }); if (!product) return fail("PRODUCT_NOT_FOUND", "Product not found", 404); const wishlist = await db.wishlist.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } }); await db.wishlistItem.upsert({ where: { wishlistId_productId: { wishlistId: wishlist.id, productId } }, update: {}, create: { wishlistId: wishlist.id, productId } }); return ok({ added: true }, 201); } catch (error) { return routeError(error); }
}
