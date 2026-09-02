import { fail, ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { cartDto, cartInclude } from "@/lib/cart";
import { db } from "@/lib/db";
import { routeError } from "@/lib/route";
import { quantitySchema } from "@/lib/validation";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const input = quantitySchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return fail("INVALID_INPUT", "Quantity must be between 1 and 20", 422);
  try { const user = await requireUser(); const { id } = await context.params; const item = await db.cartItem.findFirst({ where: { id, cart: { userId: user.id } }, include: { product: true, variant: true } }); if (!item) return fail("CART_ITEM_NOT_FOUND", "Cart item not found", 404); if ((item.variant?.stock ?? item.product.stock) < input.data.quantity) return fail("INSUFFICIENT_STOCK", "Requested quantity is unavailable", 409); await db.cartItem.update({ where: { id }, data: { quantity: input.data.quantity } }); return ok(cartDto(await db.cart.findUnique({ where: { userId: user.id }, include: cartInclude }))); } catch (error) { return routeError(error); }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try { const user = await requireUser(); const { id } = await context.params; const removed = await db.cartItem.deleteMany({ where: { id, cart: { userId: user.id } } }); if (!removed.count) return fail("CART_ITEM_NOT_FOUND", "Cart item not found", 404); return ok({ removed: true }); } catch (error) { return routeError(error); }
}
