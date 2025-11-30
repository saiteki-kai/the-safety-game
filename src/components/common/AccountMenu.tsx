"use client";

import { navigate } from "astro:transitions/client";
import { ChevronDown, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { type ReactElement, type MouseEventHandler, useCallback } from "react";
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
// A stable id used to avoid spammy duplicate toasts
const LOGOUT_TOAST_ID = "logout-error";

// Small Tailwind CSS helpers to keep classnames consistent
const accountButtonClasses =
  "rounded-full border-white bg-black/50 py-1.5 pl-3 font-semibold text-sm text-white shadow-sm hover:bg-violet-800/40 hover:text-violet-200";
const loginButtonClasses =
  "rounded-full border-white bg-black/50 px-4 py-2 font-semibold text-base text-white shadow-sm hover:bg-violet-800/40 hover:text-violet-200 focus-visible:ring-2 focus-visible:ring-violet-800";

async function defaultSignOut(): Promise<void> {
  try {
    const result = await fetch("/api/auth/signout");

    if (!result.ok) {
      toast.error("Si è verificato un errore. Riprova.", {
        duration: 2000,
        position: "bottom-center",
        id: LOGOUT_TOAST_ID,
      });

      console.error("Error signing out:", result.statusText);
      return;
    }

    navigate("/login");
  } catch (err) {
    // Catch any network errors and display a toast
    toast.error("Si è verificato un errore. Riprova.", {
      duration: 2000,
      position: "bottom-center",
      id: LOGOUT_TOAST_ID,
    });
    console.error("Error during sign-out request:", err);
  }
}

/**
 * signOut: wrapper that invokes the provided onSignOut (if any) or falls back
 * to the default API signout + redirect flow.
 */
async function signOut(onSignOut?: () => Promise<void> | void): Promise<void> {
  try {
    if (onSignOut) {
      // Allow callers to handle sign out; await to preserve async behavior
      await onSignOut();
      return;
    }
    await defaultSignOut();
  } catch (err) {
    // Display a toast and log the error
    toast.error("Si è verificato un errore. Riprova.", {
      duration: 2000,
      position: "bottom-center",
      id: LOGOUT_TOAST_ID,
    });
    console.error("Error signing out:", err);
  }
}

/**
 * Hook to provide a stable sign out handler that delegates to the signOut
 * helper while keeping references stable across renders for useCallback.
 */
function useSignOut(onSignOut?: () => Promise<void> | void) {
  return useCallback(async () => signOut(onSignOut), [onSignOut]);
}

/**
 * MenuListItem implements a list-like nav item used by the menu.
 * It renders an anchor when a `href` is provided, or a button when an
 * `onClick` is provided, keeping a consistent layout between desktop
 * and mobile views.
 */
export type MenuListItemProps = {
  label: string;
  icon?: ReactElement;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  destructive?: boolean;
  className?: string;
};

/** A single menu item rendered as an anchor (when href) or a button (when onClick).
 * This component creates the visual and structural pattern for the Account menu
 * helping keep desktop and mobile variants consistent.
 */
export function MenuListItem({ label, icon, href, onClick, destructive, className = "" }: MenuListItemProps): ReactElement {
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
        className={classes}
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
      className={`${classes} ${destructive ? "text-destructive" : ""}`.trim()}
      role="menuitem"
    >
      <span>{label}</span>
      {icon}
    </button>
  );
}

/**
 * LogoutMenuItem — small wrapper that takes a generic onClick sign-out handler
 * (async or sync) and maps it to the MouseEventHandler expected by MenuListItem.
 */
function LogoutMenuItem({ onClick, className }: { onClick?: () => Promise<void> | void; className?: string }): ReactElement {
  const handler: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = (e) => {
    e.preventDefault();
    // fire and forget; callers will display toasts / navigate as needed
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    void onClick?.();
  };

  return <MenuListItem onClick={handler} label="Logout" icon={<LogOut className="h-4 w-4" />} className={className} destructive />;
}

/**
 * Utility to avoid recomputing display values across the file.
 */
function getDisplayInfo(profile?: Profile) {
  const displayName = (profile?.full_name || profile?.email) || "";
  const displayEmail = profile?.email || "";
  const displayInitial = (displayName?.charAt(0) || "?").toUpperCase();

  return { displayName, displayEmail, displayInitial };
}

/**
 * Compact trigger content used by the Dropdown Trigger button.
 * Keeps the grid layout consistent between desktop and mobile triggers.
 */
function AccountTriggerContent({ profile }: { profile?: Profile }): ReactElement {
  const { displayName, displayEmail, displayInitial } = getDisplayInfo(profile);

  return (
    <div className="flex items-center gap-1">
      <Avatar className="-ml-1 h-6 w-6">
        {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={displayName || "Avatar"} />
        ) : (
          <AvatarFallback className="bg-muted font-medium text-neutral-600 text-xs">{displayInitial}</AvatarFallback>
        )}
      </Avatar>
      <span className="max-w-[9rem] truncate pl-1 sm:max-w-[12rem]">{displayName || displayEmail}</span>
    </div>
  );
}

/**
 * Simple label component used as the dropdown top label and the mobile header.
 */
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
  onSignOut?: () => Promise<void> | void;
}

/**
 * Account menu for the desktop view.
 */
export default function AccountMenu({ profile, items, onSignOut }: AccountMenuProps): ReactElement | null {
  const handleSignOut = useSignOut(onSignOut);

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
  const effectiveDesktopItems: MenuListItemProps[] = items ?? [];



  return (
    <div className="flex items-center gap-3">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" className={accountButtonClasses} aria-label={`Account menu for ${displayName || displayEmail || "Account"}`}>
              <AccountTriggerContent profile={profile} />
              <ChevronDown className="relative top-px ml-1 size-3 transition duration-300 data-[state=open]:rotate-180" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-xl p-2">
          <DropdownMenuLabel className="px-3 py-2 text-left">
            <UserLabel profile={profile} />
          </DropdownMenuLabel>
          {effectiveDesktopItems.map((item: MenuListItemProps) => (
            <DropdownMenuItem asChild className="w-full px-3 py-2" key={item.label}>
              <MenuListItem {...item} className={["w-full", item.className].filter(Boolean).join(" ")} />
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild className="w-full px-3 py-2">
            <LogoutMenuItem onClick={handleSignOut} className="w-full" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function AccountMenuMobile({ profile, items, onSignOut }: AccountMenuProps): ReactElement | null {
  const handleSignOut = useSignOut(onSignOut);

  if (!profile)
    return (
      <a href="/login" className="flex w-full items-center justify-between py-1.5">
        <span>Accedi</span>
        <LogIn className="h-4 w-4" />
      </a>
    );


  const effectiveItems: MenuListItemProps[] = items ?? (profile ? [{ label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> }] : []);

  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="py-1 text-left">
        <UserLabel profile={profile} />
      </div>

      {effectiveItems.map((item: MenuListItemProps) => (
  <MenuListItem key={item.label} {...item} className={[item.className, "py-1.5"].filter(Boolean).join(" ")} />
      ))}

  <LogoutMenuItem onClick={handleSignOut} className="w-full py-1.5 text-left" />
    </div>
  );
}
