import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getCartItems(userId: string) {
  return db.query.cartItems.findMany({
    where: eq(cartItems.userId, userId),
    with: { product: true },
  });
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity = 1,
  color?: string,
  size?: string,
) {
  // Check if item already exists
  const existing = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.userId, userId),
      eq(cartItems.productId, productId),
      color ? eq(cartItems.color, color) : undefined,
      size ? eq(cartItems.size, size) : undefined,
    ),
  });

  if (existing) {
    // Update quantity
    const [updated] = await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id))
      .returning();
    return updated;
  }

  // Insert new
  const [inserted] = await db
    .insert(cartItems)
    .values({ userId, productId, quantity, color, size })
    .returning();
  return inserted;
}

export async function updateCartItem(
  userId: string,
  itemId: string,
  quantity: number,
) {
  if (quantity <= 0) {
    return removeCartItem(userId, itemId);
  }
  const [updated] = await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)))
    .returning();
  return updated;
}

export async function removeCartItem(userId: string, itemId: string) {
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)));
}

export async function clearCart(userId: string) {
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}
