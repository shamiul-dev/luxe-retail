import { Metadata } from "next";
import CheckoutContent from "@/components/shop/CheckoutContent";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return <CheckoutContent />;
}
