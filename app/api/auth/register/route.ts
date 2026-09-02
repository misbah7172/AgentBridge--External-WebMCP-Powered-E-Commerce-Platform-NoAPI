import { fail, ok } from "@/lib/api-response";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = registerSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return fail("INVALID_INPUT", body.error.issues[0]?.message ?? "Invalid input", 422);
  try {
    const user = await db.user.create({ data: { email: body.data.email.toLowerCase(), firstName: body.data.firstName, lastName: body.data.lastName, passwordHash: await hashPassword(body.data.password) } });
    await createSession(user.id);
    return ok({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } }, 201);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") return fail("EMAIL_TAKEN", "An account with that email already exists", 409);
    return fail("INTERNAL_ERROR", "Unable to create account", 500);
  }
}
