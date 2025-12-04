import type {
  AuthContent,
  CommonContent,
  DashboardContent,
  ErrorsContent,
  FooterContent,
  FormsContent,
  MetaContent,
  NavContent,
  SectionContent,
} from "../types";

export const nav: NavContent = {
  skipToContent: "Salta al contenuto principale",
  openMenu: "Apri il menu",
  closeMenu: "Chiudi il menu",
  home: "Home",
  dashboard: "Dashboard",
  login: "Accedi",
  logout: "Esci",
  account: "Account",
};

export const common: CommonContent = {
  loading: "Caricamento...",
  error: "Si è verificato un errore",
  retry: "Riprova",
  save: "Salva",
  cancel: "Annulla",
  confirm: "Conferma",
  back: "Indietro",
  next: "Avanti",
  submit: "Invia",
};

export const sections: SectionContent = {
  challenge: "La Sfida",
  instructions: "Istruzioni",
  participate: "Partecipa",
  dates: "Date Importanti",
  leaderboard: "Leaderboard",
  team: "Il Team",
  faq: "FAQ",
};

export const auth: AuthContent = {
  signOutError: "Si è verificato un errore. Riprova.",
  signInPrompt: "Accedi per continuare",
  signUpPrompt: "Crea un account",
};

export const footer: FooterContent = {
  tagline: "Una competizione di prompt engineering etico organizzata dal laboratorio di ricerca in AI Safety.",
  quickLinks: "Link Rapidi",
  contacts: "Contatti",
  copyright: "Tutti i diritti riservati.",
  privacy: "Privacy Policy",
};

export const dashboard: DashboardContent = {
  title: "Dashboard",
  welcome: "Bentornato",
  noTeam: "Non fai ancora parte di un team",
  createTeam: "Crea Team",
  joinTeam: "Unisciti a un Team",
  submissions: "Sottomissioni",
  dailyLimit: "Limite Giornaliero",
  totalSubmissions: "Sottomissioni Totali",
};

export const forms: FormsContent = {
  teamName: "Nome del Team",
  teamCode: "Codice Team",
  email: "Email",
  password: "Password",
  required: "Questo campo è obbligatorio",
  invalidEmail: "Indirizzo email non valido",
  minLength: "Minimo {min} caratteri",
  maxLength: "Massimo {max} caratteri",
};

export const errors: ErrorsContent = {
  generic: "Qualcosa è andato storto. Riprova.",
  notFound: "Pagina non trovata",
  notFoundMessage: "La pagina che stai cercando non esiste o è stata spostata.",
  backToHome: "Torna alla home",
  unauthorized: "Non sei autorizzato a visualizzare questa pagina",
  networkError: "Errore di rete. Controlla la connessione.",
};

export const meta: MetaContent = {
  siteTitle: "The Safety Game",
  siteDescription: "The Safety Game - Hackathon organizzato da MIND, Università di Milano Bicocca",
  notFoundTitle: "Pagina non trovata | The Safety Game",
};
