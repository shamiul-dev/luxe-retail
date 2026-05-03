import { getAllCustomers } from "@/lib/queries/admin";
import AdminCustomers from "@/components/admin/AdminCustomers";

export const metadata = { title: "Customers | Admin" };
export const revalidate = 0;

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();
  return <AdminCustomers customers={customers as any} />;
}
