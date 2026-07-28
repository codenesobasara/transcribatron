import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion type="single" collapsible className="max-w-3xl mx-auto">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="border-sep">
          <AccordionTrigger className="text-left text-lg font-medium text-ink hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-ink-2 text-base leading-relaxed">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
