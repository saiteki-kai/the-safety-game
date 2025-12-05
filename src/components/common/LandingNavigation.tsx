"use client";

import { LayoutDashboard } from "lucide-react";
import type { ReactElement } from "react";
import useHomeActiveSection from "@/hooks/useActiveSection";
import { localizeUrl } from "@/i18n/utils";
import type { Profile } from "@/lib/supabase.types";
import AccountMenu, { AccountMenuMobile } from "./AccountMenu";
import Navigation from "./Navigation";

export interface LandingNavProps {
  profile?: Profile | null;
}

export default function LandingNavigation({ profile }: LandingNavProps): ReactElement {
  const { activeSection, navOpacity } = useHomeActiveSection();

  const logo = { url: localizeUrl("/home"), alt: "Logo", title: "The Safety Game" };
  const items = [
    { label: "Dashboard", href: localizeUrl("/dashboard"), icon: <LayoutDashboard className="h-4 w-4" /> },
  ];

  const actions = <AccountMenu profile={profile} items={items} />;
  const actionsMobile = <AccountMenuMobile profile={profile} items={items} />;

  return (
    <Navigation
      logo={logo}
      actions={actions}
      actionsMobile={actionsMobile}
      activeSection={activeSection}
      navOpacity={navOpacity}
      isIndexPage={true}
    />
  );
}
