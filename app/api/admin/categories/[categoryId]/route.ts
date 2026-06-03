import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateCategory, deleteCategory } from "@/lib/queries/admin";
import { slugify } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: { categoryId: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (body.name) {
    body.slug = slugify(body.name);
  }

  const category = await updateCategory(params.categoryId, body);
  return NextResponse.json({ category });
}

export async function DELETE(req: NextRequest, { params }: { params: { categoryId: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await deleteCategory(params.categoryId);
  return NextResponse.json({ success: true });
}
