import { describe, expect, it } from "vitest";
import { fieldErrorsFrom, optOutSchema, waitlistSchema } from "@/lib/waitlist/schema";

const valid = { email: "owner@cornerslice.com", businessName: "Corner Slice" };

function errorsFor(input: unknown) {
  const result = waitlistSchema.safeParse(input);
  return result.success ? {} : fieldErrorsFrom(result.error);
}

describe("waitlistSchema", () => {
  it("accepts the two required fields alone", () => {
    const result = waitlistSchema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ ...valid, researchConsent: false });
  });

  it("normalizes email and trims text", () => {
    const result = waitlistSchema.parse({
      email: "  Owner@CornerSlice.COM ",
      businessName: "  Corner Slice  ",
      name: "  Jordan  ",
    });
    expect(result.email).toBe("owner@cornerslice.com");
    expect(result.businessName).toBe("Corner Slice");
    expect(result.name).toBe("Jordan");
  });

  it("treats blank optional fields as not provided", () => {
    const result = waitlistSchema.parse({
      ...valid,
      name: "   ",
      restaurantType: "",
      currentPos: "",
      locations: "",
      frustration: "",
    });
    expect(result.name).toBeUndefined();
    expect(result.restaurantType).toBeUndefined();
    expect(result.currentPos).toBeUndefined();
    expect(result.locations).toBeUndefined();
    expect(result.frustration).toBeUndefined();
  });

  it("accepts every optional field when valid", () => {
    const result = waitlistSchema.safeParse({
      ...valid,
      name: "Jordan Lee",
      restaurantType: "cafe",
      currentPos: "spoton",
      locations: "2-5",
      frustration: "Modifiers take forever to change.",
      researchConsent: true,
    });
    expect(result.success).toBe(true);
  });

  it("requires email and business name", () => {
    const errors = errorsFor({});
    expect(errors.email).toBeDefined();
    expect(errors.businessName).toBeDefined();
  });

  it("rejects malformed emails", () => {
    expect(errorsFor({ ...valid, email: "not-an-email" }).email).toMatch(/valid email/i);
    expect(errorsFor({ ...valid, email: "a@b" }).email).toBeDefined();
  });

  it("enforces length limits", () => {
    expect(errorsFor({ ...valid, email: `${"a".repeat(250)}@x.com` }).email).toBeDefined();
    expect(errorsFor({ ...valid, businessName: "A" }).businessName).toMatch(/too short/i);
    expect(errorsFor({ ...valid, businessName: "A".repeat(121) }).businessName).toBeDefined();
    expect(errorsFor({ ...valid, name: "A".repeat(101) }).name).toBeDefined();
    expect(errorsFor({ ...valid, frustration: "A".repeat(1001) }).frustration).toBeDefined();
  });

  it("rejects values outside the option lists", () => {
    const errors = errorsFor({
      ...valid,
      restaurantType: "spaceship",
      currentPos: "aloha",
      locations: "1000",
    });
    expect(errors.restaurantType).toBeDefined();
    expect(errors.currentPos).toBeDefined();
    expect(errors.locations).toBeDefined();
  });

  it("rejects links in name fields (a common spam pattern)", () => {
    expect(errorsFor({ ...valid, businessName: "Cheap pills www.spam.biz" }).businessName).toMatch(/links/i);
    expect(errorsFor({ ...valid, name: "https://spam.example" }).name).toMatch(/links/i);
  });

  it("rejects non-boolean consent", () => {
    expect(errorsFor({ ...valid, researchConsent: "yes" }).researchConsent).toBeDefined();
  });

  it("strips unknown keys", () => {
    const result = waitlistSchema.parse({ ...valid, isAdmin: true });
    expect(result).not.toHaveProperty("isAdmin");
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
