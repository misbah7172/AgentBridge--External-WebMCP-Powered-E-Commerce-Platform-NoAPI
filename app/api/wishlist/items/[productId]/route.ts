import { fail, ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { routeError } from "@/lib/route";

export async function DELETE(_: Request, context: { params: Promise<{ productId: string }> }) {
  try { const user = await requireUser(); const { productId } = await context.params; const deleted = await db.wishlistItem.deleteMany({ where: { productId, wishlist: { userId: user.id } } }); if (!deleted.count) return fail("WISHLIST_ITEM_NOT_FOUND", "Wishlist item not found", 404); return ok({ removed: true }); } catch (error) { return routeError(error); }
}
