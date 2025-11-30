"use client";

import AccountMenu, { AccountMenuMobile } from "./AccountMenu";
import Navigation from "./Navigation";
import type { MenuItem } from "./NavigationParts";
import type { Profile } from "@/lib/supabase.types";

type DashboardNavProps = {
  profile?: Profile | null;
};

export default function DashboardNav({ profile }: DashboardNavProps) {

  const logo = { url: "/", alt: "Logo", title: "The Safety Game" };
  const menu: MenuItem[] = [{ title: "Home", url: "/" }];

  const actions = <AccountMenu profile={profile} />;
  const actionsMobile = <AccountMenuMobile profile={profile} />;

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
