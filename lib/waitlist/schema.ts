import { z } from "zod";

/**
 * Waitlist schema shared by the form (instant feedback) and the API route
 * (authoritative). Keep in sync with the CHECK constraints in
 * supabase/migrations/*.sql.
 */

export const locationCounts = [
  { value: "1", label: "1" },
  { value: "2-5", label: "2–5" },
  { value: "6-10", label: "6–10" },
  { value: "11+", label: "11+" },
] as const;

/** Tap-to-select answers for "What’s not working with your POS?" */
export const posProblems = [
  { value: "menu_updates", label: "Menu and price changes take too long" },
  { value: "hardware", label: "Printers or hardware keep failing" },
  { value: "reports", label: "Sales reports are hard to understand" },
  { value: "support", label: "Support is slow or unhelpful" },
  { value: "fees", label: "Fees are too high" },
  { value: "integrations", label: "Doesn’t work with my other tools" },
  { value: "training", label: "Hard to train new staff" },
] as const;

type Options = readonly { value: string; label: string }[];

function values<T extends Options>(options: T) {
  return options.map((o) => o.value) as unknown as [
    T[number]["value"],
    ...T[number]["value"][],
  ];
}

export const LIMITS = {
  email: 254,
  businessNameMin: 2,
  businessName: 120,
  /** Raw input length. Stored numbers are always 12 characters (+1XXXXXXXXXX). */
  phone: 30,
  website: 200,
  frustration: 1000,
  utm: 100,
} as const;

const LINK_PATTERN = /(https?:\/\/|www\.)/i;

/** Treat "", null and whitespace-only values as "not provided". */
const blankToUndefined = (value: unknown) => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
};

const optionalEnum = <T extends Options>(options: T, message: string) =>
  z.preprocess(blankToUndefined, z.enum(values(options), { error: message }).optional());

const optionalText = (max: number, message: string) =>
  z.preprocess(
    blankToUndefined,
    z.string({ error: message }).trim().max(max, message).optional(),
  );

export const emailSchema = z
  .string({ error: "Enter your email address." })
  .trim()
  .toLowerCase()
  .min(1, "Enter your email address.")
  .max(LIMITS.email, "That email address is too long.")
  .pipe(z.email({ error: "Enter a valid email address, like you@restaurant.com." }));

const PHONE_MESSAGE = "Enter a 10-digit US phone number, like (415) 555-0134.";

/**
 * US (NANP) numbers in any common format: "(415) 555-0134", "415.555.0134",
 * "+1 415 555 0134". Stored as E.164, e.g. "+14155550134".
 */
export const phoneSchema = z
  .string({ error: "Enter your phone number." })
  .trim()
  .min(1, "Enter your phone number.")
  .max(LIMITS.phone, PHONE_MESSAGE)
  .transform((value, ctx) => {
    let digits = value.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
    const valid = /^[\d\s().+-]+$/.test(value) && /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
    if (!valid) {
      ctx.addIssue({ code: "custom", message: PHONE_MESSAGE });
      return z.NEVER;
    }
    return `+1${digits}`;
  });

const WEBSITE_MESSAGE = "Enter a web address, like cornerslice.com.";

/**
 * Optional website. Accepts "cornerslice.com", "www.cornerslice.com",
 * "https://…" or a social profile like "instagram.com/cornerslice", and
 * stores it with a scheme and without a bare trailing slash.
 */
export const websiteSchema = z.preprocess(
  blankToUndefined,
  z
    .string({ error: WEBSITE_MESSAGE })
    .trim()
    .max(LIMITS.website, "That web address is too long.")
    .transform((value, ctx) => {
      const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;
      let url: URL | null = null;
      try {
        url = new URL(withScheme);
      } catch {
        // Falls through to the error below.
      }
      const valid =
        url !== null &&
        !/\s/.test(value) &&
        (url.protocol === "https:" || url.protocol === "http:") &&
        !url.username &&
        !url.password &&
        /\.[a-z0-9-]{2,}$/i.test(url.hostname);
      if (!url || !valid) {
        ctx.addIssue({ code: "custom", message: WEBSITE_MESSAGE });
        return z.NEVER;
      }
      const bare = url.pathname === "/" && !url.search && !url.hash;
      const normalized = bare ? `${url.protocol}//${url.host}` : url.href;
      if (normalized.length > LIMITS.website) {
        ctx.addIssue({ code: "custom", message: "That web address is too long." });
        return z.NEVER;
      }
      return normalized;
    })
    .optional(),
);

/** Multi-select chips. Missing means none; duplicates are dropped. */
const posProblemsField = z.preprocess(
  (value) => (Array.isArray(value) ? [...new Set(value)] : (value ?? [])),
  z
    .array(z.enum(values(posProblems), { error: "Pick problems from the list." }), {
      error: "Invalid value.",
    })
    .max(posProblems.length, "Invalid value."),
);

export const waitlistSchema = z.object({
  businessName: z
    .string({ error: "Enter your restaurant or company name." })
    .trim()
    .min(1, "Enter your restaurant or company name.")
    .min(LIMITS.businessNameMin, "That name looks too short.")
    .max(LIMITS.businessName, `Keep it under ${LIMITS.businessName} characters.`)
    .refine((v) => !LINK_PATTERN.test(v), "Please leave out links."),
  email: emailSchema,
  phone: phoneSchema,
  website: websiteSchema,
  locations: optionalEnum(locationCounts, "Pick a number of locations from the list."),
  posProblems: posProblemsField,
  frustration: optionalText(
    LIMITS.frustration,
    `Keep it under ${LIMITS.frustration} characters.`,
  ),
  utmSource: optionalText(LIMITS.utm, "Invalid value."),
  utmMedium: optionalText(LIMITS.utm, "Invalid value."),
  utmCampaign: optionalText(LIMITS.utm, "Invalid value."),
});

export type WaitlistInput = z.input<typeof waitlistSchema>;
export type WaitlistData = z.output<typeof waitlistSchema>;
export type WaitlistField = keyof WaitlistData;

export const optOutSchema = z.object({ email: emailSchema });

/** Flattens zod issues into one human message per field. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  const result: Record<string, string> = {};
  for (const [field, messages] of Object.entries(flat)) {
    if (messages && messages.length > 0) result[field] = messages[0];
  }
  return result;
}
