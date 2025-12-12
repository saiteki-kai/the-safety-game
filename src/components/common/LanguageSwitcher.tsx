import { navigate } from "astro:transitions/client";
import { ChevronDown } from "lucide-react";
import gbFlag from "@assets/flags/gb.svg?url";
import itFlag from "@assets/flags/it.svg?url";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import { cn } from "@/lib/utils";

const LANGUAGES: Array<{ code: Locale; label: string; icon: string }> = [
  { code: "it", label: "Italiano", icon: itFlag  },
  { code: "en", label: "English", icon: gbFlag },
];

const triggerClasses =
  "rounded-full border-0 bg-black/50 px-3 py-1.5 font-semibold text-sm text-white shadow-sm hover:bg-violet-800/40 hover:text-violet-200 cursor-pointer";

export interface LanguageSwitcherProps {
  className?: string;
  locale?: Locale;
}

export default function LanguageSwitcher({ className, locale = DEFAULT_LOCALE }: LanguageSwitcherProps) {
  const currentLocale = locale;

  const handleLanguageChange = (locale: Locale) => {
    if (locale === currentLocale) return;

    try {
      const pathname = window.location.pathname;
      // Remove current locale prefix
      const withoutLocale = pathname.replace(/^\/(en|it)(\/|$)/, "/");
      const basePath = withoutLocale === "" || withoutLocale === "/" ? "/home" : withoutLocale;
      // Navigate to new locale
      const newPath = `/${locale}${basePath.startsWith("/") ? basePath : `/${basePath}`}`;
      navigate(newPath);
    } catch (err) {
      console.error("Failed to change language:", err);
    }
  };
  
  const current = LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn(triggerClasses, className)} aria-label={"Select language"}>
          <img src={current.icon} alt={current.label} className="size-5 rounded-sm" />
          <span>{current.label}</span>
          <ChevronDown className="size-3 transition duration-300 data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-32 rounded-xl p-1.5">
        {LANGUAGES.map((lang) => {
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
                <img src={lang.icon} alt={lang.label} className="size-5 rounded-sm" />
                <span>{lang.label}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LanguageSwitcherMobile({ className, locale = DEFAULT_LOCALE }: LanguageSwitcherProps) {
  const currentLocale = locale;

  const handleLanguageChange = (locale: Locale) => {
    if (locale === currentLocale) return;

    try {
      const pathname = window.location.pathname;
      // Remove current locale prefix
      const withoutLocale = pathname.replace(/^\/(en|it)(\/|$)/, "/");
      const basePath = withoutLocale === "" || withoutLocale === "/" ? "/home" : withoutLocale;
      // Navigate to new locale
      const newPath = `/${locale}${basePath.startsWith("/") ? basePath : `/${basePath}`}`;
      navigate(newPath);
    } catch (err) {
      console.error("Failed to change language:", err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {LANGUAGES.map((lang) => {
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
            <img src={lang.icon} alt={lang.label} className="size-5 rounded-sm" />
            <span>{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}
