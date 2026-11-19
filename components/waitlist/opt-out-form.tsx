"use client";

import { useId, useRef, useState } from "react";
import { CheckIcon, CircleAlertIcon, LoaderCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/site";
import { fieldErrorsFrom, optOutSchema } from "@/lib/waitlist/schema";

type Status = "idle" | "submitting" | "success";

export function OptOutForm() {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setError(null);

    const parsed = optOutSchema.safeParse({ email });
    if (!parsed.success) {
      setError(fieldErrorsFrom(parsed.error).email ?? "Enter a valid email address.");
      inputRef.current?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/opt-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (response.ok && data.ok) {
        setMessage(data.message ?? "Done.");
        setStatus("success");
        return;
      }
      setStatus("idle");
      setError(
        response.status === 503
          ? `This form is temporarily unavailable. Email ${siteConfig.contactEmail} with the subject “Opt out” and we’ll remove you by hand.`
          : (data.message ?? "Something went wrong. Please try again."),
      );
    } catch {
      setStatus("idle");
      setError("We couldn’t reach our server. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-white">
          <CheckIcon className="size-3" strokeWidth={3} aria-hidden="true" />
        </span>
        {message}
      </p>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${uid}-email`}>Email address</Label>
        <Input
          ref={inputRef}
          id={`${uid}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${uid}-error` : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 bg-card"
        />
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Leave this field empty</label>
        <input
          id={`${uid}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div aria-live="assertive">
        {error ? (
          <p
            id={`${uid}-error`}
            role="alert"
            className="flex items-start gap-2 text-sm text-destructive"
          >
            <CircleAlertIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-80"
      >
        {status === "submitting" ? (
          <>
            <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Stop contacting me"
        )}
      </button>
    </form>
  );
}
