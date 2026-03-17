# Yahoo! Portal — Demo Homepage

A Yahoo-style responsive portal homepage built with **Next.js** and **Tailwind CSS**. This project demonstrates a modern, fully responsive news portal layout with hardcoded fake data — no real APIs required.

## Features

- **Top Navigation Bar** — Yahoo! logo, main channel links (News, Finance, Sports, Entertainment, Tech), and a hamburger menu on mobile
- **Search Bar** — Centered, prominent search input with a styled submit button
- **Main News Area** — Large hero news card alongside 5 smaller article items
- **Multi-Column Content** — Three columns for Finance, Sports, and Entertainment, each with several news items
- **Right Sidebar** — Weather widget, trending keywords, and an ad placeholder (all fake data)
- **Footer** — Links for About, Help, Terms, and Privacy
- **Fully Responsive** — Adapts to desktop, tablet, and mobile viewports
- **Accessible** — Semantic HTML, ARIA labels, alt text, and keyboard-friendly navigation

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [React 18](https://react.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- npm (comes with Node.js)

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel auto-detects Next.js — click **Deploy**.
4. Your site will be live at a `.vercel.app` URL.

### Other Platforms

This is a standard Next.js application. It can be deployed to any platform that supports Node.js:

- **Netlify** — Use the `@netlify/plugin-nextjs` plugin.
- **AWS Amplify** — Import the repo and Amplify auto-detects Next.js.
- **Docker** — Build with `next build`, then serve with `next start` on port 3000.

## Project Structure

```
src/
├── app/
│   ├── globals.css        # Tailwind directives and base styles
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Homepage composing all sections
├── components/
│   ├── Navbar.tsx         # Top navigation with mobile hamburger menu
│   ├── SearchBar.tsx      # Centered search form
│   ├── HeroNews.tsx       # Hero news card + side article list
│   ├── ContentColumns.tsx # Three-column category news
│   ├── Sidebar.tsx        # Weather, trending, ad placeholder
│   └── Footer.tsx         # Footer links and copyright
```

## Color Scheme

The primary brand color is Yahoo purple: `#6001D2`.

## License

This project is for demonstration purposes only and is not affiliated with Yahoo Inc.
