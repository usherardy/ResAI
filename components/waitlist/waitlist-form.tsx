"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, CircleAlertIcon, LoaderCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  LIMITS,
  fieldErrorsFrom,
  locationCounts,
  posProblems,
  waitlistSchema,
} from "@/lib/waitlist/schema";

type Values = {
  businessName: string;
  email: string;
  phone: string;
  website: string;
  locations: string;
  posProblems: string[];
  frustration: string;
};

const emptyValues: Values = {
  businessName: "",
  email: "",
  phone: "",
  website: "",
  locations: "",
  posProblems: [],
  frustration: "",
};

/** Order used to move focus to the first invalid field. */
const fieldOrder: (keyof Values)[] = [
  "businessName",
  "email",
  "phone",
  "website",
  "locations",
  "posProblems",
  "frustration",
];

type Status = "idle" | "submitting" | "success";

type ApiResponse = {
  ok: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Everything worth keeping while the form is closed: what they typed, whether
 * they already joined, and when they started (for the server's bot timing
 * check). The slide-in panel holds one of these so closing it by accident
 * doesn't wipe the form.
 */
export type WaitlistDraft = {
  values: Values;
  setValues: React.Dispatch<React.SetStateAction<Values>>;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  submittedEmail: string;
  setSubmittedEmail: React.Dispatch<React.SetStateAction<string>>;
  markStarted: () => void;
  elapsedMs: () => number;
};

export function useWaitlistDraft(): WaitlistDraft {
  const [values, setValues] = useState<Values>(emptyValues);
  const [status, setStatus] = useState<Status>("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const startedAt = useRef(0);

  const markStarted = useCallback(() => {
    if (!startedAt.current) startedAt.current = Date.now();
  }, []);
  const elapsedMs = useCallback(() => Date.now() - startedAt.current, []);

  return {
    values,
    setValues,
    status,
    setStatus,
    submittedEmail,
    setSubmittedEmail,
    markStarted,
    elapsedMs,
  };
}

function readUtm() {
  try {
    const params = new URLSearchParams(window.location.search);
    const pick = (key: string) => params.get(key)?.slice(0, LIMITS.utm) || undefined;
    return {
      utmSource: pick("utm_source"),
      utmMedium: pick("utm_medium"),
      utmCampaign: pick("utm_campaign"),
    };
  } catch {
    return {};
  }
}

type WaitlistFormProps = {
  /** Shared draft. Without one, the form keeps its own state. */
  draft?: WaitlistDraft;
  /** Shows a "Back to the site" button on the success screen. */
  onDone?: () => void;
  /** Rows rise in one after another when the form mounts (join page). */
  animated?: boolean;
};

export function WaitlistForm({ draft, onDone, animated = false }: WaitlistFormProps) {
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  const ownDraft = useWaitlistDraft();
  const { values, setValues, status, setStatus, submittedEmail, setSubmittedEmail, markStarted, elapsedMs } =
    draft ?? ownDraft;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    markStarted();
  }, [markStarted]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const set = <K extends keyof Values>(field: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const toggleProblem = (value: string, checked: boolean) => {
    const next = checked
      ? [...values.posProblems, value]
      : values.posProblems.filter((v) => v !== value);
    set("posProblems", next);
  };

  const focusFirstError = (fieldErrors: Record<string, string>) => {
    const first = fieldOrder.find((f) => fieldErrors[f]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`);
    el?.focus();
  };

  const validateField = (field: keyof Values) => {
    const result = waitlistSchema.safeParse(values);
    const fieldErrors = result.success ? {} : fieldErrorsFrom(result.error);
    setErrors((current) => {
      const next = { ...current };
      if (fieldErrors[field]) next[field] = fieldErrors[field];
      else delete next[field];
      return next;
    });
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setFormError(null);

    const local = waitlistSchema.safeParse(values);
    if (!local.success) {
      const fieldErrors = fieldErrorsFrom(local.error);
      setErrors(fieldErrors);
      setFormError("Please check the highlighted fields.");
      focusFirstError(fieldErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          ...readUtm(),
          honeypot,
          elapsedMs: elapsedMs(),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (response.ok && data.ok) {
        setSubmittedEmail(local.data.email);
        setStatus("success");
        return;
      }

      setStatus("idle");
      if (response.status === 400 && data.fieldErrors) {
        setErrors(data.fieldErrors);
        setFormError(data.message ?? "Please check the highlighted fields.");
        focusFirstError(data.fieldErrors);
      } else if (response.status === 503) {
        setFormError(
          `Signups are temporarily unavailable, and your details weren’t saved. Please try again later, or email ${siteConfig.contactEmail} and we’ll add you.`,
        );
      } else {
        setFormError(
          data.message ??
            "Something went wrong, and your details weren’t saved. Please try again.",
        );
      }
    } catch {
      setStatus("idle");
      setFormError(
        "We couldn’t reach our server, so your details weren’t saved. Check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col py-6" role="status">
        <span className="flex size-10 items-center justify-center rounded-full bg-success text-white">
          <CheckIcon className="size-5" strokeWidth={3} aria-hidden="true" />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-5 text-2xl font-semibold tracking-tight outline-none"
        >
          You&apos;re on the list.
        </h3>
        <p className="mt-3 max-w-md text-muted-foreground">
          We&apos;ll email{" "}
          <span className="font-medium text-foreground">{submittedEmail}</span>{" "}
          as early access opens up. No spam, and we won&apos;t sell your
          information.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          Changed your mind?{" "}
          <Link href="/opt-out" className="font-medium text-foreground underline underline-offset-4">
            Opt out anytime
          </Link>
          .
        </p>
        {onDone ? (
          <button
            type="button"
            onClick={onDone}
            className="mt-8 inline-flex h-11 w-fit items-center justify-center rounded-full border border-foreground/80 px-5 text-[15px] font-medium transition-colors hover:bg-foreground/5 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Back to the site
          </button>
        ) : null}
      </div>
    );
  }

  const submitting = status === "submitting";
  const describedBy = (field: string, extra?: string) =>
    [errors[field] ? `${id(field)}-error` : null, extra].filter(Boolean).join(" ") ||
    undefined;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-describedby={id("privacy")}
      aria-busy={submitting}
      className={cn(
        "grid gap-x-4 gap-y-5 sm:grid-cols-2",
        animated && "stagger-rise [--stagger-delay:380ms] [--stagger-step:45ms]",
      )}
    >
      <Field
        id={id("businessName")}
        label="Restaurant or company name"
        required
        error={errors.businessName}
        className="sm:col-span-2"
      >
        <Input
          id={id("businessName")}
          name="businessName"
          autoComplete="organization"
          placeholder="Corner Slice"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.businessName)}
          aria-describedby={describedBy("businessName")}
          maxLength={LIMITS.businessName}
          value={values.businessName}
          onChange={(e) => set("businessName", e.target.value)}
          onBlur={() => values.businessName && validateField("businessName")}
          className="h-11 bg-card"
        />
      </Field>

      <Field id={id("email")} label="Email" required error={errors.email}>
        <Input
          id={id("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@yourrestaurant.com"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("email")}
          maxLength={LIMITS.email}
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => values.email && validateField("email")}
          className="h-11 bg-card"
        />
      </Field>

      <Field
        id={id("phone")}
        label="Phone"
        required
        error={errors.phone}
        hint="Only used to reach you about early access."
      >
        <Input
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(415) 555-0134"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy("phone", `${id("phone")}-hint`)}
          maxLength={LIMITS.phone}
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          onBlur={() => values.phone && validateField("phone")}
          className="h-11 bg-card"
        />
      </Field>

      <Field id={id("website")} label="Website" error={errors.website}>
        <Input
          id={id("website")}
          name="website"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="cornerslice.com"
          aria-invalid={Boolean(errors.website)}
          aria-describedby={describedBy("website")}
          maxLength={LIMITS.website}
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
          onBlur={() => values.website && validateField("website")}
          className="h-11 bg-card"
        />
      </Field>

      <ChoiceGroup legend="How many locations?" error={errors.locations} errorId={`${id("locations")}-error`}>
        <div className="grid grid-cols-4 gap-1 rounded-full bg-surface p-1">
          {locationCounts.map((option, index) => (
            <label
              key={option.value}
              className="relative flex h-9 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-foreground/80 transition-colors hover:text-foreground has-checked:bg-foreground has-checked:text-background has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
            >
              <input
                id={index === 0 ? id("locations") : undefined}
                type="radio"
                name="locations"
                value={option.value}
                checked={values.locations === option.value}
                onChange={() => set("locations", option.value)}
                onClick={() => {
                  // Tapping the selected option again clears it (it's optional).
                  if (values.locations === option.value) set("locations", "");
                }}
                aria-describedby={describedBy("locations")}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </ChoiceGroup>

      <ChoiceGroup
        legend="What’s not working with your POS?"
        hint="Pick any that apply."
        error={errors.posProblems}
        errorId={`${id("posProblems")}-error`}
        className="sm:col-span-2"
      >
        <div className="flex flex-wrap gap-2">
          {posProblems.map((option, index) => {
            const checked = values.posProblems.includes(option.value);
            return (
              <label
                key={option.value}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm leading-tight text-foreground/85 transition-colors select-none hover:border-foreground/30 hover:text-foreground has-checked:border-brand has-checked:bg-brand-soft has-checked:text-foreground has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
              >
                <input
                  id={index === 0 ? id("posProblems") : undefined}
                  type="checkbox"
                  name="posProblems"
                  value={option.value}
                  checked={checked}
                  onChange={(e) => toggleProblem(option.value, e.target.checked)}
                  aria-describedby={describedBy("posProblems")}
                  className="sr-only"
                />
                {checked ? (
                  <CheckIcon className="-ms-0.5 size-3.5 text-brand-strong" strokeWidth={3} aria-hidden="true" />
                ) : null}
                {option.label}
              </label>
            );
          })}
        </div>
      </ChoiceGroup>

      <Field
        id={id("frustration")}
        label="Anything else?"
        error={errors.frustration}
        className="sm:col-span-2"
      >
        <Textarea
          id={id("frustration")}
          name="frustration"
          rows={3}
          placeholder="Changing a modifier takes 10 clicks. The printer drops off every Friday night…"
          aria-invalid={Boolean(errors.frustration)}
          aria-describedby={describedBy("frustration", `${id("frustration")}-count`)}
          maxLength={LIMITS.frustration}
          value={values.frustration}
          onChange={(e) => set("frustration", e.target.value)}
          className="min-h-24 bg-card"
        />
        <p
          id={`${id("frustration")}-count`}
          className="mt-1.5 text-right text-xs text-muted-foreground tabular"
        >
          {values.frustration.length}/{LIMITS.frustration}
        </p>
      </Field>

      {/* Honeypot: hidden from people and assistive tech. Bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("url")}>Leave this field empty</label>
        <input
          id={id("url")}
          name="url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Stays in view at the bottom of the panel while the questions scroll,
          so the button and any submit error are always visible. The fade
          above it keeps scrolled content from being cut off hard. */}
      <div className="sticky bottom-0 -mx-1 space-y-3 bg-background px-1 pt-2 pb-1 sm:col-span-2 before:pointer-events-none before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-linear-to-t before:from-background before:to-transparent">
        <div aria-live="assertive" aria-atomic="true">
          {formError ? (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive"
            >
              <CircleAlertIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {formError}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-center text-[16px] font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-wait disabled:opacity-80"
        >
          {submitting ? (
            <>
              <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
              Joining…
            </>
          ) : (
            <>
              Join the waitlist
              <ArrowRightIcon
                className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>
      <p id={id("privacy")} className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">
        We&apos;ll use your details to contact you by email or phone about
        ResAI early access. We won&apos;t sell your information. You can{" "}
        <Link href="/opt-out" className="underline underline-offset-2 hover:text-foreground">
          opt out
        </Link>{" "}
        anytime. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

function RequiredMark({ required }: { required?: boolean }) {
  return required ? (
    <>
      <span className="text-brand-strong" aria-hidden="true">
        {" "}
        *
      </span>
      <span className="sr-only"> (required)</span>
    </>
  ) : null;
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="flex items-baseline justify-between gap-2">
        <span>
          {label}
          <RequiredMark required={required} />
        </span>
        {required ? null : (
          <span className="text-xs font-normal text-muted-foreground">Optional</span>
        )}
      </Label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-[13px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** A fieldset for radio/checkbox pills. Always optional in this form. */
function ChoiceGroup({
  legend,
  hint,
  error,
  errorId,
  className,
  children,
}: {
  legend: string;
  hint?: string;
  error?: string;
  errorId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={cn("min-w-0 space-y-2.5", className)}>
      <legend className="flex w-full items-baseline justify-between gap-2 text-sm leading-snug font-medium">
        <span>{legend}</span>
        <span className="text-xs font-normal text-muted-foreground">Optional</span>
      </legend>
      {hint ? <p className="-mt-1 text-[13px] text-muted-foreground">{hint}</p> : null}
      {children}
      {error ? (
        <p id={errorId} className="text-[13px] text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
