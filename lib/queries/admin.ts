import { db } from "@/db";
import { eq, desc, sql, count, sum, gte } from "drizzle-orm";
import { orders, products, users, orderItems, categories } from "@/db/schema";

export async function getDashboardStats() {
  const [totalSales] = await db
    .select({ value: sum(orders.total) })
    .from(orders)
    .where(eq(orders.paymentStatus, "paid"));
  const [activeOrders] = await db
    .select({ value: count() })
    .from(orders)
    .where(eq(orders.status, "processing"));
  const [newCustomers] = await db.select({ value: count() }).from(users);
  const [totalRevenue] = await db
    .select({ value: sum(orders.total) })
    .from(orders);
  const [awaitingShipping] = await db
    .select({ value: count() })
    .from(orders)
    .where(eq(orders.status, "pending"));

  return {
    totalSales: Number(totalSales?.value ?? 0),
    activeOrders: Number(activeOrders?.value ?? 0),
    newCustomers: Number(newCustomers?.value ?? 0),
    totalRevenue: Number(totalRevenue?.value ?? 0),
    awaitingShipping: Number(awaitingShipping?.value ?? 0),
  };
}

export async function getRecentOrders(limit = 8) {
  return db.query.orders.findMany({
    orderBy: desc(orders.createdAt),
    limit,
    with: { items: true },
  });
}

export async function getTopProducts(limit = 5) {
  return db
    .select({
      productId: orderItems.productId,
      name: orderItems.name,
      revenue: sum(sql`${orderItems.price}::numeric * ${orderItems.quantity}`),
      sold: sum(orderItems.quantity),
    })
    .from(orderItems)
    .groupBy(orderItems.productId, orderItems.name)
    .orderBy(
      desc(sum(sql`${orderItems.price}::numeric * ${orderItems.quantity}`)),
    )
    .limit(limit);
}

export async function getWeeklySalesChart() {
  // Last 4 weeks of data, grouped by ISO week
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const rows = await db
    .select({
      week: sql<string>`to_char(date_trunc('week', ${orders.createdAt}), 'Mon DD')`,
      weekStart: sql<string>`date_trunc('week', ${orders.createdAt})`,
      revenue: sum(orders.total),
      orderCount: count(),
    })
    .from(orders)
    .where(gte(orders.createdAt, fourWeeksAgo))
    .groupBy(
      sql`date_trunc('week', ${orders.createdAt})`,
    )
    .orderBy(sql`date_trunc('week', ${orders.createdAt})`);

  // Ensure we always return 4 entries, filling missing weeks with zeros
  const result: { week: string; revenue: number; orderCount: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    // Find the Monday of that week
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const label = monday.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const weekKey = monday.toISOString().slice(0, 10);

    const match = rows.find((r) => r.weekStart.slice(0, 10) === weekKey);
    result.push({
      week: label,
      revenue: Number(match?.revenue ?? 0),
      orderCount: Number(match?.orderCount ?? 0),
    });
  }
  return result;
}

export async function getAllProducts() {
  return db.query.products.findMany({
    orderBy: desc(products.createdAt),
    with: { category: true },
  });
}

export async function getAllOrders() {
  return db.query.orders.findMany({
    orderBy: desc(orders.createdAt),
    with: { items: true },
  });
}

export async function getOrderById(orderId: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true },
  });
}

export async function getAllCustomers() {
  return db.query.users.findMany({
    orderBy: desc(users.createdAt),
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const [updated] = await db
    .update(orders)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning();
  return updated;
}

export async function deleteProduct(productId: string) {
  await db.delete(products).where(eq(products.id, productId));
}

export async function updateProductStatus(
  productId: string,
  status: "active" | "inactive",
) {
  const [updated] = await db
    .update(products)
    .set({ status, updatedAt: new Date() })
    .where(eq(products.id, productId))
    .returning();
  return updated;
}

export async function getProductById(productId: string) {
  return db.query.products.findFirst({
    where: eq(products.id, productId),
    with: { category: true },
  });
}

export async function updateProduct(
  productId: string,
  data: {
    name?: string;
    description?: string;
    price?: string;
    comparePrice?: string | null;
    categoryId?: string | null;
    brand?: string | null;
    sku?: string;
    stock?: number;
    status?: "active" | "inactive";
    colors?: string[];
    sizes?: string[];
    tags?: string[];
    isNew?: boolean;
  },
) {
  const [updated] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, productId))
    .returning();
  return updated;
}

export async function getAllCategories() {
  return db.select().from(categories);
}
