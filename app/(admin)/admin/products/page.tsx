import { getAllProducts, getAllCategories } from "@/lib/queries/admin";
import AdminProducts from "@/components/admin/AdminProducts";

export const metadata = { title: "Products | Admin" };
export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);
  return (
    <AdminProducts products={products as any} categories={categories as any} />
  );
}
