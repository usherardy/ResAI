import { ArrowRightIcon } from "lucide-react";
import { AgentDemo } from "@/components/demo/agent-demo";
import { Container } from "@/components/site/section";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-dot-grid absolute inset-x-0 top-0 -z-10 h-[52rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[34rem] left-1/2 -z-10 h-[28rem] w-[min(64rem,100%)] -translate-x-1/2 rounded-full bg-brand/[0.07] blur-3xl"
      />

      <Container className="pt-10 pb-10 text-center sm:pt-16 sm:pb-12">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-[12px] text-muted-foreground shadow-xs backdrop-blur sm:text-[13px]">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
          The AI-native operating system for restaurants
        </p>

        <h1
          id="hero-title"
          className="mx-auto mt-6 max-w-4xl text-[2.85rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-7xl lg:text-[5.1rem]"
        >
          Run your restaurant.{" "}
          <span className="block font-serif font-normal tracking-[-0.02em] italic">
            Just ask<span className="text-brand">.</span>
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
          Create menus, change prices, understand revenue, and troubleshoot
          your POS by talking to your restaurant&apos;s AI agent.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#waitlist"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-medium text-background shadow-[0_1px_2px_oklch(0_0_0/0.2),inset_0_1px_0_oklch(1_0_0/0.12)] transition-colors hover:bg-foreground/85 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:w-auto"
          >
            Join the early-access waitlist
            <ArrowRightIcon
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-card px-6 text-[15px] font-medium text-foreground shadow-xs transition-colors hover:border-foreground/20 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:w-auto"
          >
            See how it works
          </a>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Built for US restaurants, cafés, and bars.
        </p>
      </Container>

      <Container className="pb-20 sm:pb-28">
        <div id="demo" className="mx-auto max-w-5xl">
          <h2 className="sr-only">Interactive concept preview</h2>
          <AgentDemo />
          <p className="mx-auto mt-5 max-w-2xl text-center text-[13px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Concept preview with example data.</span>{" "}
            ResAI isn&apos;t live yet. These responses are scripted to show how
            it&apos;s designed to work. Pick a prompt, or type your own.
          </p>
        </div>
      </Container>
    </section>
  );
}
