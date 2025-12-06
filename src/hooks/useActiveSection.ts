import { useEffect, useState } from "react";
import type { NavigationLink } from "@/content/site-config";
// This hook is tailored for the home page ('/'). It reads the hero element (#home and .hero-kicker)
// and computes the active section + nav opacity as the user scrolls. It intentionally returns
// a fully-opaque nav on non-home pages to keep a consistent look on secondary pages.
import { navigationLinks } from "@/content/site-config";

export function useHomeActiveSection(links?: NavigationLink[]) {
  const source = links ?? navigationLinks;
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [navOpacity, setNavOpacity] = useState<number>(0);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const DEBUG = false; // enable for troubleshooting in browser console
    const getProgress = () => {
      if (typeof window === "undefined") return 1;
      const pathname = window.location?.pathname ?? "/";
      // Check if this is a home/index path for any locale (/home, /en/home, /it/home, etc.)
      const isHomePath = pathname.endsWith("/home");
      const heroSection = document.getElementById("home");
      const heroKicker = document.querySelector(".hero-kicker") as HTMLElement | null;
      const nav = document.querySelector('nav[role="navigation"]') as HTMLElement | null;
      const navHeight = nav ? nav.getBoundingClientRect().height : 0;

      // Only compute dynamic opacity on the site home where we have a hero
      if (!isHomePath || !heroSection || !heroKicker) {
        if (DEBUG)
          console.debug("useActiveSection: not home or no hero", { pathname, isHomePath, heroFound: !!heroKicker });
        return 1;
      }

      // ScrollArea uses a viewport element for scrolling
      const scrollViewport = document.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null;
      if (scrollViewport && scrollViewport.scrollHeight > scrollViewport.clientHeight) {
        const heroRect = heroKicker.getBoundingClientRect();
        const viewportRect = scrollViewport.getBoundingClientRect();
        const heroTopWithinViewport = heroRect.top - viewportRect.top + scrollViewport.scrollTop;
        const y = scrollViewport.scrollTop;
        const targetY = Math.max(1, heroTopWithinViewport - navHeight);
        const progress = Math.min(1, Math.max(0, y / targetY));
        // Apply smooth easing for better visual transition
        const easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;
        if (DEBUG)
          console.debug("useActiveSection(viewport):", {
            y,
            targetY,
            progress,
            easedProgress,
            heroTopWithinViewport,
            navHeight,
          });
        return easedProgress;
      }

      const rect = heroKicker.getBoundingClientRect();
      const heroTopPageY = (window.scrollY || document.documentElement.scrollTop || 0) + rect.top;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const targetY = Math.max(1, heroTopPageY - navHeight);
      const progress = Math.min(1, Math.max(0, y / targetY));
      // Apply smooth easing for better visual transition
      const easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;
      if (DEBUG)
        console.debug("useActiveSection(window):", { y, targetY, progress, easedProgress, heroTopPageY, navHeight });
      return easedProgress;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        try {
          const progress = getProgress();
          setNavOpacity(progress);
          setScrolled(progress >= 1);

          const center = (window.innerHeight || 0) / 2;
          let best: { id: string; dist: number } | null = null;

          // Include an invisible spacer element that, when closest, clears the active section.
          // This ensures nav items de-highlight when scrolling above the first real section.
          const topSpacer = document.getElementById("top-spacer");
          if (topSpacer) {
            const rect = topSpacer.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const dist = Math.abs(sectionCenter - center);
            best = { id: "__spacer__", dist };
          }

          for (const l of source) {
            const id = l.href.replace("#", "");
            const el = document.getElementById(id);
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const dist = Math.abs(sectionCenter - center);
            if (!best || dist < best.dist) best = { id, dist };
          }

          // If the spacer wins, clear active section; otherwise set the winning section.
          if (best) {
            if (best.id === "__spacer__") setActiveSection(null);
            else setActiveSection(best.id);
          }
        } finally {
          ticking = false;
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // ScrollArea uses a viewport element for scrolling, so we need to listen on that
    const scrollViewport = document.querySelector('[data-slot="scroll-area-viewport"]');
    if (scrollViewport) scrollViewport.addEventListener("scroll", onScroll, { passive: true });
    // also recompute timing when resizing so target recalc is accurate
    const onResize = () => onScroll();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollViewport) scrollViewport.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [links]);

  return { activeSection, navOpacity, scrolled };
}

export default useHomeActiveSection;
