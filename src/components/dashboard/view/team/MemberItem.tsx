import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { useTranslation } from "@providers/I18nContext";
import type { Profile } from "@/lib/supabase.types";

type MemberItemProps = {
  member: Profile | null;
};

export default function MemberItem({ member }: MemberItemProps) {
  const { t } = useTranslation("dashboard");
  const isPlaceholder = member === null;
  const displayName = isPlaceholder ? t("team.availableSlot") : member?.full_name?.trim?.() || "?";
  const initials = isPlaceholder ? " " : (displayName.charAt(0) ?? "").toUpperCase();

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
        isPlaceholder
          ? "border border-neutral-200 border-dashed bg-neutral-50 text-neutral-500"
          : "border border-neutral-100 bg-white hover:bg-neutral-50"
      }`}
    >
      <Avatar
        className={`h-8 w-8 shrink-0 border ${isPlaceholder ? "border-neutral-300 border-dashed bg-neutral-50" : "border-neutral-200 bg-white"}`}
      >
        {!isPlaceholder && <AvatarImage src={member?.avatar_url} alt={member?.full_name ?? undefined} />}
        <AvatarFallback
          className={`font-semibold text-xs ${isPlaceholder ? "bg-neutral-50 text-neutral-400" : "bg-neutral-100 text-neutral-600"}`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className={`font-medium text-sm ${isPlaceholder ? "text-neutral-500" : "text-neutral-900"}`}>
          {displayName}
        </div>
        {!isPlaceholder && member?.email && <div className="truncate text-neutral-500 text-xs">{member.email}</div>}
      </div>
    </div>
  );
}
