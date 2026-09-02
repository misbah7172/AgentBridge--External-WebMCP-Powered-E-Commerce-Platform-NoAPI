import { fail, ok } from "@/lib/api-response";
import { shippingEstimate } from "@/lib/pricing";

export function GET(request: Request) {
  const url = new URL(request.url); const country = url.searchParams.get("country") ?? ""; const postalCode = url.searchParams.get("postalCode") ?? "";
  try { return ok(shippingEstimate(country, postalCode)); } catch { return fail("INVALID_ADDRESS", "Country and postal code are required", 422); }
}
