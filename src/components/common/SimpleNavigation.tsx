import { LayoutDashboard } from "lucide-react";
import type { ReactElement } from "react";
import { localizeUrl } from "@/lib/i18n";
import type { Profile } from "@/lib/supabase.types";
import { type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import AccountMenu from "./AccountMenu";
import Navigation from "./Navigation";
import type { MenuItem } from "./NavigationParts";

export interface SimpleNavProps {
  profile?: Profile | null;
  locale?: Locale;
}

export default function SimpleNavigation({ profile, locale = DEFAULT_LOCALE }: SimpleNavProps): ReactElement {
  const logo = { url: localizeUrl("/home", locale), alt: "Logo", title: "The Safety Game" };
  const menu: MenuItem[] = [{ title: "Home", url: localizeUrl("/home", locale) }];
  const items = [
    { label: "Dashboard", href: localizeUrl("/dashboard", locale), icon: <LayoutDashboard className="h-4 w-4" /> },
  ];

  const actions = <AccountMenu profile={profile} items={items} locale={locale} />;
  const actionsMobile = <AccountMenu profile={profile} items={items} locale={locale} />;

  return (
    <Navigation
      logo={logo}
      menu={menu}
      actions={actions}
      actionsMobile={actionsMobile}
      activeSection={null}
      navOpacity={1}
      locale={locale}
    />
  );
}
