import { ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { money } from "@/lib/serializers";
import { routeError } from "@/lib/route";

export async function GET() {
  try { const user = await requireUser(); const orders = await db.order.findMany({ where: { userId: user.id }, include: { items: true }, orderBy: { createdAt: "desc" } }); return ok({ orders: orders.map((order: any) => ({ id: order.id, status: order.status, total: money(order.total), createdAt: order.createdAt, itemCount: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0) })) }); } catch (error) { return routeError(error); }
}
