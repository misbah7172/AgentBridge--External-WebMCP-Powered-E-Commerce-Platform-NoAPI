import { fail, ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { cartDto, cartInclude } from "@/lib/cart";
import { db } from "@/lib/db";
import { couponDiscount, shippingEstimate } from "@/lib/pricing";
import { routeError } from "@/lib/route";
import { checkoutSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const input = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return fail("INVALID_INPUT", input.error.issues[0]?.message ?? "Invalid checkout data", 422);
  try {
    const user = await requireUser();
    const order = await db.$transaction(async (tx: any) => {
      const cart = await tx.cart.findUnique({ where: { userId: user.id }, include: cartInclude });
      if (!cart || !cart.items.length) throw new Error("CART_EMPTY");
      const summary = cartDto(cart);
      for (const item of cart.items) if ((item.variant?.stock ?? item.product.stock) < item.quantity) throw new Error("INSUFFICIENT_STOCK");
      const coupon = cart.couponCode ? await tx.coupon.findUnique({ where: { code: cart.couponCode } }) : null;
      const discount = coupon && coupon.active && (!coupon.expiresAt || coupon.expiresAt > new Date()) && (!coupon.minimumOrder || summary.subtotal >= Number(coupon.minimumOrder)) ? couponDiscount(coupon.discountType, Number(coupon.amount), summary.subtotal) : 0;
      const shipping = shippingEstimate(input.data.country, input.data.postalCode, summary.subtotal - discount).shippingCost;
      if (input.data.addressId) { const address = await tx.address.findFirst({ where: { id: input.data.addressId, userId: user.id } }); if (!address) throw new Error("ADDRESS_NOT_FOUND"); }
      const created = await tx.order.create({ data: { userId: user.id, addressId: input.data.addressId, status: "PAID", subtotal: summary.subtotal, discount, shipping, total: summary.subtotal - discount + shipping, couponCode: coupon?.code, items: { create: cart.items.map((item: any) => ({ name: item.product.name, sku: item.variant?.sku, unitPrice: item.variant?.price ?? item.product.price, quantity: item.quantity, productId: item.productId, variantId: item.variantId })) } } });
      for (const item of cart.items) { if (item.variantId) await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } }); else await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } }); }
      if (coupon) await tx.coupon.update({ where: { id: coupon.id }, data: { usageCount: { increment: 1 } } });
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } }); await tx.cart.update({ where: { id: cart.id }, data: { couponCode: null } }); return created;
    });
    return ok({ order: { id: order.id, status: order.status, total: Number(order.total) } }, 201);
  } catch (error) { if (error instanceof Error && ["CART_EMPTY", "INSUFFICIENT_STOCK", "ADDRESS_NOT_FOUND"].includes(error.message)) return fail(error.message, error.message.replaceAll("_", " "), 409); return routeError(error); }
}
