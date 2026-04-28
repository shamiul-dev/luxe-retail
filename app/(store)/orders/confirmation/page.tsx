import { Metadata } from "next";
import OrderConfirmation from "@/components/shop/OrderConfirmation";

export const metadata: Metadata = { title: "Order Confirmed" };

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return <OrderConfirmation orderNumber={searchParams.order ?? ""} />;
}
