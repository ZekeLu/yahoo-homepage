# Contributing to Yahoo! Portal

Thank you for your interest in contributing! This guide will help you get set up and follow our workflow.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (comes with Node.js)
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/ZekeLu/yahoo-homepage.git
cd yahoo-homepage

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start the dev server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Recommended VS Code Extensions

Open the project in VS Code and accept the recommended extensions prompt, or install them manually:

- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Tailwind CSS IntelliSense** — `bradlc.vscode-tailwindcss`
- **Prisma** — `Prisma.prisma`

## Development Workflow

### Branch Naming

- Feature branches: `feature/<short-description>`
- Bug fixes: `fix/<short-description>`
- Chores / refactors: `chore/<short-description>`

### Before You Commit

Run these checks locally:

```bash
# Lint
npm run lint

# Run tests
npm test

# Build (catches Next.js compilation errors)
npm run build
```

### Pull Request Process

1. Create a feature branch off `main`.
2. Make your changes with clear, atomic commits.
3. Ensure all checks pass: lint, test, and build.
4. Open a PR against `main` with a descriptive title and summary.
5. CI will automatically run lint, test, and build.
6. Request a review from a maintainer.

### Commit Message Convention

Use conventional commit messages:

```
feat: add stock ticker error boundary
fix: resolve weather widget hydration issue
chore: update dependencies
docs: improve README deployment section
test: add health endpoint tests
```

## Coding Standards

### TypeScript

- Strict mode is enabled — do not use `any` unless absolutely necessary.
- Prefer interfaces over type aliases for object shapes.
- Use explicit return types on exported functions.

### React / Next.js

- Use functional components with hooks.
- Mark client components with `'use client'` directive.
- Use `next/image` for all images, `next/link` for internal links.
- Wrap error-prone client components with `<ErrorBoundary>`.

### Styling

- Use **Tailwind CSS** utility classes exclusively.
- Follow the existing color scheme (Yahoo purple: `#6001D2`).
- Ensure responsive design across mobile, tablet, and desktop.
- Support dark mode via Tailwind's `dark:` variant.

### Testing

- Write tests for new API routes and utility functions.
- Use React Testing Library for component tests.
- Place tests in the `__tests__/` directory at the project root.
- Run the full suite before submitting a PR.

## Project Structure

```
src/
├── app/            # Next.js App Router pages and API routes
│   ├── admin/      # CMS admin panel
│   ├── api/        # REST API endpoints
│   └── ...         # Public pages
├── components/     # Reusable React components
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries (KV, rate limiting, etc.)
└── data/           # JSON data files (articles, subscribers, etc.)
```

## Need Help?

Open an issue on GitHub or reach out to the maintainers. We appreciate all contributions!
