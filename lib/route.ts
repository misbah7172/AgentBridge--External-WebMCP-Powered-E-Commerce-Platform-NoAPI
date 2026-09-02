import { fail } from "@/lib/api-response";

export function routeError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHENTICATED") return fail("UNAUTHENTICATED", "Sign in is required", 401);
  return fail("INTERNAL_ERROR", "An unexpected error occurred", 500);
}
