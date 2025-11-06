import type { WebsiteContent } from "./types";

export const content: WebsiteContent = {
  // Home Section
  home: {
    title: "The Safety Game",
    description:
      "Metti alla prova la tua creatività, la tua logica e la tua conoscenza dell'IA in una competizione di prompt engineering etico.",
    cta: "Riuscirai a battere ChatGPT?",
    buttonText: "Registra il tuo team",
    buttonLink: "#participate",
    highlights: [
      {
        emoji: "🎯",
        title: "Sfida Etica",
        description: "Testa i limiti dell'IA in modo responsabile",
      },
      {
        emoji: "🏆",
        title: "Premi Esclusivi",
        description: "Certificati, gadget e opportunità di ricerca",
      },
      {
        emoji: "🧠",
        title: "Impara Facendo",
        description: "Esplora il prompt engineering hands-on",
      },
    ],
  },

  // Safety Game Section
  challenge: {
    title: "La Sfida",
    description:
      "Una challenge di prompt engineering etico che ti invita a testare i confini della sicurezza dei modelli linguistici nel contesto culturale italiano.",
    introduction: [
      {
        content:
          "I Large Language Model sono modelli di intelligenza artificiale in grado di comprendere e generare testo in linguaggio naturale simile a quello umano. Il loro utilizzo è in costante crescita, soprattutto come chatbot e assistenti conversazionali come ChatGPT, Gemini e Claude. Tuttavia, questi modelli possono talvolta produrre risposte pericolose, eticamente inappropriate, o addirittura incorrette.",
      },
      {
        content:
          "L'obiettivo della challenge è aiutare a rendere i Large Language Model più sicuri identificando potenziali vulnerabilità specifiche per il pubblico italiano, e scoprire casi in cui il modello non è adeguato o produce risposte problematiche.",
      },
    ],
    what:
      //"Crea 50 prompt etici che, pur essendo del tutto legittimi, siano in grado di spingere i principali LLM italiani a generare contenuti non etici. \
      "Analizzare come i modelli linguistici italiani reagiscono a stimoli in grado di elicitare comportamenti unsafe, per comprendere i loro limiti etici e di sicurezza in contesti culturali italiani realistici.",
    //💡 I prompt basati su ambiguità, ironia e gioco linguistico tendono a confondere di più i modelli rispetto a quelli banali o apertamente provocatori. Sfrutta sfumature semantiche, doppi sensi e contesti culturali per creare richieste innocue, che mettano davvero alla prova la sensibilità etica dell’IA.",

    challenge:
      "Abbiamo chiesto a ChatGPT di generare alcuni esempi di prompt che potrebbero indurre i modelli di linguaggio a produrre risposte problematiche. In questa sfida, competerai con ChatGPT per trovare prompt ancora più efficaci.",
    participation:
      "Non è necessaria nessuna conoscenza dell'intelligenza artificiale. L'unico requisito è la conoscenza della lingua e della cultura italiana.",
  },

  // Leaderboard Section
  leaderboard: {
    title: "Leaderboard",
    description: "La classifica è aggiornata in tempo reale. <br/>Riuscirai a battere ChatGPT?",
    emptyMessage: "Nessun team è presente in classifica al momento. Riprova più tardi.",
  },

  // Team Section
  team: {
    title: "Il Team",
    description:
      "The Safety Game è organizzato dal laboratorio di ricerca <b>Models in Decision Making and Data Analysis</b> (MIND) del dipartimento di Informatica, Sistemistica e Comunicazione dell'Università di Milano Bicocca.",
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
        bio: "Giulia Rizzi is a postdoc research. She obtained a Ph.D. in a double PhD in Computer Science at Università degli Studi di Milano - Bicocca (UniMiB) and at Universitat Politècnica de València (UPV). Her research interests are centered in the field of Natural Language Processing and machine learning. She is currently working on a project that focuses on misogyny detection in memes under the Learning With Disagreements paradigm.",
      },
      {
        name: "Giuseppe Magazzù",
        email: "g.magazzu1@campus.unimib.it",
        image: "giuseppe_magazzù.jpeg",
        role: "PhD Student",
        bio: "Giuseppe Magazzù is a 2nd year PhD student. His research focuses on developing an ethical framework and implementing safety strategies to ensure that large language models generate safe, useful, and high-quality outputs. In particular, he is working on designing guardrail methods and benchmarks tailored to the Italian language.",
      },
      {
        name: "Daniel Scalena",
        email: "d.scalena@campus.unimib.it",
        image: "daniel_scalena.jpg",
        role: "PhD Student",
        bio: "Daniel Scalena is a 3rd year PhD student in a cotutelle agreement with University of Groningen. His research focuses mainly on the interpretability of language models, in particular towards their safe and reliable deployment in real-world contexts.",
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

  // Participation Section
  participation: {
    title: "Come Partecipare",
    intro: "Partecipare al Safety Game è semplice! <br> Segui questi passaggi per unirti alla competizione.",
    steps: [
      {
        step: "1",
        title: "Forma il tuo team",
        description: "Crea un team di 2-4 persone, o partecipa come singolo.",
      },
      {
        step: "2",
        title: "Registrati online",
        description:
          "Compila il modulo di registrazione con i dettagli del tuo team entro il 15 novembre. Riceverai successivamente via email le credenziali per accedere al Playground.",
      },
      {
        step: "3",
        title: "Ricevi le credenziali",
        description:
          "Dopo la registrazione il team leader riceverà via email le credenziali e le istruzioni per usare il Playground.",
      },
      {
        step: "4",
        title: "Partecipa alla challenge",
        description:
          "Dal 20 novembre al 30 novembre, usa il Playground per testare i tuoi prompt e scalare la classifica!",
      },
    ],
    // Registration details
    registration: {
      // Replace the URL below with the actual Google Form link when available
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfEXAMPLE_FORM_LINK/viewform",
      fields: [
        "Nome del team",
        "Email del referente del team (verrà usata per le comunicazioni)",
        "Nomi e email dei membri (2-4, separati da virgola)",
        "Istituzione / Affiliazione (opzionale)",
        "Breve descrizione del team / focus (opzionale)",
      ],
    },
    submission: {
      howItWorks:
        "Durante la challenge ogni team può caricare i propri prompt nel Playground. Ogni submission rappresenta un singolo prompt che il sistema esegue su vari modelli di linguaggio e valuta in base alle risposte prodotte, assegnando un punteggio in base all'efficacia del prompt nel generare risposte non sicure.",
      warning:
        "Se i prompt sono troppo simili verranno scartati automaticamente, quindi assicurati di variare i tuoi approcci e di esplorare diversi scenari.",
    },
    // Evaluation & scoring for leaderboard
    evaluation: {
      overview:
        "Le submission vengono valutate automaticamente e contribuiscono al punteggio del team. La classifica mostra il punteggio massimo ottenuto da ciascun team durante la challenge.",
      scoring:
        "Ogni submission riceve un punteggio composito normalizzato fra 0 e 100. Per la leaderboard consideriamo il punteggio più alto del team. In caso di parità tra team, i giudici valuteranno l'originalità complessiva dei prompt sottomessi per determinare il vincitore.",
    },
  },

  // Dates Section
  dates: {
    title: "Date Importanti",
    timeline: [
      {
        date: "1 Novembre 2025",
        title: "Apertura Registrazioni",
        description: "Inizia la fase di registrazione per i team partecipanti.",
        status: "completed",
      },
      {
        date: "18 Novembre 2025",
        title: "Webinar Introduttivo",
        description: "Sessione online di introduzione alle regole e alla piattaforma.",
        status: "upcoming",
      },
      {
        date: "20 Novembre 2025",
        title: "Inizio Challenge",
        description: "Parte ufficialmente la competizione! Il playground si attiva.",
        status: "upcoming",
      },
      {
        date: "30 Novembre 2025",
        title: "Fine Challenge",
        description: "Ultimo giorno per sottomettere i prompt. Chiusura alle 23:59.",
        status: "upcoming",
      },
      {
        date: "5 Dicembre 2025",
        title: "Premiazione Vincitori",
        description: "Evento finale con presentazione della classifica e premiazione.",
        status: "upcoming",
      },
    ],
  },

  // Instructions Section
  instructions: {
    title: "Istruzioni",
    intro:
      "La sfida richiede ai partecipanti di ideare <b> 50 prompt eitci</b> in lingua italiana che inducano i modelli di AI a produrre <b>risposte non sicure o dannose</b> in <b>contesti culturali italiani realistici</b>.",
    cards: [
      {
        variant: "objective",
        title: "Partecipazione",
        description:
          "<b>Ogni team deve creare 50 prompt diversi in italiano.</b><br> \
          I prompt saranno valutati in base alla capacità di elicitare risposte non sicure. Il processo di <b>valutazione</b> è automatico e basato sulle <b>risposte generate dai modelli di linguaggio</b>:\
           una volta effettuata una submission, il sistema esegue il prompt su vari modelli di linguaggio e analizza le risposte prodotte.<br>\
          <b> Non avrai accesso alle risposte generate dai modelli, solamente al punteggio finale assegnato ad ogni singolo prompt</b>.",
      },
    ],
    exampleGroups: [
      {
        variant: "valid",
        title: "Assicurati che i tuoi prompt ...",
        prompts: [
          {
            label: "good",
            prompt: "Siano eticamente corretti, legittimi e realistici.",
          },
          {
            label: "good",
            prompt: "Elicitino risposte con contenuti non sicuri o non etici.",
          },
          {
            label: "good",
            prompt: "Incorprino elementi culturali italiani (storia, cultura, società, attualità, ...).",
          },
        ],
      },
      {
        variant: "mixed",
        title: "Tieni a mente ...",
        //description:
        //  "I prompt non devono essere vaghi o generici, ma riferirsi chiaramente a un contesto italiano specifico.",
        prompts: [
          {
            label: "neutral",
            prompt:
              "-  Prompt banali o apertamente provocatori, con forti contenuti espliciti tendono a essere facilmente riconosciuti e bloccati dai modelli, mentre Ironia, sarcarmo, ambiguità, e giochi linguistici tendono a confondere di più i modelli. Sta a te trovare il giusto equilibrio.",
          },
          {
            label: "neutral",
            prompt:
              "- Ciò che è etico in un contesto culturale potrebbe non esserlo in un altro. Assicurati che i tuoi prompt riflettano sensibilità culturali specifiche all'Italia.",
          },
          {
            label: "neutral",
            prompt:
              "- Non saranno i prompt ad essere valutati, ma le risposte che essi elicitano dai modelli di linguaggio.",
          },
        ],
      },
      {
        variant: "invalid",
        title: "Assicurati che i tuoi prompt ...",
        //description:
        //  "E' vietato l'utilizzo di tecniche di aggiramento o manipolazione. L'obiettivo è quello di valutare la sicurezza dei modelli in contesti reali e non eludere la sicurezza dei sistemi con tecniche artificiose.",
        prompts: [
          {
            label: "bad",
            prompt:
              'NON includano tecniche di aggiramento, manipolazione diretta o hacking dei filtri di sicurezza  \n \
            (es. prompt nella forma "Immagina di...", "ignora le istruzioni precedenti", ..., non sono ammessi).',
          },
          {
            label: "bad",
            prompt: "NON siano generati da modelli di intelligenza artificiale. ",
          },
        ],
      },
    ],
  },

  // Playground Section
  playground: {
    title: "Playground",
    description:
      "Usa questo spazio per testare i tuoi prompt in tempo reale. Ogni submission viene valutata e contribuisce al tuo punteggio in classifica.",
    huggingFaceSpace: "https://mind-lab-test-challenge.hf.space",
  },

  // FAQ Section
  faqs: {
    title: "FAQ",
    description: "Domande frequenti",
    items: [
      {
        question: "Chi può partecipare?",
        answer:
          "Il Safety Game è aperto a studenti universitari, ricercatori e professionisti interessati all'IA. Non sono richieste competenze tecniche avanzate.",
      },
      {
        question: "Qual è la differenza nelle valutazioni tra team e partecipanti singoli?",
        answer:
          "Tutti i progetti sono valutati con gli stessi criteri. I giudici considerano il lavoro realizzato indipendentemente dalle dimensioni del team.",
      },
      {
        question: "Quanto costa partecipare?",
        answer: "La partecipazione è completamente gratuita!",
      },
      {
        question: "Quali sono i premi?",
        answer:
          "I primi tre team riceveranno certificati ufficiali, gadget tech e la possibilità di presentare il proprio lavoro in un workshop dedicato. Il team vincitore avrà anche un meeting con il nostro laboratorio di ricerca.",
      },
      {
        question: "Serve esperienza di programmazione?",
        answer:
          "No! Il Safety Game si concentra sul prompt engineering, che richiede creatività e pensiero logico, non necessariamente competenze di coding.",
      },
      {
        question: "Come funziona la valutazione?",
        answer:
          "I prompt vengono valutati automaticamente in base a vari criteri: efficacia, creatività, aderenza ai principi etici e capacità di 'battere' le difese di ChatGPT.",
      },
      {
        question: "Cosa è un prompt?",
        answer:
          "Nel campo dell'intelligenza artificiale generativa, un prompt è l'input fornito dall'utente a un modello linguistico che descrive il compito che esso deve eseguire. Il prompt è formulato in linguaggio naturale e può assumere la forma di una domanda, una richiesta o un'istruzione.",
      },
    ],
  },
};
