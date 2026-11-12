import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/features/home/components/hero-section";
import { MenuShowcaseSection } from "@/features/home/components/menu-showcase-section";
import { LocationsSection } from "@/features/home/components/locations-section";
import { HomeFooter } from "@/features/home/components/home-footer";
import { ScrollbarTheme } from "@/components/layout/scrollbar-theme";
import { getPublicMenus } from "@/features/menu/queries/public-menu.queries";

export default async function HomePage() {
  const menus = await getPublicMenus();

  return (
    <>
      <ScrollbarTheme theme="landing-theme" />

      <Navbar />

      <main>
        <HeroSection />
        <MenuShowcaseSection menus={menus} />
        <LocationsSection />
      </main>

      <HomeFooter />
    </>
  );
}