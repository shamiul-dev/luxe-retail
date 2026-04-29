import { Metadata } from "next";
import AccountContent from "@/components/shop/AccountContent";

export const metadata: Metadata = { title: "My Account" };

export default function AccountPage() {
  return <AccountContent />;
}
