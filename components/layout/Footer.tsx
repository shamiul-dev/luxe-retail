import Link from "next/link";

const LINKS = {
  Shop: [
    { label: "New Arrivals",   href: "/shop?sort=newest" },
    { label: "Best Sellers",   href: "/shop?sort=best" },
    { label: "Accessories",    href: "/shop?category=accessories" },
  ],
  "Customer Care": [
    { label: "Shipping Info",  href: "/shipping" },
    { label: "Returns",        href: "/returns" },
    { label: "Order Tracking", href: "/orders" },
  ],
  Policy: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookies",        href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-24">
      <div className="max-w-container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-bold text-sm tracking-widest text-primary uppercase">
              Luxe Retail
            </span>
            <p className="text-sm text-content-muted leading-relaxed max-w-[200px]">
              Defining modern elegance through a curated selection of premium products.
              Quality, integrity, and style in every delivery.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold text-content tracking-widest uppercase">
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-content-muted hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-heading font-bold text-sm tracking-widest text-primary uppercase">
            Luxe Retail
          </span>
          <p className="text-xs text-content-muted">© 2024 Luxe Retail. All Rights Reserved.</p>
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Shipping Info", href: "/shipping" },
              { label: "Returns", href: "/returns" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-content-muted hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
