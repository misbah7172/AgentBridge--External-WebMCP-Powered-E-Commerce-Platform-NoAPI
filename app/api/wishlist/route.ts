import { ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { productDto } from "@/lib/serializers";
import { routeError } from "@/lib/route";

export async function GET() {
  try { const user = await requireUser(); const wishlist = await db.wishlist.findUnique({ where: { userId: user.id }, include: { items: { include: { product: { include: { category: true } } } } } }); return ok({ items: wishlist?.items.map((item: any) => ({ id: item.id, product: productDto(item.product) })) ?? [] }); } catch (error) { return routeError(error); }
}
