import { fail, ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { cartDto, cartInclude } from "@/lib/cart";
import { db } from "@/lib/db";
import { routeError } from "@/lib/route";
import { cartItemSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const input = cartItemSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return fail("INVALID_INPUT", input.error.issues[0]?.message ?? "Invalid cart item", 422);
  try {
    const user = await requireUser();
    const product = await db.product.findUnique({ where: { id: input.data.productId } });
    if (!product) return fail("PRODUCT_NOT_FOUND", "Product not found", 404);
    const variant = input.data.variantId ? await db.productVariant.findFirst({ where: { id: input.data.variantId, productId: product.id } }) : null;
    if (input.data.variantId && !variant) return fail("VARIANT_NOT_FOUND", "Product variant not found", 404);
    if ((variant?.stock ?? product.stock) < input.data.quantity) return fail("INSUFFICIENT_STOCK", "Requested quantity is unavailable", 409);
    const cart = await db.cart.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
    const existing = await db.cartItem.findFirst({ where: { cartId: cart.id, productId: product.id, variantId: variant?.id ?? null } });
    if (existing) await db.cartItem.update({ where: { id: existing.id }, data: { quantity: { increment: input.data.quantity } } });
    else await db.cartItem.create({ data: { cartId: cart.id, productId: product.id, variantId: variant?.id, quantity: input.data.quantity } });
    return ok(cartDto(await db.cart.findUnique({ where: { id: cart.id }, include: cartInclude })), 201);
  } catch (error) { return routeError(error); }
}
