import { Container } from "@/components/site/section";

export function LegalPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: React.ReactNode;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-16 sm:py-24">
      <article className="mx-auto max-w-2xl">
        <header className="border-b border-border pb-8">
          <h1 className="font-display text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[3.25rem]">{title}</h1>
          {updated ? (
            <p className="mt-4 font-mono text-xs text-muted-foreground uppercase">
              Effective {updated}
            </p>
          ) : null}
          {intro ? (
            <div className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</div>
          ) : null}
        </header>
        <div className="text-[15.5px] leading-relaxed text-foreground/90 [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_li]:mt-2 [&_p]:mt-4 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:marker:text-muted-foreground">
          {children}
        </div>
      </article>
    </Container>
  );
}
