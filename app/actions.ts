"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearSession, createSession, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function loginAction(form: FormData) {
  const email = text(form, "email").toLowerCase(); const password = text(form, "password"); const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) redirect("/login?error=invalid_credentials");
  await createSession(user.id); redirect("/account");
}
export async function registerAction(form: FormData) {
  const email = text(form, "email").toLowerCase(); const password = text(form, "password"); const firstName = text(form, "firstName"); const lastName = text(form, "lastName");
  if (!email || password.length < 8 || !firstName || !lastName) redirect("/register?error=invalid_input");
  if (await db.user.findUnique({ where: { email } })) redirect("/register?error=email_taken");
  const user = await db.user.create({ data: { email, firstName, lastName, passwordHash: await hashPassword(password) } }); await createSession(user.id); redirect("/account");
}
export async function signOutAction() {
  try {
    await clearSession();
  } catch (e: unknown) {
    // Next.js redirect()/notFound() throws a special error with a `digest` property – re-throw it.
    if (e && typeof e === "object" && "digest" in e) throw e;
    // If session cleanup fails (e.g. DB error), still redirect to home.
  }
  redirect("/");
}
export async function addToCartAction(form: FormData) {
  const user = await requireUser(); const productId = text(form, "productId"); const variantId = text(form, "variantId") || null; const quantity = Math.max(1, Math.min(20, Number(form.get("quantity") ?? 1))); const product = await db.product.findUnique({ where: { id: productId } }); if (!product) redirect("/products"); const variant = variantId ? await db.productVariant.findFirst({ where: { id: variantId, productId } }) : null;
  if ((variant?.stock ?? product.stock) < quantity) redirect(`/products/${product.slug}?error=out_of_stock`);
  const cart = await db.cart.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } }); const item = await db.cartItem.findFirst({ where: { cartId: cart.id, productId, variantId } });
  if (item) await db.cartItem.update({ where: { id: item.id }, data: { quantity: { increment: quantity } } }); else await db.cartItem.create({ data: { cartId: cart.id, productId, variantId: variantId ?? undefined, quantity } }); revalidatePath("/cart"); redirect("/cart");
}
export async function removeCartItemAction(form: FormData) { const user = await requireUser(); await db.cartItem.deleteMany({ where: { id: text(form, "itemId"), cart: { userId: user.id } } }); revalidatePath("/cart"); }
export async function clearCartAction() { const user = await requireUser(); const cart = await db.cart.findUnique({ where: { userId: user.id } }); if (cart) await db.cartItem.deleteMany({ where: { cartId: cart.id } }); revalidatePath("/cart"); }
export async function addWishlistAction(form: FormData) { const user = await requireUser(); const productId = text(form, "productId"); const wishlist = await db.wishlist.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } }); if (!(await db.wishlistItem.findFirst({ where: { wishlistId: wishlist.id, productId } }))) await db.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } }); revalidatePath("/wishlist"); redirect("/wishlist"); }
export async function removeWishlistAction(form: FormData) { const user = await requireUser(); await db.wishlistItem.deleteMany({ where: { productId: text(form, "productId"), wishlist: { userId: user.id } } }); revalidatePath("/wishlist"); }
export async function applyCouponAction(form: FormData) { const user = await requireUser(); const cart = await db.cart.findUnique({ where: { userId: user.id } }); const coupon = await db.coupon.findUnique({ where: { code: text(form, "code").toUpperCase() } }); if (cart && coupon?.active) await db.cart.update({ where: { id: cart.id }, data: { couponCode: coupon.code } }); revalidatePath("/cart"); }
export async function checkoutAction() { const user = await requireUser(); const cart = await db.cart.findUnique({ where: { userId: user.id }, include: { items: { include: { product: true, variant: true } } } }); if (!cart?.items.length) redirect("/cart"); const subtotal = cart.items.reduce((sum, item) => sum + Number(item.variant?.price ?? item.product.price) * item.quantity, 0); const shipping = subtotal >= 500 ? 0 : 9.99; const order = await db.$transaction(async (tx: any) => { for (const item of cart.items) if ((item.variant?.stock ?? item.product.stock) < item.quantity) throw new Error("OUT_OF_STOCK"); const created = await tx.order.create({ data: { userId: user.id, status: "PAID", subtotal, discount: 0, shipping, total: subtotal + shipping, items: { create: cart.items.map((item: any) => ({ name: item.product.name, sku: item.variant?.sku, unitPrice: item.variant?.price ?? item.product.price, quantity: item.quantity, productId: item.productId, variantId: item.variantId })) } } }); for (const item of cart.items) { if (item.variantId) await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } }); else await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } }); } await tx.cartItem.deleteMany({ where: { cartId: cart.id } }); return created; }); revalidatePath("/cart"); redirect(`/order-success/${order.id}`); }
