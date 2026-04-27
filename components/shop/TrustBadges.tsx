import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const BADGES = [
  { icon: Truck,        title: "Free Shipping",  description: "On orders over $150" },
  { icon: ShieldCheck,  title: "Secure Payment", description: "SSL encrypted checkout" },
  { icon: RefreshCw,    title: "Easy Returns",   description: "30-day return policy" },
  { icon: Headphones,   title: "24/7 Support",   description: "Expert help anytime" },
];

export default function TrustBadges() {
  return (
    <section className="border-y border-border bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {BADGES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-center gap-3 px-6 py-5">
              <Icon size={20} className="text-accent shrink-0" strokeWidth={1.8} />
              <div>
                <p className="text-xs font-semibold text-content">{title}</p>
                <p className="text-xs text-content-muted mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
