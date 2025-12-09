import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export function ScrollToTopButton() {
  const { t } = useTranslation("common");
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setIsMounted(true);

    const toggleVisibility = () => {
      if (window.scrollY > window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
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
