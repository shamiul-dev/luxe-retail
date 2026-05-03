import { getAllOrders } from "@/lib/queries/admin";
import AdminOrders from "@/components/admin/AdminOrders";

export const metadata = { title: "Orders | Admin" };
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  return <AdminOrders orders={orders as any} />;
}
