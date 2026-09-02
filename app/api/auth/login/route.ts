import { fail, ok } from "@/lib/api-response";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = loginSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return fail("INVALID_INPUT", "A valid email and password are required", 422);
  const user = await db.user.findUnique({ where: { email: body.data.email.toLowerCase() } });
  if (!user || !(await verifyPassword(body.data.password, user.passwordHash))) return fail("INVALID_CREDENTIALS", "Email or password is incorrect", 401);
  await createSession(user.id);
  return ok({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
}
