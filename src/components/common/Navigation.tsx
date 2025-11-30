"use client";

import { navigationLinks } from "@content/site-config";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { MenuItem } from "./NavigationParts";
import { renderMenuItem, renderMobileMenuItem } from "./NavigationParts";
import NavLogo from "./NavLogo";

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
  scrolled?: boolean;
  isIndexPage?: boolean;
}

const defaultMenu: MenuItem[] = navigationLinks.map((link) => ({
  title: link.label,
  url: link.href,
}));

export default function Navigation({
  logo = {
    url: "/",
    alt: "Logo",
    title: "The Safety Game",
  },
  menu = defaultMenu,
  actions = undefined,
  actionsMobile = undefined,
  activeSection = null,
  navOpacity = 0,
  scrolled = false,
  isIndexPage = false,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const isOpaque = navOpacity >= 0.5;

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:inline-block">
        Salta al contenuto principale
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
        <div className="px-4 md:container md:mx-auto">
          {typeof navOpacity === "number" && <div style={{ display: "none" }} data-nav-hidden="" />}
          {/* isOpaque is true when navOpacity >= 0.5 */}
          {/* Desktop Menu */}
          <nav className="hidden h-16 items-center justify-between md:flex">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <NavLogo logo={logo} isOpaque={isOpaque} />
              <div className="flex items-center">
                <NavigationMenu>
                  <NavigationMenuList>
                    {menu.map((item) => renderMenuItem(item, activeSection ?? undefined, isOpaque))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="flex items-center gap-2">{actions ?? null}</div>
          </nav>

          {/* Mobile Menu */}
          <div className="flex h-16 items-center justify-between md:hidden">
            {/* Logo */}
            <NavLogo logo={logo} isOpaque={isOpaque} />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOpen(!open)}
              className={cn(
                "rounded-full border-0 text-violet-200 shadow-sm transition-all duration-200 hover:bg-violet-800/40 hover:text-violet-200",
                navOpacity > 0 ? "bg-black/50" : "bg-transparent",
              )}
              aria-label={open ? "Chiudi il menu" : "Apri il menu"}
              aria-expanded={open}
            >
              <Menu className={open ? "hidden" : "size-4"} />
              <X className={open ? "size-4" : "hidden"} />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          {open && (
            <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden bg-black/95 backdrop-blur-md md:hidden">
              <div className="px-4 md:container md:mx-auto">
                <div className="flex flex-col">
                  <Accordion type="single" collapsible className="mb-3 w-full">
                    {menu.map((item) =>
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
                  <Separator className="mx-0 my-2 bg-white/80" aria-hidden="true" />
                  <div className="pt-2">{actionsMobile ?? actions ?? null}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
