import { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getOrders } from "@/lib/queries/orders";
import { redirect } from "next/navigation";
import OrderHistory from "@/components/shop/OrderHistory";

export const metadata: Metadata = { title: "Order History" };

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) redirect("/auth");

  const orders = await getOrders(session.user.id);

  return <OrderHistory orders={orders as any} />;
}
