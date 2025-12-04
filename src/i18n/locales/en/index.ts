import type { Translations } from "../types";
import { challenge } from "./challenge";
import { dates } from "./dates";
import { faq } from "./faq";
// Content translations
import { home } from "./home";
import { instructions } from "./instructions";
import { leaderboard } from "./leaderboard";
import { participation } from "./participation";
import { team } from "./team";
// UI translations
import { auth, common, dashboard, errors, footer, forms, meta, nav, sections } from "./ui";

/**
 * English translations
 */
const en: Translations = {
  // UI
  nav,
  common,
  sections,
  auth,
  footer,
  dashboard,
  forms,
  errors,
  meta,

  // Content
  home,
  challenge,
  leaderboard,
  team,
  participation,
  dates,
  instructions,
  faq,
};

export default en;

// Re-export individual modules for direct access
export {
  // UI
  nav,
  common,
  sections,
  auth,
  footer,
  dashboard,
  forms,
  errors,
  meta,
  // Content
  home,
  challenge,
  leaderboard,
  team,
  participation,
  dates,
  instructions,
  faq,
};
