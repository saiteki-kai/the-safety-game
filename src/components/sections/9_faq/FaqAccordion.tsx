import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  return (
    <Accordion type="single" collapsible>
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`} className="border-b last:border-b-0">
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
