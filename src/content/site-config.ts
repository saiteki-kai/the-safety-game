type Section = {
  id: string;
  label: string;
};

const sections = {
  instructions: { id: "instructions", label: "Istruzioni" },
  challenge: { id: "challenge", label: "La Sfida" },
  participate: { id: "participate", label: "Partecipa" },
  dates: { id: "dates", label: "Date Importanti" },
  leaderboard: { id: "leaderboard", label: "Leaderboard" },
  team: { id: "team", label: "Il Team" },
  faq: { id: "faq", label: "FAQ" },
} as const satisfies Record<string, Section>;

const toAnchorLink = (section: Section, label?: string) => ({
  href: `#${section.id}`,
  label: label ?? section.label,
});

const toRouteLink = (href: string, label: string) => ({ href, label });

export const navigationLinks = [
  sections.challenge,
  sections.instructions,
  sections.participate,
  sections.dates,
  sections.leaderboard,
  sections.team,
  sections.faq,
].map((section) => toAnchorLink(section));

export const footerQuickLinks = [toRouteLink("/home", "Home"), toRouteLink("/dashboard", "Dashboard")];

export type NavigationLink = (typeof navigationLinks)[number];
export type FooterQuickLink = (typeof footerQuickLinks)[number];
