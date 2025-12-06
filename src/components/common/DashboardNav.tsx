"use client";

import { localizeUrl } from "@/lib/i18n";
import type { Profile } from "@/lib/supabase.types";
import AccountMenu, { AccountMenuMobile } from "./AccountMenu";
import Navigation from "./Navigation";
import type { MenuItem } from "./NavigationParts";

type DashboardNavProps = {
  profile?: Profile | null;
  menu?: MenuItem[];
};

const defaultMenu: MenuItem[] = [{ title: "Home", url: localizeUrl("/home") }];

export default function DashboardNav({ profile, menu = defaultMenu }: DashboardNavProps) {
  const logo = { url: localizeUrl("/home"), alt: "Logo", title: "The Safety Game" };

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
