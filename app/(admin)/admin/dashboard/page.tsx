import {
  getDashboardStats,
  getRecentOrders,
  getTopProducts,
} from "@/lib/queries/admin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = { title: "Dashboard | Admin" };
export const revalidate = 60;

export default async function DashboardPage() {
  const [stats, recentOrders, topProducts] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
    getTopProducts(),
  ]);
  return (
    <AdminDashboard
      stats={stats}
      recentOrders={recentOrders as any}
      topProducts={topProducts as any}
    />
  );
}
