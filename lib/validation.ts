import { z } from "zod";

const numberQuery = z.coerce.number().finite();

export const productSearchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(80).optional(),
  minPrice: numberQuery.min(0).optional(),
  maxPrice: numberQuery.min(0).optional(),
  brand: z.string().trim().max(80).optional(),
  minRating: numberQuery.min(0).max(5).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z.enum(["price_asc", "price_desc", "rating", "newest", "popularity"]).optional(),
}).refine((input) => input.maxPrice === undefined || input.minPrice === undefined || input.maxPrice >= input.minPrice, {
  message: "maxPrice must be greater than or equal to minPrice",
  path: ["maxPrice"],
});

export const registerSchema = z.object({ email: z.string().email().max(254), password: z.string().min(8).max(128), firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80) });
export const loginSchema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(128) });
export const cartItemSchema = z.object({ productId: z.string().cuid(), variantId: z.string().cuid().optional(), quantity: z.number().int().min(1).max(20) });
export const quantitySchema = z.object({ quantity: z.number().int().min(1).max(20) });
export const couponSchema = z.object({ code: z.string().trim().min(2).max(40) });
export const checkoutSchema = z.object({ addressId: z.string().cuid().optional(), country: z.string().trim().min(2).max(80), postalCode: z.string().trim().min(2).max(20), paymentMethod: z.literal("mock") });
