import { ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { cartDto, cartInclude } from "@/lib/cart";
import { db } from "@/lib/db";
import { routeError } from "@/lib/route";

export async function GET() {
  try { const user = await requireUser(); return ok(cartDto(await db.cart.findUnique({ where: { userId: user.id }, include: cartInclude }))); } catch (error) { return routeError(error); }
}

export async function DELETE() {
  try { const user = await requireUser(); const cart = await db.cart.findUnique({ where: { userId: user.id } }); if (cart) await db.cartItem.deleteMany({ where: { cartId: cart.id } }); return ok({ cleared: true }); } catch (error) { return routeError(error); }
}
