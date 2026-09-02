export function shippingEstimate(country: string, postalCode: string, subtotal = 0) {
  if (!country.trim() || !postalCode.trim()) throw new Error("INVALID_ADDRESS");
  if (subtotal >= 500) return { shippingCost: 0, estimatedDays: "3-5" };
  return { shippingCost: country.toLowerCase() === "united states" ? 9.99 : 14.99, estimatedDays: country.toLowerCase() === "united states" ? "3-5" : "7-12" };
}

export function couponDiscount(type: "PERCENTAGE" | "FIXED", amount: number, subtotal: number) {
  return Math.min(subtotal, type === "PERCENTAGE" ? subtotal * (amount / 100) : amount);
}
