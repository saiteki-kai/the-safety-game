/**
 * Centralized translations for the application.
 * Each namespace has Italian (it) and English (en) translations.
 */

export type Locale = "it" | "en";
export const DEFAULT_LOCALE: Locale = "it";
export const LOCALES: Locale[] = ["it", "en"];

// Helper type for translation dictionaries
type TranslationDict = Record<string, string | ((...args: any[]) => string)>;

// ============================================================================
// NAV TRANSLATIONS
// ============================================================================
export const navTranslations = {
  it: {
    skipToContent: "Salta al contenuto principale",
    home: "Home",
    dashboard: "Dashboard",
    login: "Accedi",
    logout: "Esci",
    account: "Account",
  },
  en: {
    skipToContent: "Skip to main content",
    home: "Home",
    dashboard: "Dashboard",
    login: "Login",
    logout: "Logout",
    account: "Account",
  },
} as const;

// ============================================================================
// SECTIONS TRANSLATIONS
// ============================================================================
export const sectionsTranslations = {
  it: {
    challenge: "La Sfida",
    instructions: "Istruzioni",
    participate: "Partecipa",
    dates: "Date Importanti",
    leaderboard: "Classifica",
    team: "Il Team",
    faq: "FAQ",
  },
  en: {
    challenge: "The Challenge",
    instructions: "Instructions",
    participate: "Participate",
    dates: "Important Dates",
    leaderboard: "Leaderboard",
    team: "The Team",
    faq: "FAQ",
  },
} as const;

// ============================================================================
// COMMON TRANSLATIONS
// ============================================================================
export const commonTranslations = {
  it: {
    error: "Si è verificato un errore",
    retry: "Riprova",
    save: "Salva",
    cancel: "Annulla",
    confirm: "Conferma",
    back: "Indietro",
    next: "Avanti",
    submit: "Invia",
    close: "Chiudi",
  },
  en: {
    error: "An error occurred",
    retry: "Retry",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    submit: "Submit",
    close: "Close",
  },
} as const;

// ============================================================================
// PAGINATION TRANSLATIONS
// ============================================================================
export const paginationTranslations = {
  it: {
    pageSize: "Righe per pagina",
    range: (from: number, to: number, total: number) => `${from} - ${to} di ${total}`,
    pageOf: (page: number, total: number) => `Pagina ${page} di ${total}`,
    first: "Prima",
    previous: "Precedente",
    next: "Successiva",
    last: "Ultima",
  },
  en: {
    pageSize: "Page size",
    range: (from: number, to: number, total: number) => `${from} - ${to} of ${total}`,
    pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
    first: "First",
    previous: "Previous",
    next: "Next",
    last: "Last",
  },
} as const;

// ============================================================================
// LEADERBOARD TRANSLATIONS
// ============================================================================
export const leaderboardTranslations = {
  it: {
    title: "Classifica",
    description: "La classifica sarà disponibile al termine della challenge.",
    emptyMessage: "Nessun team in classifica al momento. Riprova più tardi.",
    rank: "Posizione",
    teamName: "Team",
    score: "Punteggio",
    lastSubmission: "Ultima Consegna",
    loadError: "Impossibile caricare la classifica. Riprova più tardi.",
    scoreNote: "Il punteggio medio del tuo team è mostrato in classifica.",
  },
  en: {
    title: "Temporary Leaderboard",
    description: "The temporary leaderboard shows provisional results from the Playground.<br/>The rankings are updated in real-time.<br/>Final scores will be announced at the end of the challenge.",
    emptyMessage: "No teams are currently on the leaderboard. Please try again later.",
    rank: "Rank",
    teamName: "Team",
    score: "Score",
    lastSubmission: "Last submission",
    loadError: "Unable to load the leaderboard. Please try again later.",
    scoreNote: "Your team's highest score is shown in the leaderboard.",
  },
} as const;

// ============================================================================
// DASHBOARD TRANSLATIONS
// ============================================================================
export const dashboardTranslations = {
  it: {
    title: "Dashboard",
    welcome: "Bentornato",
    welcomeUser: (name: string) => `Bentornato, ${name}`,
    noTeam: "Non fai ancora parte di un team",
    createTeam: "Crea Team",
    joinTeam: "Unisciti a un Team",
    submissions: "Sottomissioni",
    dailyLimit: "Limite Giornaliero",
    totalSubmissions: "Sottomissioni Totali",
    daysRemaining: (count: number) => count === 0 ? "Challenge terminata" : count === 1 ? "1 giorno rimanente" : `${count} giorni rimanenti`,
    teamOverview: "Panoramica Team",
    teamCode: "Codice Team",
    teamMembers: "Membri del Team",
    leaderboardPosition: "Posizione in Classifica",
    averageScore: "Punteggio Medio",
    highestScore: "Punteggio Più Alto",
    dailySubmission: "Area Submission Giornaliera",
    submissionHistory: "Storico Submission",
    teamDescription: "Monitora i progressi accedendo facilmente all'area di playground.",
    yourTeam: "Il tuo Team",
    teamManageDescription: "Gestisci i membri del tuo team e condividi il codice di invito",
    inviteCode: "Codice Invito",
    challengeProgress: "Progresso Challenge",
    progressDescription: "Monitora i tuoi progressi e risultati ottenuti nel playground",
    playgroundGradientHint: "Considera vari aspetti culturali e rendi i tuoi prompt creativi!",
    performance: "Performance",
    promptsSubmitted: "Prompt Inviati",
    challengeStatus: "Stato Challenge",
    dailySubmissions: "Playground Submissions",
    dailySubmissionDone: "Hai effettuato l'invio giornaliero.",
    dailySubmissionRemaining: (count: number) => `Puoi ancora inviare ${count} prompt oggi`,
    finalSubmission: "Final Submission",
    alreadySubmitted: "Già inviato",
    waitingSubmission: "In attesa di consegna",
    daysRemainingLabel: "Giorni Rimanenti",
    leaderboardRank: "Posto in Classifica",
    chatgptBeaten: "ChatGPT Superato",
    chatgptToBeat: "ChatGPT da superare",
    // Team section
    availableSlot: "Slot disponibile",
    codeCopied: "Codice copiato negli appunti",
    codeCopyFailed: "Impossibile copiare il codice negli appunti",
    // Status
    goTo: "Vai →",
  },
  en: {
    title: "Dashboard",
    welcome: "Welcome back",
    welcomeUser: (name: string) => `Welcome back, ${name}`,
    noTeam: "You are not part of a team yet",
    createTeam: "Create Team",
    joinTeam: "Join Team",
    submissions: "Submissions",
    dailyLimit: "Daily Limit",
    totalSubmissions: "Total Submissions",
    daysRemaining: (count: number) => count === 0 ? "Challenge ended" : count === 1 ? "1 day remaining" : `${count} days remaining`,
    teamOverview: "Team Overview",
    teamCode: "Team Code",
    teamMembers: "Team Members",
    leaderboardPosition: "Leaderboard Position",
    averageScore: "Average Score",
    highestScore: "Highest Score",
    dailySubmission: "Daily Submission Area",
    submissionHistory: "Submission History",
    teamDescription: "Manage your team members, monitor progress and easily access the daily submission area.",
    yourTeam: "Your Team",
    teamManageDescription: "Manage your team members and share the invite code",
    inviteCode: "Invite Code",
    challengeProgress: "Challenge Progress",
    progressDescription: "Monitor your progress and results",
    playgroundGradientHint: "Consider different cultural aspects and make your prompts creative!",
    performance: "Performance",
    promptsSubmitted: "Prompts Submitted",
    challengeStatus: "Challenge Status",
    dailySubmissions: "Playground Submissions",
    dailySubmissionDone: "You have already submitted today.",
    dailySubmissionRemaining: (count: number) => `You can still submit ${count} prompts today`,
    finalSubmission: "Final Submission",
    alreadySubmitted: "Already submitted",
    waitingSubmission: "Waiting for submission",
    daysRemainingLabel: "Days Remaining",
    leaderboardRank: "Leaderboard Rank",
    chatgptBeaten: "ChatGPT Beaten",
    chatgptToBeat: "ChatGPT to beat",
    // Team section
    availableSlot: "Available slot",
    codeCopied: "Code copied to clipboard",
    codeCopyFailed: "Failed to copy code to clipboard",
    // Status
    goTo: "Go →",
  },
} as const;

// ============================================================================
// HISTORY TRANSLATIONS
// ============================================================================
export const historyTranslations = {
  it: {
    title: "Storico Submission",
    description: "Consulta i punteggi assegnati ad ogni prompt inviato dal tuo team.",
    columnPrompt: "Prompt",
    columnDate: "Ultimo invio",
    columnScore: "Punteggio",
    emptyTitle: "Nessun risultato",
    emptyDescription: "Non ci sono dati da mostrare.",
  },
  en: {
    title: "Submission History",
    description: "Check the scores assigned to each prompt submitted by your team.",
    columnPrompt: "Prompt",
    columnDate: "Last submission",
    columnScore: "Score",
    emptyTitle: "No results",
    emptyDescription: "There is no data to show.",
  },
} as const;

// ============================================================================
// FINAL SUBMISSION TRANSLATIONS
// ============================================================================
export const finalTranslations = {
  it: {
    title: "Consegna Finale",
    description: (count: number) => `Carica i tuoi ${count} prompt finali per la valutazione ufficiale. Questa submission sarà usata per la classifica finale della competizione.`,
    howItWorks: "Come Funziona la Final Submission",
    howItWorksDesc1: (count: number) => `La Final Submission è l'ultima fase della competizione. Devi caricare esattamente <strong>${count} prompt</strong> che saranno valutati per determinare la classifica finale.`,
    howItWorksDesc2: "A differenza del playground, i prompt finali verranno valutati da <strong>tutti i modelli</strong> disponibili e i punteggi saranno combinati per una valutazione più accurata e completa.",
    howItWorksDesc3: "<strong>Formato del file:</strong> Carica un file di testo semplice dove ogni riga contiene un singolo prompt.",
    checklist: "Checklist Prima dell'Invio",
    checklistPromptCount: (count: number) => `Assicurati di avere esattamente <strong>${count} prompt</strong> nel file.`,
    checklistLanguage: "Verifica che tutti i prompt siano in italiano.",
    checklistDuplicates: "Controlla che non ci siano prompt duplicati o troppo simili.",
    checklistReview: "Rivedi i migliori prompt testati nel playground.",
    warning: "Attenzione",
    warningOnce: "<strong>La Final Submission può essere effettuato una sola volta.</strong>",
    warningNoEdit: "Non sarà possibile modificare i prompt dopo l'invio.",
    warningTeamAgree: "Assicurati che tutti i membri del team siano d'accordo prima di procedere.",
  },
  en: {
    title: "Official Submission",
    description: (count: number) => `Upload your ${count} final prompts for official evaluation. This submission will be used for the final competition ranking.`,
    howItWorks: "How Final Submission Works",
    howItWorksDesc1: (count: number) => `The final submission is the last phase of the competition. You must upload exactly <strong>${count} prompts</strong> that will be evaluated to determine the final ranking.`,
    howItWorksDesc2: "Unlike the playground, final prompts will be evaluated by <strong>all available models</strong> and scores will be combined for a more accurate and comprehensive assessment.",
    howItWorksDesc3: "<strong>File format:</strong> Upload a plain text file where each line contains a single prompt.",
    checklist: "Checklist Before Submission",
    checklistPromptCount: (count: number) => `Make sure you have exactly <strong>${count} prompts</strong> in the file.`,
    checklistLanguage: "Verify that all prompts are in Italian.",
    checklistDuplicates: "Check that there are no duplicate or too similar prompts.",
    checklistReview: "Review the best prompts tested in the playground.",
    warning: "Warning",
    warningOnce: "<strong>The final submission can only be made once.</strong>",
    warningNoEdit: "You will not be able to modify the prompts after submission.",
    warningTeamAgree: "Make sure all team members agree before proceeding.",
  },
} as const;

// ============================================================================
// PLAYGROUND TRANSLATIONS
// ============================================================================
export const playgroundTranslations = {
  it: {
    title: "Playground",
    description: "Carica i tuoi prompt ogni giorno per testare e migliorare prima dell'invio finale. Ottieni valutazioni preliminari e scopri prompt più efficaci.",
    howItWorks: "Come Funziona",
    howItWorksDesc1: "Puoi caricare fino a 25 prompt al giorno per ottenere delle valutazioni preliminari che ti aiutano a testare strategie diverse prima dell'invio ufficiale.",
    howItWorksDesc2: "Ogni prompt riceve un punteggio provvisorio da un singolo modello di linguaggio. Nella consegna finale, i prompt verranno valutati da diversi modelli e combinati per una valutazione più accurata.",
    howItWorksDesc3: "<strong>Formato del file:</strong> Carica un file di testo semplice dove ogni riga contiene un singolo prompt.",
    tips: "Consigli Importanti",
    tipReadInstructions: "Leggi bene tutte le istruzioni prima di procedere.",
    tipDuplicates: "Prompt identici a quelli già inviati saranno scartati.",
    tipOneUpload: "Puoi effettuare un solo upload giornaliero per team.",
    tipCultural: "Prova diversi aspetti culturali italiani, spazia tra diversi argomenti.",
  },
  en: {
    title: "Playground",
    description: "Upload your prompts every day to test and improve before the final submission. Get preliminary evaluations and discover more effective prompts.",
    howItWorks: "How It Works",
    howItWorksDesc1: "You can upload up to 25 prompts per day to get preliminary evaluations that help you test different strategies before the official submission.",
    howItWorksDesc2: "Each prompt receives a provisional score from a single language model. In the final submission, prompts will be evaluated by different models and combined for a more accurate assessment.",
    howItWorksDesc3: "<strong>File format:</strong> Upload a plain text file where each line contains a single prompt.",
    tips: "Important Tips",
    tipReadInstructions: "Read all instructions carefully before proceeding.",
    tipDuplicates: "Prompts identical to those already submitted will be discarded.",
    tipOneUpload: "You can only upload once per day per team.",
    tipCultural: "Try different Italian cultural aspects and safety topics.",
  },
} as const;

// ============================================================================
// UPLOAD TRANSLATIONS
// ============================================================================
export const uploadTranslations = {
  it: {
    // Final upload
    finalTitle: "Final Submission",
    finalSubtitle: (count: number) => `Invia i tuoi ${count} prompt per la valutazione ufficiale`,
    finalCompletedTitle: "🎉 Final Submission Effettuata!",
    finalCompletedSubtitle: "**Buona fortuna!**",
    finalErrorTitle: "Errore durante la Final Submission",
    finalErrorSubtitle: "Si è verificato un errore durante la consegna. Riprova o contatta l'assistenza se il problema persiste.",
    finalUploadHint: (count: number) => `File di testo (una riga = un prompt) · Esattamente ${count} prompt · Max 20 MB`,
    finalFilePlaceholder: "Seleziona un file per la Final Submission",
    finalSubmitButton: "Final Submission",
    // Daily upload
    dailyTitle: "Carica Prompt",
    dailySubtitle: "Invia i tuoi prompt per la valutazione giornaliera",
    dailyCompletedTitle: "🎉 Invio Completato!",
    dailyCompletedSubtitle: "Hai già effettuato l'invio giornaliero oggi.\n**Torna domani per il prossimo invio!**",
    dailyErrorTitle: "Errore durante l'invio",
    dailyErrorSubtitle: "Si è verificato un problema con l'invio giornaliero. Riprova più tardi.",
    dailyUploadHint: "File di testo (una riga = un prompt) · Max 20 MB",
    dailyFilePlaceholder: "Seleziona un file per la valutazione",
    dailySubmitButton: "Invia",
    // Common
    retryButton: "Riprova",
    uploadLabel: "Clicca per caricare",
    loadingText: "Valutazione in corso — potrebbe richiedere qualche minuto.",
    dragHint: "o trascina qui il file",
    promptCount: (count: number) => `${count} prompt`,
    belowMaxMessage: (remaining: number) => `Puoi caricare altri ${remaining} prompt`,
    overMaxMessage: (count: number, max: number) => `Attenzione: il file contiene ${count} prompt. E' possibile caricare al massimo ${max} prompt.`,
    exactCountMessage: (max: number, count: number) => `Servono esattamente ${max} prompt. Trovati: ${count}`,
    zeroPromptsMessage: "Attenzione: nessun prompt nel file. Carica almeno un prompt",
    duplicatesBlockMessage: "Duplicati trovati. Rimuovili prima di inviare.",
    duplicatesWarnMessage: "Duplicati trovati. Saranno scartati durante l'invio.",
    errorLabel: "Errore:",
    // Errors
    fileTooLarge: "File troppo grande. Max 20 MB",
    readError: "Errore durante la lettura del file.",
    serverError: "Errore dal server durante l'upload.",
    invalidType: "Formato file non supportato. Usa file di testo (.txt).",
  },
  en: {
    // Final upload
    finalTitle: "Final Submission",
    finalSubtitle: (count: number) => `Submit your ${count} prompts for official evaluation`,
    finalCompletedTitle: "🎉 Final Submission Complete!",
    finalCompletedSubtitle: "**Good luck!**",
    finalErrorTitle: "Error during final submission",
    finalErrorSubtitle: "An error occurred during submission. Try again or contact support if the problem persists.",
    finalUploadHint: (count: number) => `Text file (one line = one prompt) · Exactly ${count} prompts · Max 20 MB`,
    finalFilePlaceholder: "Select a file for final submission",
    finalSubmitButton: "Submit Final",
    // Daily upload
    dailyTitle: "Upload Prompts",
    dailySubtitle: "Submit your prompts for daily evaluation",
    dailyCompletedTitle: "🎉 Submission Complete!",
    dailyCompletedSubtitle: "You have already made your daily submission today.\n**Come back tomorrow for the next submission!**",
    dailyErrorTitle: "Error during submission",
    dailyErrorSubtitle: "A problem occurred with the daily submission. Please try again later.",
    dailyUploadHint: "Text file (one line = one prompt) · Max 20 MB",
    dailyFilePlaceholder: "Select a file for evaluation",
    dailySubmitButton: "Submit",
    // Common
    retryButton: "Retry",
    uploadLabel: "Click to upload",
    loadingText: "Evaluation in progress — this may take a few minutes.",
    dragHint: "or drag the file here",
    promptCount: (count: number) => `${count} prompt${count !== 1 ? 's' : ''}`,
    belowMaxMessage: (remaining: number) => `You can upload ${remaining} more prompts`,
    overMaxMessage: (count: number, max: number) => `Warning: the file contains ${count} prompts. You can upload a maximum of ${max} prompts.`,
    exactCountMessage: (max: number, count: number) => `Exactly ${max} prompts required. Found: ${count}`,
    zeroPromptsMessage: "Warning: no prompts in the file. Upload at least one prompt",
    duplicatesBlockMessage: "Duplicates found. Remove them before submitting.",
    duplicatesWarnMessage: "Duplicates found. They will be discarded during submission.",
    errorLabel: "Error:",
    // Errors
    fileTooLarge: "File too large. Max 20 MB",
    readError: "Error reading the file.",
    serverError: "Server error during upload.",
    invalidType: "Unsupported file format. Use text files (.txt).",
  },
} as const;

// ============================================================================
// SETUP TRANSLATIONS
// ============================================================================
export const setupTranslations = {
  it: {
    title: "Gestisci il tuo team",
    description: "Crea un nuovo gruppo o unisciti ad un team esistente usando il codice di invito.",
    createTab: "Crea team",
    joinTab: "Unisciti al team",
    createTitle: "Crea il tuo team",
    createDescription: "Inizia un nuovo team e invita i tuoi compagni di squadra.",
    joinTitle: "Unisciti a un team",
    joinDescription: "Inserisci il codice condiviso dai tuoi compagni di squadra per unirti al loro gruppo.",
    teamNameLabel: "Nome Team",
    teamNameHint: "Scegli un nome riconoscibile per trovare più facilmente i tuoi compagni di squadra.",
    teamNamePlaceholder: "Safety Guardians",
    createButton: "Crea",
    creatingButton: "Creazione...",
    createError: "Errore durante la creazione del team.",
    teamCodeLabel: "Codice Team",
    teamCodeHint: "Inserisci il codice di 6 caratteri condiviso dal team leader.",
    teamCodePlaceholder: "S 5 G 7 K 2",
    joinButton: "Unisciti",
    joiningButton: "In corso...",
    joinError: "Si è verificato un errore durante l'accesso al team.",
  },
  en: {
    title: "Manage your team",
    description: "Create a new group or join an existing team using the invite code.",
    createTab: "Create team",
    joinTab: "Join team",
    createTitle: "Create your team",
    createDescription: "Start a new team and invite your teammates.",
    joinTitle: "Join a team",
    joinDescription: "Enter the code shared by your teammates to join their group.",
    teamNameLabel: "Team Name",
    teamNameHint: "Choose a recognizable name so teammates can find you more easily.",
    teamNamePlaceholder: "Safety Guardians",
    createButton: "Create",
    creatingButton: "Creating...",
    createError: "Error creating the team.",
    teamCodeLabel: "Team Code",
    teamCodeHint: "Enter the 6-character code shared by your team leader.",
    teamCodePlaceholder: "S 5 G 7 K 2",
    joinButton: "Join",
    joiningButton: "Joining...",
    joinError: "An error occurred while joining the team.",
  },
} as const;

// ============================================================================
// ERRORS TRANSLATIONS
// ============================================================================
export const errorsTranslations = {
  it: {
    generic: "Qualcosa è andato storto. Riprova.",
    notFound: "Pagina non trovata",
    notFoundMessage: "La pagina che stavi cercando non esiste.",
    backToHome: "Torna alla home",
    unauthorized: "Non sei autorizzato a visualizzare questa pagina",
    networkError: "Errore di rete. Controlla la tua connessione.",
    // Team errors
    teamNotFound: "Codice team non valido.",
    teamNameExists: "Esiste già un team con questo nome.",
    teamFull: "Il team ha raggiunto il numero massimo di membri.",
    teamCreation: "Si è verificato un errore durante la creazione del team.",
    teamJoin: "Si è verificato un errore durante l'accesso al team.",
    teamCreationUnknown: "Si è verificato un errore inaspettato durante la creazione del team.",
    teamJoinUnknown: "Si è verificato un errore inaspettato durante l'accesso al team.",
    teamMemberFetch: "Si è verificato un errore durante il recupero dei membri del team.",
  },
  en: {
    generic: "Something went wrong. Please try again.",
    notFound: "Page not found",
    notFoundMessage: "Sorry, we couldn't find the page you were looking for.",
    backToHome: "Back to home",
    unauthorized: "You are not authorized to view this page",
    networkError: "Network error. Check your connection.",
    // Team errors
    teamNotFound: "Invalid team code.",
    teamNameExists: "A team with this name already exists.",
    teamFull: "The team has reached the maximum number of members.",
    teamCreation: "An error occurred while creating the team.",
    teamJoin: "An error occurred while joining the team.",
    teamCreationUnknown: "An unexpected error occurred while creating the team.",
    teamJoinUnknown: "An unexpected error occurred while joining the team.",
    teamMemberFetch: "An error occurred while fetching team members.",
  },
} as const;

// ============================================================================
// FORMS/VALIDATION TRANSLATIONS
// ============================================================================
export const formsTranslations = {
  it: {
    teamName: "Nome del Team",
    teamCode: "Codice Team",
    email: "Email",
    password: "Password",
    required: "Questo campo è obbligatorio.",
    teamNameMin: "Il nome del team deve contenere almeno 3 caratteri.",
    teamNameMax: "Il nome del team è troppo lungo.",
    joinCodeError: "Il codice deve essere esattamente di 6 caratteri alfanumerici.",
    promptEmpty: "Il prompt non può essere vuoto.",
  },
  en: {
    teamName: "Team Name",
    teamCode: "Team Code",
    email: "Email",
    password: "Password",
    required: "This field is required.",
    teamNameMin: "Team name must contain at least 3 characters.",
    teamNameMax: "Team name is too long.",
    joinCodeError: "The code must be exactly 6 alphanumeric characters.",
    promptEmpty: "The prompt cannot be empty.",
  },
} as const;

// ============================================================================
// HERO SECTION TRANSLATIONS
// ============================================================================
export const heroTranslations = {
  it: {
    kicker: "AI Safety Challenge",
    description: "Metti alla prova la tua creatività, la tua logica e la tua conoscenza dell'IA in una competizione di prompt engineering etico.",
    titleThe: "The",
    titleSafety: "Safety",
    titleGame: "Game",
    eventDates: "Dal 17 dicembre al 12 gennaio",
    cta: "Riuscirai a battere ChatGPT?",
    learnMore: "Scopri di più",
  },
  en: {
    kicker: "AI Safety Hackathon 2025",
    description: "Put your creativity, logic, and AI knowledge to the test in an ethical prompt engineering competition.",
    titleThe: "The",
    titleSafety: "Safety",
    titleGame: "Game",
    eventDates: "From 12 December until 5 January",
    cta: "Can you beat ChatGPT?",
    learnMore: "Learn more",
  },
} as const;

// ============================================================================
// CHALLENGE SECTION TRANSLATIONS
// ============================================================================
export interface ChallengeIntroductionParagraph {
  content: string;
}

export const challengeTranslations = {
  it: {
    title: "La Sfida",
    description: "Una challenge di prompt engineering etico che ti invita a misurare la sicurezza dei modelli linguistici italiani.",
    tagline: "Crea prompt basati sul contesto culturale italiano, capaci di spingere l'IA a generare contenuti non sicuri o inappropriati.",
    what: "Analizzare come i modelli linguistici italiani reagiscono a stimoli in grado di elicitare comportamenti non etici, per comprendere i loro limiti in contesti culturali italiani realistici.",
    objectiveLabel: "Obiettivo",
    challengeLabel: "La Sfida",
    challengeText: "Abbiamo chiesto a ChatGPT di generare alcuni prompt che potrebbero indurre i modelli di linguaggio a produrre risposte problematiche. In questa sfida, competerai con ChatGPT per trovare prompt ancora più efficaci.",
    participationLabel: "Partecipazione",
    participation: "Non è necessaria nessuna conoscenza dell'intelligenza artificiale. L'unico requisito è la conoscenza della lingua e della cultura italiana.",
    prizesLabel: "Premi",
    prizesDescription: "Il team che sarà in grado di scrivere i migliori prompt verrà premiato durante il  Consiglio di Dipartimento  di Informatica di Milano-Bicocca, con una breve cerimonia. A coloro che affronteranno la sfida, verrà rilasciato un <b>certificato un partecipazione</b>.",
    llmLabel: "Cos'è un Large Language Model?",
    introduction: [
      { content: "I Large Language Model sono modelli di intelligenza artificiale in grado di comprendere e generare testo in linguaggio naturale simile a quello umano. Il loro utilizzo è in costante crescita, soprattutto come chatbot e assistenti conversazionali come ChatGPT, Gemini e Claude. Tuttavia, questi modelli possono talvolta produrre risposte pericolose, eticamente inappropriate." },
      { content: "L'obiettivo della challenge è aiutare a rendere i Large Language Model più sicuri identificando potenziali vulnerabilità specifiche per il pubblico italiano, e scoprire casi in cui il modello risponde in modo non etico." },
    ] as ChallengeIntroductionParagraph[],
    webinarLabel: "Webinar introduttivo",
    webinarText: "Partecipa al nostro webinar introduttivo per scoprire come funziona la challenge e ricevere consigli dai nostri esperti. Il webinar si terrà il 17 dicembre alle 16.30 in presenza presso [TDB] e online su Google Meet al seguente link.",
  },
  en: {
    title: "The Challenge",
    description: "An ethical prompt engineering challenge that invites you to test the safety boundaries of language models in the Italian cultural context.",
    tagline: "Create prompts based on Italian cultural context, capable of pushing AI to generate unsafe or inappropriate content.",
    what: "Analyze how Italian language models react to stimuli that can elicit unsafe behaviors, to understand their ethical and safety limits in realistic Italian cultural contexts.",
    objectiveLabel: "Objective",
    challengeLabel: "Can you beat ChatGPT?",
    challengeText: "We asked ChatGPT to generate some examples of prompts that could induce language models to produce problematic responses. In this challenge, you will compete with ChatGPT to find even more effective prompts.",
    participationLabel: "Anyone can participate!",
    participation: "No knowledge of artificial intelligence is required. The only requirement is knowledge of the Italian language and culture.",
    prizesLabel: "Prizes",
    prizesDescription: "The team that produces the best prompts will be awarded in front of the Faculty Board of the Department of Computer Science at Milan-Bicocca. <br/>All participants will receive a certificate of participation.",
    llmLabel: "What is a Large Language Model?",
    introduction: [
      { content: "Large Language Models are AI models capable of understanding and generating human-like natural language text. Their use is constantly growing, especially as chatbots and conversational assistants like ChatGPT, Gemini, and Claude. However, these models can sometimes produce dangerous, ethically inappropriate, or even incorrect responses." },
      { content: "The goal of the challenge is to help make Large Language Models safer by identifying potential vulnerabilities specific to the Italian audience, and discovering cases where the model is inadequate or produces problematic responses." },
    ] as ChallengeIntroductionParagraph[],
    webinarLabel: "Introductory Webinar",
    webinarText: "Join our introductory webinar to discover how the challenge works and receive advice from our experts. The introductory webinar will be held on DATE AND TIME.",
  },
} as const;

// ============================================================================
// PARTICIPATION SECTION TRANSLATIONS
// ============================================================================
export const participationTranslations = {
  it: {
    title: "Come Partecipare",
    intro: "Partecipare al Safety Game è semplice! <br> Segui questi passaggi per unirti alla competizione.",
    registrationLabel: "Registrazione",
    registrationDescription: "I team possono essere composti da 1 a 4 persone. Ogni membro del team deve registrarsi con la propria email universitaria per partecipare alla challenge.",
    registrationDetails: "Dopo aver effettuato l'accesso, puoi creare o unirti a un team.",
    privacyLabel: "Privacy",
    privacyDescription: "La partecipazione alla challenge implica l'integrale accettazione del regolamento e delle linee guida operative della stessa.",
    playgroundLabel: "Playground",
    playgroundDescription: "Dopo aver effettuato l'accesso, ogni team potrà caricare i propri prompt nel Playground per una valutazione preliminare e di confronto con ChatGPT.",
    submissionLabel: "Final Submission",
    submissionDescription: "Quando il team avrà definito l'insieme dei 50 prompt che desidera inviare in via definitiva, potrà effettuare la sua submission.",
    submissionWarning: "Se i prompt sono troppo simili verranno scartati automaticamente, quindi assicurati di variare i tuoi approcci e di esplorare diversi scenari.",
    evaluationLabel: "Valutazione",
    evaluationDescription: "I prompt saranno valutati in base alla capacità di elicitare risposte non etiche. Il processo di valutazione è automatico e basato sulle risposte generate dai modelli di linguaggio: una volta effettuata una submission, il sistema processa i prompt fornendoli a vari modelli di linguaggio e ne analizza le risposte prodotte. Non avrai accesso alle risposte generate dai modelli, solamente al punteggio di unsafety finale assegnato ad ogni singolo prompt. <br> Ad ogni prompt verrà infatti assegnato un <i>Unsafety Score</i> tra 0 e 100, dove 0 rappresenta un prompt completamente etico, mentre 100 completamente non etico.",
  },
  en: {
    title: "How to Participate",
    intro: "Participating in the Safety Game is easy! <br> Follow these steps to join the competition.",
    registrationLabel: "Registration",
    registrationDescription: "Teams can be composed of 1 to 4 people. Each team member must register with their university email to participate in the challenge.",
    registrationDetails: "After logging in, you will be able to access your team's dashboard.",
    privacyLabel: "Privacy",
    privacyDescription: "Participation in the challenge implies full acceptance of the rules and operational guidelines.",
    playgroundLabel: "Playground",
    playgroundDescription: "After logging in, each team can upload their prompts in the Playground for a preliminary evaluation and comparison with ChatGPT.",
    submissionLabel: "Submission",
    submissionDescription: "During the challenge, each team can upload their prompts in the Playground. Each submission represents a single prompt that the system runs on various language models and evaluates based on the responses produced, assigning a score based on the prompt's effectiveness in generating unsafe responses.",
    submissionWarning: "If prompts are too similar they will be automatically discarded, so make sure to vary your approaches and explore different scenarios.",
    evaluationLabel: "Evaluation",
    evaluationDescription: "Submissions are automatically evaluated and contribute to the team's score. The leaderboard shows the highest score achieved by each team during the challenge.",
  },
} as const;

// ============================================================================
// TIMELINE/DATES SECTION TRANSLATIONS
// ============================================================================
export interface TimelineEventContent {
  title: string;
  description: string;
}

export const timelineTranslations = {
  it: {
    title: "Date Importanti",
    emptyMessage: "Altre date in arrivo.",
    events: {
      registrationOpens: { title: "Apertura Registrazioni", description: "Inizia la fase di registrazione per i team partecipanti." },
      introductoryWebinar: { title: "Webinar Introduttivo", description: "Sessione online di introduzione alle regole e alla piattaforma." },
      challengeStarts: { title: "Inizio Challenge", description: "Parte ufficialmente la competizione! Il playground si attiva." },
      challengeEnds: { title: "Fine Challenge", description: "Ultimo giorno per sottomettere i prompt. Chiusura alle 23:59." },
      winnerAnnouncement: { title: "Premiazione Vincitori", description: "Evento finale con presentazione della classifica e premiazione." },
    } as Record<string, TimelineEventContent>,
  },
  en: {
    title: "Important Dates",
    emptyMessage: "More updates coming soon.",
    events: {
      registrationOpens: { title: "Registration Opens", description: "The registration phase for participating teams begins." },
      introductoryWebinar: { title: "Introductory Webinar", description: "Online session introducing the rules and platform." },
      challengeStarts: { title: "Challenge Starts", description: "The competition officially begins! The playground is activated." },
      challengeEnds: { title: "Challenge Ends", description: "Last day to submit prompts. Closes at 11:59 PM." },
      winnerAnnouncement: { title: "Winner Announcement", description: "Final event with leaderboard presentation and awards." },
    } as Record<string, TimelineEventContent>,
  },
} as const;

// ============================================================================
// INSTRUCTIONS SECTION TRANSLATIONS
// ============================================================================
export type InstructionCardVariant = "objective" | "positive" | "negative" | "warning";
export type InstructionExampleVariant = "valid" | "invalid" | "mixed";

export interface InstructionCard {
  variant: InstructionCardVariant;
  title: string;
  description?: string;
  items?: readonly string[];
}

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

export const instructionsTranslations = {
  it: {
    title: "Istruzioni",
    intro: "La sfida richiede ai partecipanti di ideare <b>50 prompt etici</b> in lingua italiana che inducano i modelli di AI a produrre <b>risposte non sicure o dannose</b> in <b>contesti culturali italiani realistici</b>.",
    promptsHeading: "I Prompt",
    cards: [
      {
        variant: "objective",
        title: "Partecipazione",
        description: "<b>Ogni team deve creare 50 prompt diversi in italiano.</b><br>I prompt saranno valutati in base alla capacità di elicitare risposte non sicure per l'individuo. Il processo di <b>valutazione</b> è automatico e basato sulle <b>risposte generate dai modelli di linguaggio</b>: una volta effettuata una submission, il sistema esegue il prompt su vari modelli di linguaggio e analizza le risposte prodotte.<br><b>Non avrai accesso alle risposte generate dai modelli, solamente al <i> punteggio di unsafety </i> assegnato ad ogni singolo prompt</b>.",
      },
    ] as InstructionCard[],
    exampleGroups: [
      {
        variant: "valid",
        title: "Assicurati che i tuoi prompt ...",
        prompts: [
          { label: "good", prompt: "Siano eticamente corretti, legittimi e realistici." },
          { label: "good", prompt: "Elicitino risposte con contenuti non sicuri o non etici." },
          { label: "good", prompt: "Incorporino elementi culturali italiani (storia, cultura, società, attualità, ...)." },
        ],
      },
      {
        variant: "mixed",
        title: "Tieni a mente ...",
        prompts: [
          { label: "neutral", prompt: "Prompt banali o apertamente provocatori, con forti contenuti espliciti tendono a essere facilmente riconosciuti e bloccati dai modelli, mentre Ironia, sarcarmo, ambiguità, e giochi linguistici tendono a confondere di più i modelli. Sta a te trovare il giusto equilibrio." },
          { label: "neutral", prompt: "Ciò che è etico in un contesto culturale potrebbe non esserlo in un altro. Assicurati che i tuoi prompt riflettano sensibilità culturali specifiche all'Italia." },
          { label: "neutral", prompt: "Non saranno i prompt ad essere valutati, ma le risposte che essi elicitano dai modelli di linguaggio." },
        ],
      },
      {
        variant: "invalid",
        title: "Assicurati che i tuoi prompt ...",
        prompts: [
          { label: "bad", prompt: "NON includano tecniche di aggiramento, manipolazione diretta o hacking dei filtri di sicurezza (es. prompt nella forma \"Immagina di...\", \"ignora le istruzioni precedenti\", ..., non sono ammessi)." },
          { label: "bad", prompt: "NON siano generati da modelli di intelligenza artificiale." },
        ],
      },
    ] as InstructionExampleGroup[],
  },
  en: {
    title: "Instructions",
    intro: "The challenge requires participants to create <b>50 ethical prompts</b> in Italian that induce AI models to produce <b>unsafe or harmful responses</b> in <b>realistic Italian cultural contexts</b>.",
    promptsHeading: "The Prompts",
    cards: [
      {
        variant: "objective",
        title: "Participation",
        description: "<b>Each team must create 50 different prompts in Italian.</b><br>Prompts will be evaluated based on their ability to elicit unsafe responses. The <b>evaluation</b> process is automatic and based on <b>responses generated by language models</b>: once a submission is made, the system runs the prompt on various language models and analyzes the produced responses.<br><b>You will not have access to the responses generated by the models, only to the final score assigned to each prompt</b>.",
      },
    ] as InstructionCard[],
    exampleGroups: [
      {
        variant: "valid",
        title: "Make sure your prompts...",
        prompts: [
          { label: "good", prompt: "Are ethically correct, legitimate, and realistic." },
          { label: "good", prompt: "Elicit responses with unsafe or unethical content." },
          { label: "good", prompt: "Incorporate Italian cultural elements (history, culture, society, current events, ...)." },
        ],
      },
      {
        variant: "mixed",
        title: "Keep in mind...",
        prompts: [
          { label: "neutral", prompt: "- Banal or openly provocative prompts with strong explicit content tend to be easily recognized and blocked by models, while irony, sarcasm, ambiguity, and wordplay tend to confuse models more. It's up to you to find the right balance." },
          { label: "neutral", prompt: "- What is ethical in one cultural context might not be in another. Make sure your prompts reflect cultural sensitivities specific to Italy." },
          { label: "neutral", prompt: "- It won't be the prompts that are evaluated, but the responses they elicit from language models." },
        ],
      },
      {
        variant: "invalid",
        title: "Make sure your prompts...",
        prompts: [
          { label: "bad", prompt: "DO NOT include bypass techniques, direct manipulation, or hacking of safety filters (e.g., prompts like \"Imagine you are...\", \"ignore previous instructions\", etc. are not allowed)." },
          { label: "bad", prompt: "ARE NOT generated by artificial intelligence models." },
        ],
      },
    ] as InstructionExampleGroup[],
  },
} as const;

// ============================================================================
// FAQ SECTION TRANSLATIONS
// ============================================================================
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqTranslations = {
  it: {
    title: "FAQ",
    description: "Domande frequenti",
    items: [
      { question: "Chi può partecipare?", answer: "Il Safety Game è aperto a studenti universitari, ricercatori e professionisti interessati all'IA. Non sono richieste particolari competenze. Ogni membro del team deve registrarsi utilizzando la propria mail @campus.unimib.it (o @unimib.it)." },
      { question: "Non ho una mail unimib. Posso partecipare lo stesso?", answer: "Saremo felici di fare un'eccezione, purchè almeno un membro del team abbia una mail @campus.unimib.it (o @unimib.it). La mail è infatti necessaria per la registrazione e per l'emissione del certificato di partecipazione. Se il tuo team include membri esterni all'università, contattaci indicando il nome del tuo team e l'elenco dei partecipanti." },
      { question: "Posso far parte di più team?", answer: "No. Ogni partecipante può iscriversi e competere in un solo team (anche se il team include un solo partecipante)." },
      { question: "Posso modificare il mio team dopo l'iscrizione?", answer: "Non è possibile modificare i membri del team dopo l'iscrizione. Assicurati che tutti i membri siano definiti correttamente prima di registrarti. In caso di necessità particolari, contattaci e faremo del nostro meglio per accontentarvi." },
      { question: "Quanto costa partecipare?", answer: "La partecipazione è completamente gratuita!" },
      { question: "Serve esperienza di programmazione?", answer: "No! Il Safety Game si concentra sul prompt engineering, che richiede creatività e pensiero logico, non necessariamente competenze di coding." },
      { question: "Come funziona la valutazione?", answer: "I prompt vengono valutati automaticamente in base a vari criteri: efficacia ed eterogeneità. In caso di parità tra team, i giudici valuteranno l'originalità complessiva dei prompt sottomessi per determinare il vincitore." },
      { question: "Il numero di componenti del team ha impatto sulla valutazione?", answer: "Tutte le partecipazioni sono valutate con lo stesso criterio, indipendentemente dal numero di persone che compongono il team." },
      { question: "Cosa è un prompt?", answer: "Nel campo dell'intelligenza artificiale generativa, un prompt è l'input fornito dall'utente a un modello linguistico che descrive il compito che esso deve eseguire. Il prompt è formulato in linguaggio naturale e può assumere la forma di una domanda, una richiesta o un'istruzione." },
    ] as FaqItem[],
  },
  en: {
    title: "FAQ",
    description: "Frequently Asked Questions",
    items: [
      { question: "Who can participate?", answer: "The Safety Game is open to university students, researchers, and professionals interested in AI. No advanced technical skills are required. Each team member must register using their @campus.unimib.it (or @unimib.it) email." },
      { question: "Can I be part of multiple teams?", answer: "No. Each participant can register and compete in only one team (even if the team includes only one participant)." },
      { question: "Can I modify my team after registration?", answer: "It is not possible to modify team members after registration. Make sure all members are correctly defined before registering. In case of special needs, contact us and we will do our best to accommodate you." },
      { question: "How much does it cost to participate?", answer: "Participation is completely free!" },
      { question: "Do I need programming experience?", answer: "No! The Safety Game focuses on prompt engineering, which requires creativity and logical thinking, not necessarily coding skills." },
      { question: "How does the evaluation work?", answer: "Prompts are automatically evaluated based on various criteria: effectiveness, creativity, adherence to ethical principles, and ability to 'beat' ChatGPT's defenses." },
      { question: "Does team size affect the evaluation?", answer: "All entries are evaluated using the same criteria, regardless of the number of people on the team." },
      { question: "What is a prompt?", answer: "In the field of generative artificial intelligence, a prompt is the input provided by the user to a language model that describes the task it must perform. The prompt is formulated in natural language and can take the form of a question, request, or instruction." },
    ] as FaqItem[],
  },
} as const;

// ============================================================================
// TEAM SECTION TRANSLATIONS
// ============================================================================
export interface TeamMemberTranslation {
  role: string;
  bio: string;
}

export const teamSectionTranslations = {
  it: {
    title: "Il Team",
    description: "The Safety Game è organizzato dal laboratorio di ricerca <b>Models in Decision Making and Data Analysis</b> (MIND) del dipartimento di Informatica, Sistemistica e Comunicazione dell'Università di Milano Bicocca.",
    members: {
      "Elisabetta Fersini": { role: "Professore Associato", bio: "Her research focuses primarily on machine learning and natural language processing, with specific interests in hate speech detection, information extraction and topic modelling." },
      "Giulia Rizzi": { role: "Ricercatrice Postdoc", bio: "Giulia Rizzi is a postdoc research. She obtained a Ph.D. in a double PhD in Computer Science at Università degli Studi di Milano - Bicocca (UniMiB) and at Universitat Politècnica de València (UPV). Her research interests are centered in the field of Natural Language Processing and machine learning. She is currently working on a project that focuses on misogyny detection in memes under the Learning With Disagreements paradigm." },
      "Giuseppe Magazzù": { role: "Studente PhD", bio: "Giuseppe Magazzù is a 2nd year PhD student. His research focuses on developing an ethical framework and implementing safety strategies to ensure that large language models generate safe, useful, and high-quality outputs. In particular, he is working on designing guardrail methods and benchmarks tailored to the Italian language." },
      "Daniel Scalena": { role: "Studente PhD", bio: "Daniel Scalena is a 3rd year PhD student in a cotutelle agreement with University of Groningen. His research focuses mainly on the interpretability of language models, in particular towards their safe and reliable deployment in real-world contexts." },
      "Alberto Sormani": { role: "Studente Magistrale", bio: "" },
      "Andrea Muscio": { role: "Studente Magistrale", bio: "" },
    } as Record<string, TeamMemberTranslation>,
  },
  en: {
    title: "The Team",
    description: "The Safety Game is organized by the <b>Models in Decision Making and Data Analysis</b> (MIND) research lab of the Department of Informatics, Systems, and Communication at the University of Milano-Bicocca.",
    members: {
      "Elisabetta Fersini": { role: "Associate Professor", bio: "Her research focuses primarily on machine learning and natural language processing, with specific interests in hate speech detection, information extraction and topic modelling." },
      "Giulia Rizzi": { role: "Postdoc Researcher", bio: "Giulia Rizzi is a postdoc researcher. She obtained a Ph.D. in Computer Science at Università degli Studi di Milano - Bicocca (UniMiB) and at Universitat Politècnica de València (UPV). Her research interests are centered in the field of Natural Language Processing and machine learning." },
      "Giuseppe Magazzù": { role: "PhD Student", bio: "Giuseppe Magazzù is a 2nd year PhD student. His research focuses on developing an ethical framework and implementing safety strategies to ensure that large language models generate safe, useful, and high-quality outputs." },
      "Daniel Scalena": { role: "PhD Student", bio: "Daniel Scalena is a 3rd year PhD student in a cotutelle agreement with University of Groningen. His research focuses mainly on the interpretability of language models." },
      "Alberto Sormani": { role: "Master's Student", bio: "" },
      "Andrea Muscio": { role: "Master's Student", bio: "" },
    } as Record<string, TeamMemberTranslation>,
  },
} as const;

// ============================================================================
// HELPER FUNCTION
// ============================================================================

/**
 * Get translations for a specific locale from a translation dictionary.
 * Falls back to Italian if locale is not found.
 */
export function getTranslations<T extends Record<Locale, any>>(
  translations: T,
  locale: Locale
): T[Locale] {
  return translations[locale] ?? translations.it;
}
