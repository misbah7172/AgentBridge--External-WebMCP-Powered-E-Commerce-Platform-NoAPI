import { fail, ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { cartDto, cartInclude } from "@/lib/cart";
import { db } from "@/lib/db";
import { routeError } from "@/lib/route";
import { couponSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const input = couponSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return fail("INVALID_INPUT", "A coupon code is required", 422);
  try { const user = await requireUser(); const cart = await db.cart.findUnique({ where: { userId: user.id }, include: cartInclude }); if (!cart) return fail("CART_EMPTY", "Cart is empty", 409); const coupon = await db.coupon.findUnique({ where: { code: input.data.code.toUpperCase() } }); if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date()) || (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit)) return fail("COUPON_INVALID", "Coupon is not valid", 422); const summary = cartDto(cart); if (coupon.minimumOrder && summary.subtotal < Number(coupon.minimumOrder)) return fail("COUPON_MINIMUM_NOT_MET", "Order minimum has not been met", 422); await db.cart.update({ where: { id: cart.id }, data: { couponCode: coupon.code } }); return ok({ cart: { ...summary, couponCode: coupon.code }, coupon: { code: coupon.code, discountType: coupon.discountType, amount: Number(coupon.amount) } }); } catch (error) { return routeError(error); }
}
