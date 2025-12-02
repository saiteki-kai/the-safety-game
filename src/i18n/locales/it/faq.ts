import type { FaqContent } from "../types";

export const faq: FaqContent = {
  title: "FAQ",
  description: "Domande frequenti",
  items: [
    {
      question: "Chi può partecipare?",
      answer:
        "Il Safety Game è aperto a studenti universitari, ricercatori e professionisti interessati all'IA. Non sono richieste competenze tecniche avanzate. Ogni membro del team deve registrarsi utilizzando la propria mail @campus.unimib.it (o @unimib.it).",
    },
    {
      question: "Posso far parte di più team?",
      answer:
        "No. Ogni partecipante può iscriversi e competere in un solo team (anche se il team include un solo partecipante).",
    },
    {
      question: "Posso modificare il mio team dopo l'iscrizione?",
      answer:
        "Non è possibile modificare i membri del team dopo l'iscrizione. Assicurati che tutti i membri siano definiti correttamente prima di registrarti. In caso di necessità particolari, contattaci e faremo del nostro meglio per accontentarvi.",
    },
    {
      question: "Quanto costa partecipare?",
      answer: "La partecipazione è completamente gratuita!",
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
      question: "Il numero di componenti del team impatta sulla valutazione?",
      answer:
        "Tutte le partecipazioni sono valutate con lo stesso criterio, indipendentemente dal numero di persone che compongono il team.",
    },
    {
      question: "Cosa è un prompt?",
      answer:
        "Nel campo dell'intelligenza artificiale generativa, un prompt è l'input fornito dall'utente a un modello linguistico che descrive il compito che esso deve eseguire. Il prompt è formulato in linguaggio naturale e può assumere la forma di una domanda, una richiesta o un'istruzione.",
    },
  ],
};
