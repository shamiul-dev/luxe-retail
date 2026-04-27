import Hero        from "@/components/shop/Hero";
import TrustBadges  from "@/components/shop/TrustBadges";
import CategoryGrid from "@/components/shop/CategoryGrid";
import NewArrivals  from "@/components/shop/NewArrivals";
import Newsletter   from "@/components/shop/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <CategoryGrid />
      <NewArrivals />
      <Newsletter />
    </>
  );
}
