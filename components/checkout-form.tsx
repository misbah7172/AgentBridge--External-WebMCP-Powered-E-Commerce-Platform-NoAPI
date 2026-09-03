import { checkoutAction } from "@/app/actions";

export function CheckoutForm() {
  return <form action={checkoutAction} data-agentbridge-form="checkout" className="max-w-lg space-y-4 rounded-xl border bg-white p-6"><h1 className="text-2xl font-semibold">Checkout</h1><p className="text-sm text-slate-600">Demo checkout. No payment information is collected.</p><label className="block text-sm font-medium">Country<input required name="country" data-agentbridge-field="country" defaultValue="United States" className="mt-1 w-full rounded border p-2" /></label><label className="block text-sm font-medium">Postal code<input required name="postalCode" data-agentbridge-field="postalCode" className="mt-1 w-full rounded border p-2" /></label><button data-agentbridge-action="place-order" className="w-full rounded bg-ink py-3 font-semibold text-white">Place mock order</button></form>;
}
