import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteProduct, updateProduct } from "@/lib/queries/admin";
import { headers } from "next/headers";

export async function PATCH(req: NextRequest, { params }: { params: { productId: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const product = await updateProduct(params.productId, body);
  return NextResponse.json({ product });
}

export async function DELETE(_: NextRequest, { params }: { params: { productId: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await deleteProduct(params.productId);
  return NextResponse.json({ success: true });
}