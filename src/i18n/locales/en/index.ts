import type { Translations } from "../types";

// UI translations
import {
  nav,
  common,
  sections,
  auth,
  footer,
  dashboard,
  forms,
  errors,
  meta,
} from "./ui";

// Content translations
import { home } from "./home";
import { challenge } from "./challenge";
import { leaderboard } from "./leaderboard";
import { team } from "./team";
import { participation } from "./participation";
import { dates } from "./dates";
import { instructions } from "./instructions";
import { faq } from "./faq";

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
