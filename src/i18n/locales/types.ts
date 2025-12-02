/**
 * Translation Types
 *
 * This file defines the structure of all translations.
 * All locale files must conform to this interface.
 */

// ============================================================================
// UI & Navigation
// ============================================================================

export interface NavContent {
  skipToContent: string;
  openMenu: string;
  closeMenu: string;
  dashboard: string;
  login: string;
  logout: string;
  account: string;
}

export interface CommonContent {
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

export interface SectionContent {
  challenge: string;
  instructions: string;
  participate: string;
  dates: string;
  leaderboard: string;
  team: string;
  faq: string;
}

export interface AuthContent {
  signOutError: string;
  signInPrompt: string;
  signUpPrompt: string;
}

export interface FooterContent {
  tagline: string;
  quickLinks: string;
  contacts: string;
  copyright: string;
  privacy: string;
}

export interface DashboardContent {
  title: string;
  welcome: string;
  noTeam: string;
  createTeam: string;
  joinTeam: string;
  submissions: string;
  dailyLimit: string;
  totalSubmissions: string;
}

export interface FormsContent {
  teamName: string;
  teamCode: string;
  email: string;
  password: string;
  required: string;
  invalidEmail: string;
  minLength: string;
  maxLength: string;
}

export interface ErrorsContent {
  generic: string;
  notFound: string;
  notFoundMessage: string;
  backToHome: string;
  unauthorized: string;
  networkError: string;
}

export interface MetaContent {
  siteTitle: string;
  siteDescription: string;
  notFoundTitle: string;
}

// ============================================================================
// Content Sections
// ============================================================================

export interface HomeContent {
  title: string;
  description: string;
  cta: string;
  kicker: string;
  learnMore: string;
  eventDates: string;
}

export interface IntroductionContent {
  content: string;
  emphasis?: boolean;
}

export interface ChallengeContent {
  title: string;
  description: string;
  introduction: readonly IntroductionContent[];
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

export interface LeaderboardContent {
  title: string;
  description: string;
  emptyMessage: string;
  rank: string;
  teamName: string;
  score: string;
  lastSubmission: string;
  loadError: string;
  scoreNote: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
}

export interface TeamContent {
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

export interface ParticipationContent {
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

export interface DatesContent {
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

export interface InstructionsContent {
  title: string;
  intro: string;
  cards: readonly InstructionCard[];
  exampleGroups: readonly InstructionExampleGroup[];
}

export interface PlaygroundContent {
  title: string;
  description: string;
  huggingFaceSpace: string;
  openInNewWindow: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  title: string;
  description: string;
  items: readonly FaqItem[];
}

// ============================================================================
// Main Translations Interface
// ============================================================================

export interface Translations {
  // UI
  nav: NavContent;
  common: CommonContent;
  sections: SectionContent;
  auth: AuthContent;
  footer: FooterContent;
  dashboard: DashboardContent;
  forms: FormsContent;
  errors: ErrorsContent;
  meta: MetaContent;

  // Content
  home: HomeContent;
  challenge: ChallengeContent;
  leaderboard: LeaderboardContent;
  team: TeamContent;
  participation: ParticipationContent;
  dates: DatesContent;
  instructions: InstructionsContent;
  faq: FaqContent;
}
