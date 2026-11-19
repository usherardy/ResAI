import { Container } from "@/components/site/section";

const steps = [
  { word: "Ask", body: "Type what you need, the way you’d tell a manager." },
  { word: "Review", body: "See exactly what will change before anything happens." },
  { word: "Approve", body: "Nothing goes live without your OK." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 pb-24 sm:pb-32">
      <Container>
        <h2
          id="how-title"
          className="text-center text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
        >
          How it works
        </h2>
        <ol className="mx-auto mt-10 grid max-w-5xl gap-12 text-center sm:grid-cols-3 sm:gap-8">
          {steps.map((step, i) => (
            <li key={step.word}>
              <p className="text-[13px] font-medium text-muted-foreground tabular">0{i + 1}</p>
              <p className="mt-2 font-display text-[3.25rem] leading-none font-medium tracking-[-0.05em] sm:text-[4rem]">
                {step.word}
              </p>
              <p className="mx-auto mt-4 max-w-[16rem] text-[16px] leading-relaxed text-pretty text-foreground/75">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
