import { FileTextIcon, LockIcon, ShieldCheckIcon } from "lucide-react";
import { Container } from "@/components/site/section";
import { sectionTitle } from "@/components/v2/styles";
import { cn } from "@/lib/utils";

const points = [
  {
    icon: FileTextIcon,
    title: "Every change is a draft",
    body: "ResAI shows you exactly what it will change before anything happens.",
  },
  {
    icon: ShieldCheckIcon,
    title: "You approve it",
    body: "Nothing goes live in your POS until you say so.",
  },
  {
    icon: LockIcon,
    title: "Your data stays yours",
    body: "We don't sell your information. Opt out anytime.",
  },
];

export function Trust() {
  return (
    <section aria-labelledby="trust-title" className="py-16 sm:py-28">
      <Container>
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[oklch(0.93_0.02_75)] px-6 py-14 text-center sm:px-12 sm:py-20">
          <h2 id="trust-title" className={cn(sectionTitle, "mx-auto max-w-2xl")}>
            Nothing changes without <em className="italic">your OK.</em>
          </h2>
          <ul className="mt-12 grid gap-8 text-left sm:grid-cols-3 sm:gap-6">
            {points.map((point) => (
              <li key={point.title}>
                <span className="flex size-10 items-center justify-center rounded-full bg-white text-foreground shadow-sm">
                  <point.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[17px] font-medium">{point.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-foreground/70">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
