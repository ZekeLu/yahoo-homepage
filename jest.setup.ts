import "@testing-library/jest-dom";

// Mock global fetch for tests (JSDOM does not provide it)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: false,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;
