import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { getTranslations, dashboardTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";

type ColorVariant = "blue" | "green" | "amber" | "neutral" | "emerald" | "rose";

type StatusActionRowProps = {
  Icon: LucideIcon;
  label: string;
  subtitle: string;
  href: string;
  variant?: ColorVariant;
  locale?: Locale;
};

const colorStyles: Record<ColorVariant, { bg: string; border: string; hoverBg: string; hoverBorder: string; icon: string; link: string; linkHover: string }> = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    hoverBg: "hover:bg-blue-100",
    hoverBorder: "hover:border-blue-300",
    icon: "text-blue-500",
    link: "text-blue-500",
    linkHover: "hover:text-blue-700"
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    hoverBg: "hover:bg-green-100",
    hoverBorder: "hover:border-green-300",
    icon: "text-green-600",
    link: "text-green-600",
    linkHover: "hover:text-green-700"
  },
  amber: {
    bg: "bg-amber-50/20",
    border: "border-amber-200",
    hoverBg: "hover:bg-amber-100",
    hoverBorder: "hover:border-amber-300",
    icon: "text-amber-600",
    link: "text-amber-600",
    linkHover: "hover:text-amber-700"
  },
  neutral: {
    bg: "bg-neutral-50",
    border: "border-neutral-100",
    hoverBg: "hover:bg-neutral-100",
    hoverBorder: "hover:border-neutral-200",
    icon: "text-neutral-600",
    link: "text-blue-600",
    linkHover: "hover:text-blue-700"
  },
  emerald: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    hoverBg: "hover:bg-teal-100",
    hoverBorder: "hover:border-teal-300",
    icon: "text-teal-600",
    link: "text-teal-600",
    linkHover: "hover:text-teal-700"
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    hoverBg: "hover:bg-rose-100",
    hoverBorder: "hover:border-rose-300",
    icon: "text-rose-600",
    link: "text-rose-600",
    linkHover: "hover:text-rose-700"
  }
};

export default function StatusActionRow({ Icon, label, subtitle, href, variant = "neutral", locale = DEFAULT_LOCALE }: StatusActionRowProps) {
  const t = getTranslations(dashboardTranslations, locale);
  const colors = colorStyles[variant];

  return (
    <a
      href={href}
      className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3 transition-colors ${colors.bg} ${colors.border} ${colors.hoverBg} ${colors.hoverBorder} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2`}
      aria-label={`Go to ${label}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon className={`h-5 w-5 shrink-0 ${colors.icon}`} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-neutral-900 text-sm leading-tight mb-1">{label}</div>
          <div className="text-neutral-700 text-sm">{subtitle}</div>
        </div>
      </div>
      <span className={`shrink-0 inline-flex items-center rounded-md px-3 py-1.5 font-semibold text-sm transition-colors ${colors.link} ${colors.linkHover}`}>
        <span>{t.goTo}</span>
        <ChevronRight className={`ml-2 h-4 w-4 ${colors.link} self-center`} />
      </span>
    </a>
  );
}
