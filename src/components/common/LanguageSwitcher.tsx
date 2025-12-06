import { navigate } from "astro:transitions/client";
import type { ImageMetadata } from "astro";
import i18next from "i18next";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import gbFlag from "@/assets/gb.svg";
import itFlag from "@/assets/it.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localizeUrl } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LANGUAGES: Array<{ code: string; label: string; flagSrc: ImageMetadata }> = [
  { code: "it", label: "Italiano", flagSrc: itFlag },
  { code: "en", label: "English", flagSrc: gbFlag },
];

const triggerClasses =
  "rounded-full border-0 bg-black/50 px-3 py-1.5 font-semibold text-sm text-white shadow-sm hover:bg-violet-800/40 hover:text-violet-200 cursor-pointer";

export interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { t } = useTranslation("common");
  const [currentLocale, setCurrentLocale] = useState<string | null>(null);
  const [supported, setSupported] = useState<typeof LANGUAGES>([]);

  useEffect(() => {
    const supportedLngs = (i18next.options?.supportedLngs as string[] | undefined) || [];
    const available = LANGUAGES.filter((lang) => supportedLngs.includes(lang.code) && lang.code !== "cimode");

    setSupported(available);
    if (available.length > 0) {
      setCurrentLocale(i18next.language || available[0].code);
    }
  }, []);

  const handleLanguageChange = async (locale: string) => {
    if (locale === currentLocale) return;

    try {
      await i18next.changeLanguage(locale);
      setCurrentLocale(locale);

      const pathname = window.location.pathname;
      const withoutLocale = pathname.replace(/^\/(en|it)(\/|$)/, "/");
      const basePath = withoutLocale === "" || withoutLocale === "/" ? "/home" : withoutLocale;
      navigate(localizeUrl(basePath));
    } catch (err) {
      console.error("Failed to change language:", err);
    }
  };

  // Don't render if no supported languages or locale not initialized
  if (supported.length === 0 || !currentLocale) {
    return null;
  }

  const current = supported.find((l) => l.code === currentLocale);
  if (!current) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn(triggerClasses, className)} aria-label={t("selectLanguage")}>
          <img src={current.flagSrc.src} alt={current.label} className="size-5 rounded-sm" />
          <span>{current.label}</span>
          <ChevronDown className="size-3 transition duration-300 data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-32 rounded-xl p-1.5">
        {supported.map((lang) => {
          const selected = lang.code === currentLocale;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              aria-current={selected ? "true" : undefined}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-4 py-2.5 transition-colors duration-150",
                selected ? "bg-white font-semibold text-black" : "text-gray-600 hover:bg-black/90",
              )}
            >
              <div className="flex items-center gap-2">
                <img src={lang.flagSrc.src} alt={lang.label} className="size-5 rounded-sm" />
                <span>{lang.label}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LanguageSwitcherMobile({ className }: LanguageSwitcherProps) {
  const [currentLocale, setCurrentLocale] = useState<string | null>(null);
  const [supported, setSupported] = useState<typeof LANGUAGES>([]);

  useEffect(() => {
    const supportedLngs = (i18next.options?.supportedLngs as string[] | undefined) || [];
    const available = LANGUAGES.filter((lang) => supportedLngs.includes(lang.code) && lang.code !== "cimode");

    setSupported(available);
    if (available.length > 0) {
      setCurrentLocale(i18next.language || available[0].code);
    }
  }, []);

  const handleLanguageChange = async (locale: string) => {
    if (locale === currentLocale) return;

    try {
      await i18next.changeLanguage(locale);
      setCurrentLocale(locale);

      const pathname = window.location.pathname;
      const withoutLocale = pathname.replace(/^\/(en|it)(\/|$)/, "/");
      const basePath = withoutLocale === "" || withoutLocale === "/" ? "/home" : withoutLocale;
      navigate(localizeUrl(basePath));
    } catch (err) {
      console.error("Failed to change language:", err);
    }
  };

  if (supported.length === 0 || !currentLocale) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {supported.map((lang) => {
        const selected = lang.code === currentLocale;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleLanguageChange(lang.code)}
            aria-current={selected ? "true" : undefined}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 transition-colors duration-150",
              selected ? "bg-white/90 font-semibold text-black" : "text-gray-300 hover:bg-white/10",
            )}
          >
            <img src={lang.flagSrc.src} alt={lang.label} className="size-5 rounded-sm" />
            <span>{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}
