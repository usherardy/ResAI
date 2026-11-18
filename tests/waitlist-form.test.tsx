// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

function mockFetch(status: number, body: unknown) {
  const fn = vi.fn(async () => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fn);
  return fn;
}

async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^email/i), "owner@cornerslice.com");
  await user.type(screen.getByLabelText(/restaurant or business name/i), "Corner Slice");
}

describe("WaitlistForm", () => {
  it("shows inline errors and focuses the first invalid field without calling the API", async () => {
    const fetchMock = mockFetch(200, { ok: true });
    const user = userEvent.setup();
    render(<WaitlistForm />);

    await user.click(screen.getByRole("button", { name: /join the early-access waitlist/i }));

    expect(await screen.findByText(/enter your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your restaurant or business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toHaveFocus();
    expect(screen.getByLabelText(/^email/i)).toHaveAttribute("aria-invalid", "true");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows a loading state, then the success message", async () => {
    let resolve!: (r: Response) => void;
    const fetchMock = vi.fn(
      () => new Promise<Response>((r) => {
        resolve = r;
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<WaitlistForm />);

    await fillRequired(user);
    await user.selectOptions(screen.getByLabelText(/current pos/i), "square");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /join the early-access waitlist/i }));

    expect(await screen.findByRole("button", { name: /joining/i })).toBeDisabled();

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const sent = JSON.parse(init.body as string);
    expect(sent).toMatchObject({
      email: "owner@cornerslice.com",
      businessName: "Corner Slice",
      currentPos: "square",
      researchConsent: true,
      website: "",
    });
    expect(typeof sent.elapsedMs).toBe("number");

    resolve(new Response(JSON.stringify({ ok: true, message: "ok" }), { status: 200 }));
    expect(await screen.findByRole("heading", { name: /you're on the list/i })).toBeInTheDocument();
    expect(screen.getByText("owner@cornerslice.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /opt out anytime/i })).toHaveAttribute("href", "/opt-out");
  });

  it("shows server field errors from a 400", async () => {
    mockFetch(400, {
      ok: false,
      error: "validation",
      message: "Please check the highlighted fields.",
      fieldErrors: { businessName: "Please leave out links." },
    });
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /join the early-access waitlist/i }));

    expect(await screen.findByText("Please leave out links.")).toBeInTheDocument();
    expect(screen.getByLabelText(/restaurant or business name/i)).toHaveFocus();
  });

  it("explains a 503 and does not show success", async () => {
    mockFetch(503, { ok: false, error: "unavailable", message: "x" });
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /join the early-access waitlist/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/temporarily unavailable.*weren’t saved/i);
    expect(screen.queryByText(/you're on the list/i)).not.toBeInTheDocument();
  });

  it("shows the server message on 429", async () => {
    mockFetch(429, { ok: false, error: "rate_limited", message: "Too many attempts. Please wait a few minutes and try again." });
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /join the early-access waitlist/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/too many attempts/i);
  });

  it("handles network failures", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    }));
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /join the early-access waitlist/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/couldn’t reach our server/i),
    );
    expect(screen.getByRole("button", { name: /join the early-access waitlist/i })).toBeEnabled();
  });
});
