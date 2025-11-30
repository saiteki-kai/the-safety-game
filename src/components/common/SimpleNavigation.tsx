"use client";

import type { ReactElement } from "react";
import AccountMenu from "./AccountMenu";
import Navigation from "./Navigation";
import type { MenuItem } from "./NavigationParts";
import { LayoutDashboard } from "lucide-react";
import type { Profile } from "@/lib/supabase.types";

const logo = { url: "/", alt: "Logo", title: "The Safety Game" };
const menu: MenuItem[] = [{ title: "Home", url: "/" }];
const actionItems = [{ label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> }];

export interface SimpleNavProps {
  profile?: Profile;
}

export default function SimpleNavigation({ profile }: SimpleNavProps): ReactElement {
  return (
    <Navigation
      logo={logo}
      menu={menu}
      actions={<AccountMenu profile={profile} items={actionItems} />}
      actionsMobile={<AccountMenu profile={profile} items={actionItems} />}
      activeSection={null}
      navOpacity={1}
      scrolled={false}
    />
  );
}
