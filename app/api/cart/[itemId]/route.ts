import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateCartItem, removeCartItem } from "@/lib/queries/cart";
import { headers } from "next/headers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string } },
) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quantity } = await req.json();
  const item = await updateCartItem(session.user.id, params.itemId, quantity);
  return NextResponse.json({ item });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { itemId: string } },
) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await removeCartItem(session.user.id, params.itemId);
  return NextResponse.json({ success: true });
}
