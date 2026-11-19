import { Container } from "@/components/site/section";

const steps = [
  { word: "Ask", body: "Type what you need, the way you’d tell a manager." },
  { word: "Review", body: "See exactly what will change before anything happens." },
  { word: "Approve", body: "Nothing goes live without your OK." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 pb-16 sm:pb-32">
      <Container>
        <h2
          id="how-title"
          className="text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase sm:text-center"
        >
          How it works
        </h2>
        {/* Rows on phones, three big columns from tablet width up. */}
        <ol className="mx-auto mt-6 grid max-w-5xl sm:mt-10 sm:grid-cols-3 sm:gap-8 sm:text-center">
          {steps.map((step, i) => (
            <li
              key={step.word}
              className="grid grid-cols-[2.25rem_1fr] items-baseline gap-x-2 border-t border-border py-5 sm:block sm:border-0 sm:py-0"
            >
              <p className="text-[13px] font-medium text-muted-foreground tabular">0{i + 1}</p>
              <p className="font-display text-[2rem] leading-none font-medium tracking-[-0.045em] sm:mt-2 sm:text-[4rem] sm:tracking-[-0.05em]">
                {step.word}
              </p>
              <p className="col-start-2 mt-2 text-[15px] leading-snug text-pretty text-foreground/75 sm:mx-auto sm:mt-4 sm:max-w-[16rem] sm:text-[16px] sm:leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
