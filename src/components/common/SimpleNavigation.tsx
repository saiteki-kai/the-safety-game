"use client";

import { LayoutDashboard } from "lucide-react";
import type { ReactElement } from "react";
import type { Profile } from "@/lib/supabase.types";
import AccountMenu from "./AccountMenu";
import Navigation from "./Navigation";
import type { MenuItem } from "./NavigationParts";

export interface SimpleNavProps {
  profile?: Profile | null;
}

export default function SimpleNavigation({ profile }: SimpleNavProps): ReactElement {
  const logo = { url: "/", alt: "Logo", title: "The Safety Game" };
  const menu: MenuItem[] = [{ title: "Home", url: "/" }];
  const items = [{ label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> }];

  const actions = <AccountMenu profile={profile} items={items} />;
  const actionsMobile = <AccountMenu profile={profile} items={items} />;

  return (
    <Navigation
      logo={logo}
      menu={menu}
      actions={actions}
      actionsMobile={actionsMobile}
      activeSection={null}
      navOpacity={1}
    />
  );
}
