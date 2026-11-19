// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Showcase } from "@/components/sections/showcase";

describe("Showcase", () => {
  it("keeps the decorative tiles out of the tab order and away from screen readers", () => {
    const { container } = render(<Showcase />);
    const tiles = container.querySelectorAll("[inert]");
    // 6 tiles, rendered twice for a seamless loop.
    expect(tiles).toHaveLength(12);
    // The approve buttons inside the example cards can't be reached.
    expect(screen.queryByRole("button", { name: /approve/i })).toBeNull();
    // A plain description stands in for the tiles.
    expect(screen.getByText(/concept previews with example data\. try some of them in the demo above/i)).toBeInTheDocument();
  });

  it("has a visible control that pauses and resumes the scrolling", async () => {
    const user = userEvent.setup();
    render(<Showcase />);
    const button = screen.getByRole("button", { name: /pause scrolling examples/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    expect(screen.getByRole("button", { name: /play scrolling examples/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
