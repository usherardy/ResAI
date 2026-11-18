import { z } from "zod";

/**
 * Waitlist schema shared by the form (instant feedback) and the API route
 * (authoritative). Keep in sync with the CHECK constraints in
 * supabase/migrations/*_waitlist.sql.
 */

export const restaurantTypes = [
  { value: "full_service", label: "Full-service restaurant" },
  { value: "quick_service", label: "Quick-service / fast casual" },
  { value: "cafe", label: "Café / coffee shop" },
  { value: "bar", label: "Bar / brewery / wine bar" },
  { value: "food_truck", label: "Food truck" },
  { value: "bakery", label: "Bakery / dessert shop" },
  { value: "other", label: "Other" },
] as const;

export const posSystems = [
  { value: "toast", label: "Toast" },
  { value: "square", label: "Square" },
  { value: "clover", label: "Clover" },
  { value: "revel", label: "Revel" },
  { value: "spoton", label: "SpotOn" },
  { value: "other", label: "Other" },
] as const;

export const locationCounts = [
  { value: "1", label: "1 location" },
  { value: "2-5", label: "2–5 locations" },
  { value: "6-10", label: "6–10 locations" },
  { value: "11+", label: "11 or more" },
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
  name: 100,
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

export const waitlistSchema = z.object({
  email: emailSchema,
  businessName: z
    .string({ error: "Enter your restaurant or business name." })
    .trim()
    .min(1, "Enter your restaurant or business name.")
    .min(LIMITS.businessNameMin, "That name looks too short.")
    .max(LIMITS.businessName, `Keep it under ${LIMITS.businessName} characters.`)
    .refine((v) => !LINK_PATTERN.test(v), "Please leave out links."),
  name: z.preprocess(
    blankToUndefined,
    z
      .string({ error: "Enter your name." })
      .trim()
      .max(LIMITS.name, `Keep it under ${LIMITS.name} characters.`)
      .refine((v) => !LINK_PATTERN.test(v), "Please leave out links.")
      .optional(),
  ),
  restaurantType: optionalEnum(restaurantTypes, "Pick a restaurant type from the list."),
  currentPos: optionalEnum(posSystems, "Pick a POS from the list."),
  locations: optionalEnum(locationCounts, "Pick a number of locations from the list."),
  frustration: optionalText(
    LIMITS.frustration,
    `Keep it under ${LIMITS.frustration} characters.`,
  ),
  researchConsent: z.boolean({ error: "Invalid value." }).optional().default(false),
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
