"use client";

import { LayoutDashboard, LogIn } from "lucide-react";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import useHomeActiveSection from "@/hooks/useActiveSection";
import { browserClient } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase.types";
import AccountMenu, { AccountMenuMobile, type MenuListItemProps } from "./AccountMenu";
import Navigation from "./Navigation";

export interface NavbarProps {
  profile?: Profile | null;
}


const logo = { url: "/", alt: "Logo", title: "The Safety Game" };
const actionItems = [{ label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> }];

export default function LandingNavigation({ profile }: NavbarProps): ReactElement {
  const { activeSection, navOpacity, scrolled } = useHomeActiveSection();

  const actions = <AccountMenu profile={profile} items={actionItems} />;
  const actionsMobile = <AccountMenuMobile profile={profile} items={actionItems} />;

  return (
    <Navigation
      logo={logo}
      actions={actions}
      actionsMobile={actionsMobile}
      activeSection={activeSection}
      navOpacity={navOpacity}
      scrolled={scrolled}
      isIndexPage={true}
    />
  );
}
