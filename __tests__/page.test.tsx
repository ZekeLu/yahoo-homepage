import { render, screen, within } from "@testing-library/react";
import Home from "@/app/page";

describe("Homepage", () => {
  it("renders the navigation bar with logo and channel links", () => {
    render(<Home />);

    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(screen.getByText("Yahoo!")).toBeInTheDocument();
    expect(within(nav).getByText("News")).toBeInTheDocument();
    expect(within(nav).getByText("Finance")).toBeInTheDocument();
    expect(within(nav).getByText("Sports")).toBeInTheDocument();
    expect(within(nav).getByText("Entertainment")).toBeInTheDocument();
    expect(within(nav).getByText("Tech")).toBeInTheDocument();
  });

  it("renders the search bar", () => {
    render(<Home />);

    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search the web...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /search/i })
    ).toBeInTheDocument();
  });

  it("renders the main navigation with correct aria label", () => {
    render(<Home />);

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });
});
