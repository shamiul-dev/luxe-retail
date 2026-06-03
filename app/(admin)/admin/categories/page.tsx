import AdminCategories from "@/components/admin/AdminCategories";
import { getAllCategories } from "@/lib/queries/admin";

export const metadata = {
  title: "Category Management | Luxe Retail Admin",
};

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  
  // Format dates for client
  const formattedCategories = categories.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return <AdminCategories categories={formattedCategories} />;
}
