"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface OrderConfirmationProps {
  orderNumber: string;
}

export default function OrderConfirmation({
  orderNumber,
}: OrderConfirmationProps) {
  return (
    <div className="max-w-container mx-auto px-6 py-20 flex flex-col items-center text-center">
      {/* Icon */}
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 shadow-overlay">
        <CheckCircle size={32} className="text-white" strokeWidth={2} />
      </div>

      {/* Heading */}
      <h1 className="font-heading text-4xl font-bold text-content mb-3">
        Thank You
      </h1>
      <p className="text-content-secondary text-base max-w-md mb-8">
        Your order has been received and is currently being processed.
        We&apos;ve sent a confirmation email with all the details.
      </p>

      {/* Order number + date */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-10">
        <div className="bg-white rounded-xl shadow-raised p-5">
          <p className="text-[10px] font-semibold text-content-muted tracking-widest uppercase mb-2">
            Order Number
          </p>
          <p className="font-heading text-lg font-bold text-content">
            {orderNumber}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-raised p-5">
          <p className="text-[10px] font-semibold text-content-muted tracking-widest uppercase mb-2">
            Order Date
          </p>
          <p className="font-heading text-lg font-bold text-content">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date())}
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/orders">
          <Button variant="primary" size="lg">
            View Order History
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
