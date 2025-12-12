import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getTranslations, navTranslations, sectionsTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import LanguageSwitcher, { LanguageSwitcherMobile } from "./LanguageSwitcher";
import type { MenuItem } from "./NavigationParts";
import { renderMenuItem, renderMobileMenuItem } from "./NavigationParts";
import NavLogo from "./NavLogo";

// Section IDs that map to translation keys
const sectionIds = ["challenge", "instructions", "participate", "dates", "leaderboard", "team", "faq"] as const;

export interface NavbarProps {
  logo?: {
    url: string;
    src?: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  actions?: React.ReactNode;
  actionsMobile?: React.ReactNode;
  activeSection?: string | null;
  navOpacity?: number;
  isIndexPage?: boolean;
  locale?: Locale;
}

export default function Navigation({
  logo,
  menu,
  actions = undefined,
  actionsMobile = undefined,
  activeSection = null,
  navOpacity = 0,
  isIndexPage = false,
  locale = DEFAULT_LOCALE,
}: NavbarProps) {
  const navT = getTranslations(navTranslations, locale);
  const sectionsT = getTranslations(sectionsTranslations, locale);
  
  const [open, setOpen] = useState(false);
  const isOpaque = navOpacity >= 0.5;

  // Build default menu with translated labels
  const defaultMenu: MenuItem[] = sectionIds.map((id) => ({
    title: sectionsT[id as keyof typeof sectionsT] || id,
    url: `#${id}`,
  }));
  const menuItems = menu ?? defaultMenu;

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:inline-block">
        {navT.skipToContent}
      </a>
      <section
        className={cn(
          "fixed top-0 z-50 w-full text-violet-200 transition-all duration-300 ease-in-out",
          // Mobile: always black background
          "bg-black",
          // Desktop: conditional backgrounds
          navOpacity >= 1
            ? "lg:border-gray-800 lg:bg-black lg:shadow-black/20 lg:shadow-lg"
            : navOpacity > 0
              ? "lg:border-gray-700 lg:bg-black/90 lg:shadow-black/10 lg:shadow-md"
              : "lg:border-transparent lg:bg-transparent lg:shadow-none",
        )}
        data-nav-opacity={navOpacity}
      >
        <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-8">
          {typeof navOpacity === "number" && <div style={{ display: "none" }} data-nav-hidden="" />}
          {/* isOpaque is true when navOpacity >= 0.5 */}
          {/* Desktop Menu */}
          <nav className="hidden h-14 items-center justify-between lg:h-16 lg:flex">
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Logo */}
              <NavLogo logo={logo} isOpaque={isOpaque} locale={locale} />
              <div className="flex items-center">
                <NavigationMenu>
                  <NavigationMenuList className="gap-0.5 lg:gap-1">
                    {menuItems.map((item) => renderMenuItem(item, activeSection ?? undefined, isOpaque))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="flex items-center gap-3 lg:gap-4">{actions ?? null}</div>
          </nav>

          {/* Mobile Menu */}
          <div className="flex h-14 items-center justify-between sm:h-16 lg:hidden">
            {/* Logo */}
            <NavLogo logo={logo} isOpaque={isOpaque} locale={locale} />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOpen(!open)}
              className={cn(
                "rounded-full border-0 text-violet-200 shadow-sm transition-all duration-200 hover:bg-violet-800/40 hover:text-violet-200",
                navOpacity > 0 ? "bg-black/50" : "bg-transparent",
              )}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <Menu className={open ? "hidden" : "size-4"} />
              <X className={open ? "size-4" : "hidden"} />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          {open && (
            <div className="min-h-dvh w-full overflow-y-auto overflow-x-hidden bg-black/95 backdrop-blur-md lg:hidden">
              <div className="px-3 sm:px-4 md:container md:mx-auto">
                <div className="flex flex-col">
                  <Accordion type="single" collapsible className="mb-3 w-full">
                    {menuItems.map((item) =>
                      renderMobileMenuItem(
                        item,
                        () => setOpen(false),
                        activeSection ?? undefined,
                        isOpaque,
                        isIndexPage,
                      ),
                    )}
                  </Accordion>
                  {/* subtle separator matching site border color and mobile padding */}
                  <Separator className="mx-0 my-2 bg-white/20" aria-hidden="true" />
                  <div className="flex flex-col gap-3 pt-2">
                    {/* Mobile: language switcher enabled */}
                      <LanguageSwitcherMobile locale={locale} />
                    {(actionsMobile ?? actions) && (
                      <>
                        <Separator className="mx-0 my-1 bg-white/20" aria-hidden="true" />
                        {actionsMobile ?? actions}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: language switcher enabled */}
        <div className="pointer-events-auto absolute inset-y-0 right-2 hidden items-center lg:flex lg:right-4">
          <LanguageSwitcher locale={locale} />
        </div>
      </section>
    </>
  );
}
