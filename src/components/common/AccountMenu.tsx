"use client";

import { navigate } from "astro:transitions/client";
import { ChevronDown, LogIn, LogOut } from "lucide-react";
import type { MouseEventHandler, ReactElement } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Profile } from "@/lib/supabase.types";

const LOGOUT_TOAST_ID = "logout-error";
const SIGN_OUT_ERROR_MESSAGE = "Si è verificato un errore. Riprova.";

function showSignOutErrorToast() {
  toast.error(SIGN_OUT_ERROR_MESSAGE, {
    duration: 2000,
    position: "bottom-center",
    id: LOGOUT_TOAST_ID,
  });
}

const accountButtonClasses =
  "rounded-full border-white bg-black/50 py-1.5 pl-3 font-semibold text-sm text-white shadow-sm hover:bg-violet-800/40 hover:text-violet-200";
const loginButtonClasses =
  "rounded-full border-white bg-black/50 px-4 py-2 font-semibold text-base text-white shadow-sm hover:bg-violet-800/40 hover:text-violet-200 focus-visible:ring-2 focus-visible:ring-violet-800";

export type MenuListItemProps = {
  label: string;
  icon?: ReactElement;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  destructive?: boolean;
  className?: string;
};

export function MenuListItem({
  label,
  icon,
  href,
  onClick,
  destructive,
  className = "",
}: MenuListItemProps): ReactElement {
  const base = "flex w-full items-center justify-between";
  const classes = `${base} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          navigate(href);
        }}
        className={`${classes} rounded-sm px-2 py-1 hover:bg-accent hover:text-accent-foreground`}
        role="menuitem"
      >
        <span>{label}</span>
        {icon}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${classes} rounded-sm px-2 py-1 hover:bg-accent hover:text-accent-foreground ${destructive ? "text-destructive hover:bg-destructive/10 hover:text-destructive" : ""}`.trim()}
      role="menuitem"
    >
      <span>{label}</span>
      {icon}
    </button>
  );
}

const signOut: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = async (e) => {
  e.preventDefault();

  try {
    const result = await fetch("/api/auth/signout");

    if (!result.ok) {
      showSignOutErrorToast();
      console.error("Error signing out:", result.statusText);
      return;
    }

    navigate("/");
  } catch (err) {
    // Catch any network errors and display a toast
    showSignOutErrorToast();
    console.error("Error during sign-out request:", err);
  }
};

// Factory that returns a MenuListItem configured for logout. It accepts a
// className so callers (desktop/mobile) can pass their own styling.
const logoutItem = (className = "w-full"): ReactElement => (
  <MenuListItem
    onClick={signOut}
    label="Logout"
    icon={<LogOut className="h-4 w-4" />}
    className={className}
    destructive
  />
);

function getDisplayInfo(profile?: Profile) {
  const displayName = profile?.full_name || profile?.email || "";
  const displayEmail = profile?.email || "";
  const displayInitial = (displayName?.charAt(0) || "?").toUpperCase();

  return { displayName, displayEmail, displayInitial };
}

function AccountTriggerContent({ profile }: { profile?: Profile }): ReactElement {
  const { displayName, displayInitial } = getDisplayInfo(profile);

  return (
    <div className="flex items-center gap-1">
      <Avatar className="-ml-1 h-6 w-6">
        {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName || "Avatar"} />}
        <AvatarFallback className="bg-muted font-medium text-neutral-600 text-xs">{displayInitial}</AvatarFallback>
      </Avatar>
      <span className="max-w-[9rem] truncate pl-1 sm:max-w-[12rem]">{displayName}</span>
    </div>
  );
}

function UserLabel({ profile }: { profile?: Profile }): ReactElement {
  const { displayName, displayEmail } = getDisplayInfo(profile);

  return (
    <>
      <div className="font-semibold">{displayName}</div>
      <div className="break-all text-muted-foreground text-sm">{displayEmail}</div>
    </>
  );
}

export interface AccountMenuProps {
  profile?: Profile;
  items?: MenuListItemProps[];
}

export default function AccountMenu({ profile, items }: AccountMenuProps): ReactElement | null {
  if (!profile) {
    return (
      <div className="flex gap-2">
        <Button asChild variant="outline" className={loginButtonClasses}>
          <a href="/login" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            <span>Accedi</span>
          </a>
        </Button>
      </div>
    );
  }

  const { displayName, displayEmail } = getDisplayInfo(profile);

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={accountButtonClasses}
            aria-label={`Account menu for ${displayName || displayEmail || "Account"}`}
          >
            <AccountTriggerContent profile={profile} />
            <ChevronDown className="relative top-px ml-1 size-3 transition duration-300 data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-xl p-2">
          <DropdownMenuLabel className="px-3 py-2 text-left">
            <UserLabel profile={profile} />
          </DropdownMenuLabel>
          {items?.map((item: MenuListItemProps) => (
            <DropdownMenuItem asChild className="w-full px-3 py-2" key={item.label}>
              <MenuListItem {...item} className={["w-full", item.className].filter(Boolean).join(" ")} />
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild className="w-full px-3 py-2">
            {logoutItem("w-full")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function AccountMenuMobile({ profile, items }: AccountMenuProps): ReactElement | null {
  if (!profile)
    return (
      <a href="/login" className="flex w-full items-center justify-between py-1.5">
        <span>Accedi</span>
        <LogIn className="h-4 w-4" />
      </a>
    );

  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="py-1 text-left">
        <UserLabel profile={profile} />
      </div>

      {items?.map((item: MenuListItemProps) => (
        <MenuListItem key={item.label} {...item} className={[item.className, "py-1.5"].filter(Boolean).join(" ")} />
      ))}

      {logoutItem("w-full py-1.5 text-left")}
    </div>
  );
}
