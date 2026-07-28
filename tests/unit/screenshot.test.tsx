import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Screenshot } from "@/components/marketing/Screenshot";

describe("Screenshot", () => {
  it("renders placeholder when src is missing", () => {
    render(<Screenshot device="iphone" alt="App home screen" />);
    expect(screen.getByRole("img", { name: /app home screen/i })).toBeInTheDocument();
    expect(screen.getByTestId("screenshot-placeholder")).toBeInTheDocument();
  });

  it("renders real image when src is provided", () => {
    render(
      <Screenshot device="mac" src="/screenshots/home.png" alt="Mac app home" />
    );
    const img = screen.getByRole("img", { name: /mac app home/i });
    expect(img).toHaveAttribute("src", expect.stringContaining("home.png"));
    expect(screen.queryByTestId("screenshot-placeholder")).not.toBeInTheDocument();
  });
});
