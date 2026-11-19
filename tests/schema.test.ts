import { describe, expect, it } from "vitest";
import { fieldErrorsFrom, optOutSchema, waitlistSchema } from "@/lib/waitlist/schema";

const valid = {
  businessName: "Corner Slice",
  email: "owner@cornerslice.com",
  phone: "(415) 555-0134",
};

function errorsFor(input: unknown) {
  const result = waitlistSchema.safeParse(input);
  return result.success ? {} : fieldErrorsFrom(result.error);
}

describe("waitlistSchema", () => {
  it("accepts the three required fields alone", () => {
    const result = waitlistSchema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      businessName: "Corner Slice",
      email: "owner@cornerslice.com",
      phone: "+14155550134",
      posProblems: [],
    });
    expect(result.data?.website).toBeUndefined();
  });

  it("normalizes email and trims text", () => {
    const result = waitlistSchema.parse({
      ...valid,
      email: "  Owner@CornerSlice.COM ",
      businessName: "  Corner Slice  ",
    });
    expect(result.email).toBe("owner@cornerslice.com");
    expect(result.businessName).toBe("Corner Slice");
  });

  it("requires business name, email and phone", () => {
    const errors = errorsFor({});
    expect(errors.businessName).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.phone).toBeDefined();
    expect(errorsFor({ ...valid, phone: "   " }).phone).toMatch(/enter your phone/i);
  });

  it.each([
    ["(415) 555-0134", "+14155550134"],
    ["415.555.0134", "+14155550134"],
    ["415 555 0134", "+14155550134"],
    ["4155550134", "+14155550134"],
    ["+1 415-555-0134", "+14155550134"],
    ["1 (415) 555 0134", "+14155550134"],
  ])("stores phone %s as %s", (input, stored) => {
    expect(waitlistSchema.parse({ ...valid, phone: input }).phone).toBe(stored);
  });

  it.each([
    "555-0134", // too short
    "+44 20 7946 0958", // not a US number
    "(015) 555-0134", // area codes can't start with 0 or 1
    "(415) 155-0134", // exchanges can't start with 0 or 1
    "415-555-0134 ext 2",
    "call me maybe",
  ])("rejects phone %s", (input) => {
    expect(errorsFor({ ...valid, phone: input }).phone).toMatch(/10-digit US phone/i);
  });

  it.each([
    ["cornerslice.com", "https://cornerslice.com"],
    ["www.cornerslice.com", "https://www.cornerslice.com"],
    ["https://CornerSlice.com/", "https://cornerslice.com"],
    ["http://cornerslice.com/menu", "http://cornerslice.com/menu"],
    ["instagram.com/cornerslice", "https://instagram.com/cornerslice"],
  ])("stores website %s as %s", (input, stored) => {
    expect(waitlistSchema.parse({ ...valid, website: input }).website).toBe(stored);
  });

  it.each(["not a site", "localhost", "ftp://cornerslice.com", "https://user:pw@cornerslice.com"])(
    "rejects website %s",
    (input) => {
      expect(errorsFor({ ...valid, website: input }).website).toMatch(/web address/i);
    },
  );

  it("keeps stored websites within the database limit", () => {
    const long = `cornerslice.com/${"a".repeat(190)}`;
    expect(errorsFor({ ...valid, website: long }).website).toMatch(/too long/i);
  });

  it("treats blank optional fields as not provided", () => {
    const result = waitlistSchema.parse({
      ...valid,
      website: "  ",
      locations: "",
      frustration: "",
    });
    expect(result.website).toBeUndefined();
    expect(result.locations).toBeUndefined();
    expect(result.frustration).toBeUndefined();
  });

  it("accepts every optional field when valid", () => {
    const result = waitlistSchema.safeParse({
      ...valid,
      website: "cornerslice.com",
      locations: "2-5",
      posProblems: ["menu_updates", "hardware"],
      frustration: "Modifiers take forever to change.",
    });
    expect(result.success).toBe(true);
  });

  it("de-duplicates POS problems and rejects unknown ones", () => {
    expect(
      waitlistSchema.parse({ ...valid, posProblems: ["fees", "fees", "support"] }).posProblems,
    ).toEqual(["fees", "support"]);
    expect(errorsFor({ ...valid, posProblems: ["aliens"] }).posProblems).toBeDefined();
    expect(errorsFor({ ...valid, posProblems: "fees" }).posProblems).toBeDefined();
  });

  it("rejects malformed emails", () => {
    expect(errorsFor({ ...valid, email: "not-an-email" }).email).toMatch(/valid email/i);
    expect(errorsFor({ ...valid, email: "a@b" }).email).toBeDefined();
  });

  it("enforces length limits", () => {
    expect(errorsFor({ ...valid, email: `${"a".repeat(250)}@x.com` }).email).toBeDefined();
    expect(errorsFor({ ...valid, businessName: "A" }).businessName).toMatch(/too short/i);
    expect(errorsFor({ ...valid, businessName: "A".repeat(121) }).businessName).toBeDefined();
    expect(errorsFor({ ...valid, frustration: "A".repeat(1001) }).frustration).toBeDefined();
  });

  it("rejects a location count outside the list", () => {
    expect(errorsFor({ ...valid, locations: "1000" }).locations).toBeDefined();
  });

  it("rejects links in the business name (a common spam pattern)", () => {
    expect(errorsFor({ ...valid, businessName: "Cheap pills www.spam.biz" }).businessName).toMatch(/links/i);
  });

  it("strips unknown and retired keys", () => {
    const result = waitlistSchema.parse({ ...valid, isAdmin: true, researchConsent: true, name: "Jo" });
    expect(result).not.toHaveProperty("isAdmin");
    expect(result).not.toHaveProperty("researchConsent");
    expect(result).not.toHaveProperty("name");
  });
});

describe("optOutSchema", () => {
  it("normalizes a valid email", () => {
    expect(optOutSchema.parse({ email: " Me@Example.com " }).email).toBe("me@example.com");
  });
  it("rejects an invalid email", () => {
    expect(optOutSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});
