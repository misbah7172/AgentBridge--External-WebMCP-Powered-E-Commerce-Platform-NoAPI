import { addToCartAction, addWishlistAction } from "@/app/actions";

export function ProductActions({ productId, variantId }: { productId: string; variantId?: string | null }) {
  return <div className="mt-8 flex gap-3" data-agentbridge-product-id={productId}><form action={addToCartAction} data-agentbridge-form="add-to-cart"><input type="hidden" name="productId" value={productId} /><input type="hidden" name="variantId" value={variantId ?? ""} /><input type="hidden" name="quantity" value="1" /><button data-agentbridge-action="add-to-cart" className="rounded-md bg-ink px-5 py-3 font-semibold text-white">Add to cart</button></form><form action={addWishlistAction} data-agentbridge-form="add-to-wishlist"><input type="hidden" name="productId" value={productId} /><button data-agentbridge-action="add-to-wishlist" className="rounded-md border border-slate-300 px-5 py-3 font-semibold">Save</button></form></div>;
}
