import { fail, ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { money } from "@/lib/serializers";
import { routeError } from "@/lib/route";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try { const user = await requireUser(); const { id } = await context.params; const order = await db.order.findFirst({ where: { id, userId: user.id }, include: { items: true, address: true } }); if (!order) return fail("ORDER_NOT_FOUND", "Order not found", 404); return ok({ ...order, subtotal: money(order.subtotal), discount: money(order.discount), shipping: money(order.shipping), total: money(order.total), items: order.items.map((item: any) => ({ ...item, unitPrice: money(item.unitPrice) })) }); } catch (error) { return routeError(error); }
}
