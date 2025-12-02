import type { FaqContent } from "../types";

export const faq: FaqContent = {
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
};
