import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteProduct, updateProductStatus } from "@/lib/queries/admin";
import { headers } from "next/headers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();
  if (!status)
    return NextResponse.json({ error: "status required" }, { status: 400 });

  const product = await updateProductStatus(params.productId, status);
  return NextResponse.json({ product });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { productId: string } },
) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await deleteProduct(params.productId);
  return NextResponse.json({ success: true });
}
