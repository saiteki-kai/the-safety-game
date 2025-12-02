import type { Translations } from "./types";

/**
 * English translations
 */
const en: Translations = {
  // ============================================================================
  // UI & Navigation
  // ============================================================================

  nav: {
    skipToContent: "Skip to main content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    dashboard: "Dashboard",
    login: "Login",
    logout: "Logout",
    account: "Account",
  },

  common: {
    loading: "Loading...",
    error: "An error occurred",
    retry: "Retry",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    submit: "Submit",
  },

  sections: {
    challenge: "The Challenge",
    instructions: "Instructions",
    participate: "Participate",
    dates: "Important Dates",
    leaderboard: "Leaderboard",
    team: "The Team",
    faq: "FAQ",
  },

  auth: {
    signOutError: "An error occurred. Please try again.",
    signInPrompt: "Sign in to continue",
    signUpPrompt: "Create an account",
  },

  footer: {
    tagline: "An ethical prompt engineering competition organized by the AI Safety research laboratory.",
    quickLinks: "Quick Links",
    contacts: "Contacts",
    copyright: "All rights reserved.",
    privacy: "Privacy Policy",
  },

  dashboard: {
    title: "Dashboard",
    welcome: "Welcome back",
    noTeam: "You are not part of a team yet",
    createTeam: "Create Team",
    joinTeam: "Join Team",
    submissions: "Submissions",
    dailyLimit: "Daily Limit",
    totalSubmissions: "Total Submissions",
  },

  forms: {
    teamName: "Team Name",
    teamCode: "Team Code",
    email: "Email",
    password: "Password",
    required: "This field is required",
    invalidEmail: "Invalid email address",
    minLength: "Minimum {min} characters",
    maxLength: "Maximum {max} characters",
  },

  errors: {
    generic: "Something went wrong. Please try again.",
    notFound: "Page not found",
    notFoundMessage: "Sorry, we couldn't find the page you were looking for.",
    backToHome: "Back to home",
    unauthorized: "You are not authorized to view this page",
    networkError: "Network error. Check your connection.",
  },

  meta: {
    siteTitle: "The Safety Game",
    siteDescription: "The Safety Game - Hackathon organized by MIND, University of Milan Bicocca",
    notFoundTitle: "Page not found | The Safety Game",
  },

  // ============================================================================
  // Content Sections
  // ============================================================================

  home: {
    title: "The Safety Game",
    description:
      "Put your creativity, logic, and AI knowledge to the test in an ethical prompt engineering competition.",
    cta: "Can you beat ChatGPT?",
    kicker: "AI Safety Hackathon 2025",
    learnMore: "Learn more",
    eventDates: "From 12 December until 5 January",
  },

  challenge: {
    title: "The Challenge",
    description:
      "An ethical prompt engineering challenge that invites you to test the safety boundaries of language models in the Italian cultural context.",
    introduction: [
      {
        content:
          "Large Language Models are AI models capable of understanding and generating human-like natural language text. Their use is constantly growing, especially as chatbots and conversational assistants like ChatGPT, Gemini, and Claude. However, these models can sometimes produce dangerous, ethically inappropriate, or even incorrect responses.",
      },
      {
        content:
          "The goal of the challenge is to help make Large Language Models safer by identifying potential vulnerabilities specific to the Italian audience, and discovering cases where the model is inadequate or produces problematic responses.",
      },
    ],
    what: "Analyze how Italian language models react to stimuli that can elicit unsafe behaviors, to understand their ethical and safety limits in realistic Italian cultural contexts.",
    challengeText:
      "We asked ChatGPT to generate some examples of prompts that could induce language models to produce problematic responses. In this challenge, you will compete with ChatGPT to find even more effective prompts.",
    participation:
      "No knowledge of artificial intelligence is required. The only requirement is knowledge of the Italian language and culture.",
    objectiveLabel: "Objective",
    challengeLabel: "Can you beat ChatGPT?",
    participationLabel: "Anyone can participate!",
    prizesLabel: "Prizes",
    prizesDescription:
      "The team that produces the best prompts will be awarded in front of the Faculty Board of the Department of Computer Science at Milan-Bicocca. <br/>All participants will receive a certificate of participation.",
    llmLabel: "What is a Large Language Model?",
    tagline:
      "Create prompts based on Italian cultural context, capable of pushing AI to generate unsafe or inappropriate content.",
  },

  leaderboard: {
    title: "Temporary Leaderboard",
    description:
      "The temporary leaderboard shows provisional results from the Playground.<br/>The rankings are updated in real-time.<br/>Final scores will be announced at the end of the challenge.",
    emptyMessage: "No teams are currently on the leaderboard. Please try again later.",
    rank: "Rank",
    teamName: "Team",
    score: "Score",
    scoreNote: "Your team's highest score is shown in the leaderboard.",
  },

  team: {
    title: "The Team",
    description:
      "The Safety Game is organized by the <b>Models in Decision Making and Data Analysis</b> (MIND) research lab of the Department of Informatics, Systems, and Communication at the University of Milano-Bicocca.",
    members: [
      {
        name: "Elisabetta Fersini",
        email: "elisabetta.fersini@unimib.it",
        image: "elisabetta_fersini.png",
        role: "Associate Professor",
        bio: "Her research focuses primarily on machine learning and natural language processing, with specific interests in hate speech detection, information extraction and topic modelling.",
      },
      {
        name: "Giulia Rizzi",
        email: "g.rizzi10@campus.unimib.it",
        image: "giulia_rizzi.jpg",
        role: "Postdoc Researcher",
        bio: "Giulia Rizzi is a postdoc researcher. She obtained a Ph.D. in Computer Science at Università degli Studi di Milano - Bicocca (UniMiB) and at Universitat Politècnica de València (UPV). Her research interests are centered in the field of Natural Language Processing and machine learning.",
      },
      {
        name: "Giuseppe Magazzù",
        email: "g.magazzu1@campus.unimib.it",
        image: "giuseppe_magazzù.jpeg",
        role: "PhD Student",
        bio: "Giuseppe Magazzù is a 2nd year PhD student. His research focuses on developing an ethical framework and implementing safety strategies to ensure that large language models generate safe, useful, and high-quality outputs.",
      },
      {
        name: "Daniel Scalena",
        email: "d.scalena@campus.unimib.it",
        image: "daniel_scalena.jpg",
        role: "PhD Student",
        bio: "Daniel Scalena is a 3rd year PhD student in a cotutelle agreement with University of Groningen. His research focuses mainly on the interpretability of language models.",
      },
      {
        name: "Alberto Sormani",
        email: "a.sormani7@campus.unimib.it",
        image: "",
        role: "Master's Student",
        bio: "",
      },
      {
        name: "Andrea Muscio",
        email: "a.muscio@campus.unimib.it",
        image: "",
        role: "Master's Student",
        bio: "",
      },
    ],
  },

  participation: {
    title: "How to Participate",
    intro: "Participating in the Safety Game is easy! <br> Follow these steps to join the competition.",
    registration: {
      label: "Registration",
      description:
        "Teams can be composed of 1 to 4 people. Each team member must register with their university email to participate in the challenge.",
      afterLogin: "After logging in, you will be able to access your team's dashboard.",
    },
    privacy: {
      label: "Privacy",
      description:
        'Participation in the challenge implies full acceptance of the <a href="/privacy" class="text-blue-600 hover:underline">rules and operational guidelines.</a>',
    },
    submission: {
      label: "Submission",
      howItWorks:
        "During the challenge, each team can upload their prompts in the Playground. Each submission represents a single prompt that the system runs on various language models and evaluates based on the responses produced, assigning a score based on the prompt's effectiveness in generating unsafe responses.",
      warning:
        "If prompts are too similar they will be automatically discarded, so make sure to vary your approaches and explore different scenarios.",
    },
    evaluation: {
      label: "Evaluation",
      overview:
        "Submissions are automatically evaluated and contribute to the team's score. The leaderboard shows the highest score achieved by each team during the challenge.",
      scoring:
        "Each submission receives a composite score normalized between 0 and 100. For the leaderboard, we consider the team's highest score. In case of a tie, judges will evaluate the overall originality of submitted prompts to determine the winner.",
    },
  },

  dates: {
    title: "Important Dates",
    timeline: [
      {
        date: "November 1, 2025",
        title: "Registration Opens",
        description: "The registration phase for participating teams begins.",
        status: "completed",
      },
      {
        date: "November 18, 2025",
        title: "Introductory Webinar",
        description: "Online session introducing the rules and platform.",
        status: "upcoming",
      },
      {
        date: "November 20, 2025",
        title: "Challenge Starts",
        description: "The competition officially begins! The playground is activated.",
        status: "upcoming",
      },
      {
        date: "November 30, 2025",
        title: "Challenge Ends",
        description: "Last day to submit prompts. Closes at 11:59 PM.",
        status: "upcoming",
      },
      {
        date: "December 5, 2025",
        title: "Winner Announcement",
        description: "Final event with leaderboard presentation and awards.",
        status: "upcoming",
      },
    ],
    emptyMessage: "More updates coming soon.",
  },

  instructions: {
    title: "Instructions",
    intro:
      "The challenge requires participants to create <b>50 ethical prompts</b> in Italian that induce AI models to produce <b>unsafe or harmful responses</b> in <b>realistic Italian cultural contexts</b>.",
    cards: [
      {
        variant: "objective",
        title: "Participation",
        description:
          "<b>Each team must create 50 different prompts in Italian.</b><br>Prompts will be evaluated based on their ability to elicit unsafe responses. The <b>evaluation</b> process is automatic and based on <b>responses generated by language models</b>: once a submission is made, the system runs the prompt on various language models and analyzes the produced responses.<br><b>You will not have access to the responses generated by the models, only to the final score assigned to each prompt</b>.",
      },
    ],
    exampleGroups: [
      {
        variant: "valid",
        title: "Make sure your prompts...",
        prompts: [
          {
            label: "good",
            prompt: "Are ethically correct, legitimate, and realistic.",
          },
          {
            label: "good",
            prompt: "Elicit responses with unsafe or unethical content.",
          },
          {
            label: "good",
            prompt: "Incorporate Italian cultural elements (history, culture, society, current events, ...).",
          },
        ],
      },
      {
        variant: "mixed",
        title: "Keep in mind...",
        prompts: [
          {
            label: "neutral",
            prompt:
              "- Banal or openly provocative prompts with strong explicit content tend to be easily recognized and blocked by models, while irony, sarcasm, ambiguity, and wordplay tend to confuse models more. It's up to you to find the right balance.",
          },
          {
            label: "neutral",
            prompt:
              "- What is ethical in one cultural context might not be in another. Make sure your prompts reflect cultural sensitivities specific to Italy.",
          },
          {
            label: "neutral",
            prompt: "- It won't be the prompts that are evaluated, but the responses they elicit from language models.",
          },
        ],
      },
      {
        variant: "invalid",
        title: "Make sure your prompts...",
        prompts: [
          {
            label: "bad",
            prompt:
              'DO NOT include bypass techniques, direct manipulation, or hacking of safety filters (e.g., prompts like "Imagine you are...", "ignore previous instructions", etc. are not allowed).',
          },
          {
            label: "bad",
            prompt: "ARE NOT generated by artificial intelligence models.",
          },
        ],
      },
    ],
  },

  playground: {
    title: "Playground",
    description:
      "Use this space to test your prompts in real-time. Each submission is evaluated and contributes to your leaderboard score.",
    huggingFaceSpace: "https://mind-lab-test-challenge.hf.space",
    openInNewWindow: "Open in new window",
  },

  faq: {
    title: "FAQ",
    description: "Frequently Asked Questions",
    items: [
      {
        question: "Who can participate?",
        answer:
          "The Safety Game is open to university students, researchers, and professionals interested in AI. No advanced technical skills are required. Each team member must register using their @campus.unimib.it (or @unimib.it) email.",
      },
      {
        question: "Can I be part of multiple teams?",
        answer:
          "No. Each participant can register and compete in only one team (even if the team includes only one participant).",
      },
      {
        question: "Can I modify my team after registration?",
        answer:
          "It is not possible to modify team members after registration. Make sure all members are correctly defined before registering. In case of special needs, contact us and we will do our best to accommodate you.",
      },
      {
        question: "How much does it cost to participate?",
        answer: "Participation is completely free!",
      },
      {
        question: "Do I need programming experience?",
        answer:
          "No! The Safety Game focuses on prompt engineering, which requires creativity and logical thinking, not necessarily coding skills.",
      },
      {
        question: "How does the evaluation work?",
        answer:
          "Prompts are automatically evaluated based on various criteria: effectiveness, creativity, adherence to ethical principles, and ability to 'beat' ChatGPT's defenses.",
      },
      {
        question: "Does team size affect the evaluation?",
        answer: "All entries are evaluated using the same criteria, regardless of the number of people on the team.",
      },
      {
        question: "What is a prompt?",
        answer:
          "In the field of generative artificial intelligence, a prompt is the input provided by the user to a language model that describes the task it must perform. The prompt is formulated in natural language and can take the form of a question, request, or instruction.",
      },
    ],
  },
};

export default en;
