import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type StatusActionRowProps = {
  Icon: LucideIcon;
  label: string;
  subtitle: string;
  href: string;
};

export default function StatusActionRow({ Icon, label, subtitle, href }: StatusActionRowProps) {
  const { t } = useTranslation("dashboard");

  return (
    <div
      className={`flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 transition-colors hover:border-neutral-200 hover:bg-neutral-100`}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-neutral-600" />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-neutral-800 text-sm">{label}</div>
          <div className="text-neutral-500 text-xs">{subtitle}</div>
        </div>
      </div>
      <a
        href={href}
        className="font-medium text-blue-600 text-sm transition-colors hover:text-blue-700"
        aria-label={t("status.goToLabel", { label })}
      >
        {t("status.goTo")}
      </a>
    </div>
  );
}
