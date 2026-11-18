import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container, SectionHeading } from "@/components/site/section";
import { faqs } from "@/lib/faq";
import { siteConfig } from "@/lib/site";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Straight answers." />
          <p className="mt-4 max-w-sm text-muted-foreground">
            Something else on your mind? Email{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {siteConfig.contactEmail}
            </a>
            . A person reads every message.
          </p>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["item-0", "item-1"]}
          className="border-t border-border"
        >
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.question} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="py-5 text-base font-medium hover:no-underline focus-visible:ring-ring/50 [&[data-state=open]]:text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                {faq.answer}
                {faq.question.startsWith("What do you do with my information") ? (
                  <>
                    {" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-foreground underline underline-offset-4"
                    >
                      Read the Privacy Policy
                    </Link>
                    .
                  </>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
