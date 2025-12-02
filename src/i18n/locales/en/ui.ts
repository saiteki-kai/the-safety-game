import type {
  NavContent,
  CommonContent,
  SectionContent,
  AuthContent,
  FooterContent,
  DashboardContent,
  FormsContent,
  ErrorsContent,
  MetaContent,
} from "../types";

export const nav: NavContent = {
  skipToContent: "Skip to main content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  home: "Home",
  dashboard: "Dashboard",
  login: "Login",
  logout: "Logout",
  account: "Account",
};

export const common: CommonContent = {
  loading: "Loading...",
  error: "An error occurred",
  retry: "Retry",
  save: "Save",
  cancel: "Cancel",
  confirm: "Confirm",
  back: "Back",
  next: "Next",
  submit: "Submit",
};

export const sections: SectionContent = {
  challenge: "The Challenge",
  instructions: "Instructions",
  participate: "Participate",
  dates: "Important Dates",
  leaderboard: "Leaderboard",
  team: "The Team",
  faq: "FAQ",
};

export const auth: AuthContent = {
  signOutError: "An error occurred. Please try again.",
  signInPrompt: "Sign in to continue",
  signUpPrompt: "Create an account",
};

export const footer: FooterContent = {
  tagline: "An ethical prompt engineering competition organized by the AI Safety research laboratory.",
  quickLinks: "Quick Links",
  contacts: "Contacts",
  copyright: "All rights reserved.",
  privacy: "Privacy Policy",
};

export const dashboard: DashboardContent = {
  title: "Dashboard",
  welcome: "Welcome back",
  noTeam: "You are not part of a team yet",
  createTeam: "Create Team",
  joinTeam: "Join Team",
  submissions: "Submissions",
  dailyLimit: "Daily Limit",
  totalSubmissions: "Total Submissions",
};

export const forms: FormsContent = {
  teamName: "Team Name",
  teamCode: "Team Code",
  email: "Email",
  password: "Password",
  required: "This field is required",
  invalidEmail: "Invalid email address",
  minLength: "Minimum {min} characters",
  maxLength: "Maximum {max} characters",
};

export const errors: ErrorsContent = {
  generic: "Something went wrong. Please try again.",
  notFound: "Page not found",
  notFoundMessage: "Sorry, we couldn't find the page you were looking for.",
  backToHome: "Back to home",
  unauthorized: "You are not authorized to view this page",
  networkError: "Network error. Check your connection.",
};

export const meta: MetaContent = {
  siteTitle: "The Safety Game",
  siteDescription: "The Safety Game - Hackathon organized by MIND, University of Milan Bicocca",
  notFoundTitle: "Page not found | The Safety Game",
};
