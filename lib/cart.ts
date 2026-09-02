import { money } from "@/lib/serializers";

export const cartInclude = {
  items: { include: { product: { include: { category: true } }, variant: true } },
};

export function cartDto(cart: any) {
  if (!cart) return { id: null, couponCode: null, items: [], subtotal: 0, itemCount: 0 };
  const items = cart.items.map((item) => {
    const unitPrice = money(item.variant?.price ?? item.product.price) ?? 0;
    return { id: item.id, quantity: item.quantity, product: { id: item.product.id, slug: item.product.slug, name: item.product.name, image: (item.product.images as string[])[0] ?? null }, variant: item.variant ? { id: item.variant.id, sku: item.variant.sku, attributes: item.variant.attributes } : null, unitPrice, lineTotal: unitPrice * item.quantity };
  });
  return { id: cart.id, couponCode: cart.couponCode, items, subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0), itemCount: items.reduce((sum, item) => sum + item.quantity, 0) };
}
