"use client";

import { localizeUrl } from "@/i18n/utils";

export interface NavLogoProps {
  logo?: {
    url: string;
    src?: string;
    alt: string;
    title: string;
    ariaLabel?: string;
  };
}

export default function NavLogo({ logo, isOpaque = true }: NavLogoProps & { isOpaque?: boolean }) {
  const finalLogo = logo ?? { url: localizeUrl("/home"), title: "The Safety Game", alt: "Logo" };
  const textClass = isOpaque ? "text-violet-200" : "text-white drop-shadow-sm";
  return (
    <a href={finalLogo.url} aria-label={finalLogo.ariaLabel ?? finalLogo.title} className="flex items-center gap-2">
      {finalLogo.src && <img src={finalLogo.src} className="h-8 max-h-8 dark:invert" alt={finalLogo.alt} />}
      <span className={`font-semibold text-lg tracking-tighter ${textClass}`}>{finalLogo.title}</span>
    </a>
  );
}
