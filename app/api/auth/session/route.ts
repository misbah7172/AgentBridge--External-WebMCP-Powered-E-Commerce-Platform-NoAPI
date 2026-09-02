import { ok } from "@/lib/api-response";
import { currentUser } from "@/lib/auth";

export async function GET() {
  const user = await currentUser();
  return ok({ user: user ? { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } : null });
}
