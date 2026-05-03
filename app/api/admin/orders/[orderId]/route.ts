import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/queries/admin";
import { headers } from "next/headers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();
  if (!status)
    return NextResponse.json({ error: "status required" }, { status: 400 });

  const order = await updateOrderStatus(params.orderId, status);
  return NextResponse.json({ order });
}
