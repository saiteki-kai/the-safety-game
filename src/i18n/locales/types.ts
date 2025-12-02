/**
 * Translation Types
 *
 * This file defines the structure of all translations.
 * All locale files must conform to this interface.
 */

// ============================================================================
// UI & Navigation
// ============================================================================

export interface NavTranslations {
  skipToContent: string;
  openMenu: string;
  closeMenu: string;
  dashboard: string;
  login: string;
  logout: string;
  account: string;
}

export interface CommonTranslations {
  loading: string;
  error: string;
  retry: string;
  save: string;
  cancel: string;
  confirm: string;
  back: string;
  next: string;
  submit: string;
}

export interface SectionTranslations {
  challenge: string;
  instructions: string;
  participate: string;
  dates: string;
  leaderboard: string;
  team: string;
  faq: string;
}

export interface AuthTranslations {
  signOutError: string;
  signInPrompt: string;
  signUpPrompt: string;
}

export interface FooterTranslations {
  tagline: string;
  quickLinks: string;
  contacts: string;
  copyright: string;
  privacy: string;
}

export interface DashboardTranslations {
  title: string;
  welcome: string;
  noTeam: string;
  createTeam: string;
  joinTeam: string;
  submissions: string;
  dailyLimit: string;
  totalSubmissions: string;
}

export interface FormsTranslations {
  teamName: string;
  teamCode: string;
  email: string;
  password: string;
  required: string;
  invalidEmail: string;
  minLength: string;
  maxLength: string;
}

export interface ErrorsTranslations {
  generic: string;
  notFound: string;
  notFoundMessage: string;
  backToHome: string;
  unauthorized: string;
  networkError: string;
}

export interface MetaTranslations {
  siteTitle: string;
  siteDescription: string;
  notFoundTitle: string;
}

// ============================================================================
// Content Sections
// ============================================================================

export interface HomeTranslations {
  title: string;
  description: string;
  cta: string;
  kicker: string;
  learnMore: string;
  eventDates: string;
}

export interface IntroductionParagraph {
  content: string;
  emphasis?: boolean;
}

export interface ChallengeTranslations {
  title: string;
  description: string;
  introduction: readonly IntroductionParagraph[];
  what: string;
  challengeText: string;
  participation: string;
  // Card labels
  objectiveLabel: string;
  challengeLabel: string;
  participationLabel: string;
  prizesLabel: string;
  prizesDescription: string;
  llmLabel: string;
  tagline: string;
}

export interface LeaderboardTranslations {
  title: string;
  description: string;
  emptyMessage: string;
  rank: string;
  teamName: string;
  score: string;
  scoreNote: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
}

export interface TeamTranslations {
  title: string;
  description: string;
  members: readonly TeamMember[];
}

export interface RegistrationInfo {
  label: string;
  description: string;
  afterLogin: string;
}

export interface PrivacyInfo {
  label: string;
  description: string;
}

export interface SubmissionInfo {
  label: string;
  howItWorks: string;
  warning: string;
}

export interface EvaluationInfo {
  label: string;
  overview: string;
  scoring: string;
}

export interface ParticipationTranslations {
  title: string;
  intro: string;
  registration: RegistrationInfo;
  privacy: PrivacyInfo;
  submission: SubmissionInfo;
  evaluation: EvaluationInfo;
}

export type TimelineStatus = "completed" | "upcoming";

export interface TimelineEntry {
  date: string;
  time?: string;
  title: string;
  description: string;
  status: TimelineStatus;
}

export interface DatesTranslations {
  title: string;
  timeline: readonly TimelineEntry[];
  emptyMessage: string;
}

export type InstructionCardVariant = "objective" | "positive" | "negative" | "warning";

export interface InstructionCard {
  variant: InstructionCardVariant;
  title: string;
  description?: string;
  items?: readonly string[];
}

export type InstructionExampleVariant = "valid" | "invalid" | "mixed";

export interface InstructionExamplePrompt {
  label: string;
  prompt: string;
  note?: string;
}

export interface InstructionExampleGroup {
  variant: InstructionExampleVariant;
  title: string;
  description?: string;
  prompts: readonly InstructionExamplePrompt[];
}

export interface InstructionsTranslations {
  title: string;
  intro: string;
  cards: readonly InstructionCard[];
  exampleGroups: readonly InstructionExampleGroup[];
}

export interface PlaygroundTranslations {
  title: string;
  description: string;
  huggingFaceSpace: string;
  openInNewWindow: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqTranslations {
  title: string;
  description: string;
  items: readonly FaqItem[];
}

// ============================================================================
// Main Translations Interface
// ============================================================================

export interface Translations {
  // UI
  nav: NavTranslations;
  common: CommonTranslations;
  sections: SectionTranslations;
  auth: AuthTranslations;
  footer: FooterTranslations;
  dashboard: DashboardTranslations;
  forms: FormsTranslations;
  errors: ErrorsTranslations;
  meta: MetaTranslations;

  // Content
  home: HomeTranslations;
  challenge: ChallengeTranslations;
  leaderboard: LeaderboardTranslations;
  team: TeamTranslations;
  participation: ParticipationTranslations;
  dates: DatesTranslations;
  instructions: InstructionsTranslations;
  playground: PlaygroundTranslations;
  faq: FaqTranslations;
}
