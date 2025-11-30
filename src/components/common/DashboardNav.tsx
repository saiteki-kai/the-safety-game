"use client";

import type { Profile } from "@lib/supabase.types";
import AccountMenu, { AccountMenuMobile } from "./AccountMenu";
import Navigation from "./Navigation";
import type { MenuItem } from "./NavigationParts";

type DashboardNavProps = {
  user: Profile;
};

export default function DashboardNav({ user }: DashboardNavProps) {
  const dashboardMenu: MenuItem[] = [{ title: "Home", url: "/" }];

  const actions = <AccountMenu profile={user} />;
  const actionsMobile = <AccountMenuMobile profile={user} />;

  return (
    <Navigation
      logo={{ url: "/", title: "The Safety Game", alt: "Logo" }}
      menu={dashboardMenu}
      actions={actions}
      actionsMobile={actionsMobile}
      activeSection={null}
      navOpacity={1}
      scrolled={false}
    />
  );
}
