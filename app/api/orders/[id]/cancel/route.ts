import { fail, ok } from "@/lib/api-response";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { routeError } from "@/lib/route";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await context.params;
    const order = await db.order.findFirst({ where: { id, userId: user.id } });
    if (!order) return fail("ORDER_NOT_FOUND", "Order not found", 404);
    if (!["PENDING", "PAID", "PROCESSING"].includes(order.status)) return fail("ORDER_CANNOT_BE_CANCELLED", "This order can no longer be cancelled", 409);
    const items = await db.orderItem.findMany({ where: { orderId: id } });
    await db.$transaction([db.order.update({ where: { id }, data: { status: "CANCELLED" } }), ...items.map((item: any) => item.variantId ? db.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } }) : db.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } }))]);
    return ok({ cancelled: true });
  } catch (error) { return routeError(error); }
}
