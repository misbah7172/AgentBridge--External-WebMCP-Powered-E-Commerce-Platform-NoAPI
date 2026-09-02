import { ok } from "@/lib/api-response";
import { clearSession } from "@/lib/auth";

export async function POST() { await clearSession(); return ok({ loggedOut: true }); }
