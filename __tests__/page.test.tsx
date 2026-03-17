import { render, screen, within } from "@testing-library/react";
import Home from "@/app/page";

// Mock IntersectionObserver for tests
beforeAll(() => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe("Homepage", () => {
  it("renders the navigation bar with logo and channel links", () => {
    render(<Home />);

    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(screen.getByText("Yahoo!")).toBeInTheDocument();
    expect(within(nav).getAllByText("News").length).toBeGreaterThanOrEqual(1);
    expect(within(nav).getAllByText("Finance").length).toBeGreaterThanOrEqual(1);
    expect(within(nav).getAllByText("Sports").length).toBeGreaterThanOrEqual(1);
    expect(within(nav).getAllByText("Entertainment").length).toBeGreaterThanOrEqual(1);
    expect(within(nav).getAllByText("Tech").length).toBeGreaterThanOrEqual(1);
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

  it("renders the newsletter signup section", () => {
    render(<Home />);

    expect(screen.getByText("Stay informed")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
  });

  it("renders the dark mode toggle button", () => {
    render(<Home />);

    expect(screen.getByRole("button", { name: /switch to dark mode/i })).toBeInTheDocument();
  });
});
