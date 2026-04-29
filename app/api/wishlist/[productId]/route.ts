import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { removeFromWishlist } from "@/lib/queries/wishlist";
import { headers } from "next/headers";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { productId: string } },
) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await removeFromWishlist(session.user.id, params.productId);
  return NextResponse.json({ success: true });
}
