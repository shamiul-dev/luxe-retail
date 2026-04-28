import { db } from "@/db";
import { orders, orderItems, cartItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Address, ShippingMethod } from "@/types";

export async function createOrder(
  userId: string,
  customerName: string,
  customerEmail: string,
  address: Address,
  shippingMethod: ShippingMethod,
  cartSnapshot: {
    productId: string;
    name: string;
    image: string;
    price: string;
    quantity: number;
    color?: string | null;
    size?: string | null;
  }[],
  subtotal: number,
  shipping: number,
  tax: number,
  total: number,
) {
  const orderNumber = `#LX-${Math.floor(1000 + Math.random() * 9000)}`;

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      userId,
      customerName,
      customerEmail,
      status: "pending",
      paymentStatus: "processing",
      paymentMethod: "card",
      subtotal: String(subtotal),
      shipping: String(shipping),
      tax: String(tax),
      discount: "0",
      total: String(total),
      shippingName: address.fullName,
      shippingEmail: address.email,
      shippingStreet: address.street,
      shippingCity: address.city,
      shippingZip: address.zipCode,
      shippingCountry: address.country,
      shippingMethod: shippingMethod.id,
    })
    .returning();

  await db.insert(orderItems).values(
    cartSnapshot.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    })),
  );

  await db.delete(cartItems).where(eq(cartItems.userId, userId));

  return order;
}

export async function getOrders(userId: string) {
  return db.query.orders.findMany({
    where: eq(orders.userId, userId),
    orderBy: desc(orders.createdAt),
    with: { items: true },
  });
}

export async function getOrderByNumber(orderNumber: string, userId: string) {
  return db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
    with: { items: true },
  });
}
