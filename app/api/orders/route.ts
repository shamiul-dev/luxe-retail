import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOrder } from "@/lib/queries/orders";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    address,
    shippingMethod,
    cartSnapshot,
    subtotal,
    shipping,
    tax,
    total,
  } = await req.json();

  if (!address || !cartSnapshot?.length) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const order = await createOrder(
    session.user.id,
    session.user.name,
    session.user.email,
    address,
    shippingMethod,
    cartSnapshot,
    subtotal,
    shipping,
    tax,
    total,
  );

  return NextResponse.json({ order });
}
