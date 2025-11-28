type Section = {
  id: string;
  label: string;
};

const sections = {
  instructions: { id: "instructions", label: "Istruzioni" },
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

export const navigationLinks = [
  sections.participate,
  sections.dates,
  sections.instructions,
  sections.leaderboard,
  sections.team,
  sections.faq,
].map((section) => toAnchorLink(section));

export const footerQuickLinks = [
  { section: sections.leaderboard, label: "Leaderboard" },
  { section: sections.participate },
  { section: sections.instructions },
  { section: sections.faq },
].map(({ section, label }) => toAnchorLink(section, label));

export type NavigationLink = (typeof navigationLinks)[number];
export type FooterQuickLink = (typeof footerQuickLinks)[number];
