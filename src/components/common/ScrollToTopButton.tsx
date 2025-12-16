import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollContainer = useRef<HTMLElement | Window | null>(null);

  const scrollToTop = () => {
    const target = scrollContainer.current ?? window;
    target.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setIsMounted(true);

    const viewport = document.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]');
    const target: HTMLElement | Window = viewport ?? window;
    scrollContainer.current = target;

    const toggleVisibility = () => {
      const scrollTop = target instanceof Window ? target.scrollY : target.scrollTop;
      const threshold = target instanceof Window ? window.innerHeight : target.clientHeight;
      setIsVisible(scrollTop > threshold);
    };

    toggleVisibility();

    target.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => target.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Only render after mount to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      variant="outline"
      className="fixed right-4 bottom-4 z-50 rounded-full shadow-lg"
      aria-label={"Scroll to top"}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}
