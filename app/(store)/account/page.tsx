import { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getOrders } from "@/lib/queries/orders";
import { redirect } from "next/navigation";
import AccountContent from "@/components/shop/AccountContent";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) redirect("/auth");

  const orders = await getOrders(session.user.id);
  const recentOrders = orders.slice(0, 3);

  return <AccountContent recentOrders={recentOrders as any} />;
}
