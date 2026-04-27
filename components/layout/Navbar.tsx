"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session } = useSession();

  const { itemCount: cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-raised">
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading font-bold text-base tracking-widest text-primary uppercase hover:opacity-75 transition-opacity"
          >
            Luxe Retail
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-content-secondary hover:text-primary relative group pb-0.5 transition-colors"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1">
            {/* Search */}
            <div
              className={cn(
                "flex items-center transition-all duration-300 overflow-hidden",
                searchOpen ? "w-52" : "w-9",
              )}
            >
              {searchOpen && (
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  onBlur={() => setSearchOpen(false)}
                  className="flex-1 text-sm px-3 py-1.5 bg-surface-low rounded-l-lg outline-none text-content placeholder-content-muted"
                />
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className={cn(
                  "p-2 rounded-lg text-content-secondary hover:text-primary hover:bg-surface-low cursor-pointer transition-colors",
                  searchOpen && "rounded-l-none bg-surface-low",
                )}
              >
                <Search size={20} />
              </button>
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="p-2 rounded-lg text-content-secondary hover:text-primary hover:bg-surface-low transition-colors"
            >
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-2 rounded-lg text-content-secondary hover:text-primary hover:bg-surface-low transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / Sign out */}
            {session ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/account"
                  aria-label="Account"
                  className="p-2 rounded-lg text-content-secondary hover:text-primary hover:bg-surface-low transition-colors"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={() => signOut()}
                  aria-label="Sign out"
                  className="p-2 rounded-lg text-content-secondary hover:text-primary hover:bg-surface-low transition-colors cursor-pointer"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                aria-label="Sign in"
                className="p-2 rounded-lg text-content-secondary hover:text-primary hover:bg-surface-low transition-colors"
              >
                <User size={20} />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-content-secondary hover:bg-surface-low cursor-pointer transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-content-secondary hover:text-primary py-1 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-6 pt-3 border-t border-border">
            <Link
              href="/wishlist"
              className="flex items-center gap-2 text-sm text-content-secondary hover:text-primary transition-colors"
            >
              <Heart size={18} /> Wishlist
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm text-content-secondary hover:text-primary transition-colors"
            >
              <ShoppingCart size={18} /> Cart
            </Link>
            {session ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-sm text-content-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <LogOut size={18} /> Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 text-sm text-content-secondary hover:text-primary transition-colors"
              >
                <User size={18} /> Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
