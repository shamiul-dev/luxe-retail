import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getWishlistItems, addToWishlist } from "@/lib/queries/wishlist";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ items: [] });

  const items = await getWishlistItems(session.user.id);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId)
    return NextResponse.json({ error: "productId required" }, { status: 400 });

  const item = await addToWishlist(session.user.id, productId);
  return NextResponse.json({ item });
}
