import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCartItems, addToCart } from "@/lib/queries/cart";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ items: [] });

  const items = await getCartItems(session.user.id);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity, color, size } = await req.json();
  if (!productId)
    return NextResponse.json({ error: "productId required" }, { status: 400 });

  const item = await addToCart(
    session.user.id,
    productId,
    quantity ?? 1,
    color,
    size,
  );
  return NextResponse.json({ item });
}
