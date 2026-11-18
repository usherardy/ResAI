"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, CircleAlertIcon, LoaderCircleIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  LIMITS,
  fieldErrorsFrom,
  locationCounts,
  posSystems,
  restaurantTypes,
  waitlistSchema,
} from "@/lib/waitlist/schema";

type Values = {
  email: string;
  businessName: string;
  name: string;
  restaurantType: string;
  currentPos: string;
  locations: string;
  frustration: string;
  researchConsent: boolean;
};

const emptyValues: Values = {
  email: "",
  businessName: "",
  name: "",
  restaurantType: "",
  currentPos: "",
  locations: "",
  frustration: "",
  researchConsent: false,
};

/** Order used to move focus to the first invalid field. */
const fieldOrder: (keyof Values)[] = [
  "email",
  "businessName",
  "name",
  "restaurantType",
  "currentPos",
  "locations",
  "frustration",
];

type Status = "idle" | "submitting" | "success";

type ApiResponse = {
  ok: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

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

export function WaitlistForm() {
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

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
          website: honeypot,
          elapsedMs: Date.now() - startedAt.current,
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
    const firstName = values.name.trim().split(/\s+/)[0];
    return (
      <div className="flex min-h-[28rem] flex-col justify-center py-6" role="status">
        <span className="flex size-10 items-center justify-center rounded-full bg-success text-white">
          <CheckIcon className="size-5" strokeWidth={3} aria-hidden="true" />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-5 text-2xl font-semibold tracking-tight outline-none"
        >
          You&apos;re on the list{firstName ? `, ${firstName}` : ""}.
        </h3>
        <p className="mt-3 max-w-md text-muted-foreground">
          We&apos;ll email{" "}
          <span className="font-medium text-foreground">{submittedEmail}</span>{" "}
          as early access opens up
          {values.researchConsent
            ? ". Since you said you're open to it, we may also reach out about a short research call."
            : "."}{" "}
          No spam, and we won&apos;t sell your information.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          Changed your mind?{" "}
          <Link href="/opt-out" className="font-medium text-foreground underline underline-offset-4">
            Opt out anytime
          </Link>
          .
        </p>
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
      aria-describedby={`${id("privacy")}`}
      aria-busy={submitting}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("email")} label="Email" required error={errors.email} className="sm:col-span-2">
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
            className="h-10 bg-card"
          />
        </Field>

        <Field id={id("businessName")} label="Restaurant or business name" required error={errors.businessName}>
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
            className="h-10 bg-card"
          />
        </Field>

        <Field id={id("name")} label="Your name" error={errors.name}>
          <Input
            id={id("name")}
            name="name"
            autoComplete="name"
            placeholder="Jordan Lee"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            maxLength={LIMITS.name}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="h-10 bg-card"
          />
        </Field>

        <Field id={id("restaurantType")} label="Type of business" error={errors.restaurantType}>
          <NativeSelect
            id={id("restaurantType")}
            name="restaurantType"
            aria-invalid={Boolean(errors.restaurantType)}
            aria-describedby={describedBy("restaurantType")}
            value={values.restaurantType}
            onChange={(e) => set("restaurantType", e.target.value)}
          >
            <option value="">Select…</option>
            {restaurantTypes.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <Field id={id("currentPos")} label="Current POS" error={errors.currentPos}>
          <NativeSelect
            id={id("currentPos")}
            name="currentPos"
            aria-invalid={Boolean(errors.currentPos)}
            aria-describedby={describedBy("currentPos")}
            value={values.currentPos}
            onChange={(e) => set("currentPos", e.target.value)}
          >
            <option value="">Select…</option>
            {posSystems.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <Field id={id("locations")} label="Number of locations" error={errors.locations} className="sm:col-span-2">
          <NativeSelect
            id={id("locations")}
            name="locations"
            aria-invalid={Boolean(errors.locations)}
            aria-describedby={describedBy("locations")}
            value={values.locations}
            onChange={(e) => set("locations", e.target.value)}
          >
            <option value="">Select…</option>
            {locationCounts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <Field
          id={id("frustration")}
          label="What’s your biggest POS frustration?"
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
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/60 p-3.5">
        <Checkbox
          id={id("researchConsent")}
          checked={values.researchConsent}
          onCheckedChange={(checked) => set("researchConsent", checked === true)}
          className="mt-0.5 bg-card"
        />
        <Label
          htmlFor={id("researchConsent")}
          className="block text-sm leading-snug font-normal text-foreground"
        >
          I&apos;m open to a short research call (about 20–30 minutes) about how
          I run my restaurant.{" "}
          <span className="text-muted-foreground">Optional.</span>
        </Label>
      </div>

      {/* Honeypot: hidden from people and assistive tech. Bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input
          id={id("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

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

      <div className="space-y-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-wait disabled:opacity-80"
        >
          {submitting ? (
            <>
              <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
              Joining…
            </>
          ) : (
            <>
              Join the early-access waitlist
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
        <p id={id("privacy")} className="text-xs leading-relaxed text-muted-foreground">
          We&apos;ll use your details to contact you about ResAI early access
          and, if you check the box above, a research call. We won&apos;t sell
          your information. You can{" "}
          <Link href="/opt-out" className="underline underline-offset-2 hover:text-foreground">
            opt out
          </Link>{" "}
          anytime. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="flex items-baseline justify-between gap-2">
        <span>
          {label}
          {required ? (
            <span className="text-brand-strong" aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
        </span>
        {required ? (
          <span className="sr-only">(required)</span>
        ) : (
          <span className="text-xs font-normal text-muted-foreground">Optional</span>
        )}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
