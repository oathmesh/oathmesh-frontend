# Oathmesh Website & SaaS Platform

Oathmesh is an identity and trust protocol designed for AI agents and APIs. This repository contains the frontend SaaS platform that serves as the command center for Oathmesh. 

It provides a high-converting, developer-focused landing page, a secure dashboard for managing agent keys, API route logging, documentation, and a fully functional Stripe donation and feature wishlist system.

## 🚀 Tech Stack

The application is built leveraging modern web technologies:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Directory)
- **UI & Styling**: React 19, [Tailwind CSS v4](https://tailwindcss.com/), Framer Motion
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Caching & Rate Limiting**: Upstash Redis & Vercel KV
- **Payments**: [Stripe](https://stripe.com/)
- **Email**: [Resend](https://resend.com/)
- **Testing**: Vitest (Unit) & Playwright (E2E)

## 📦 Features

- **Developer-Focused Landing Page**: A beautifully crafted, responsive dashboard prioritizing aesthetics with dark mode, bento-grid layouts, and glassmorphic designs.
- **Agent/Key Management**: A protected user dashboard to issue and manage API credentials.
- **SaaS Functionality**: Integrated feature wishlists, bug tracking, and a Stripe-based donation and tier-based contribution system.
- **Type-Safe Ecosystem**: Fully powered by TypeScript for robust front-to-back development.

## 🛠️ Getting Started

First, install the necessary dependencies:

```bash
npm install
```

Set up your environmental variables by copying `.env.example` to `.env.local` and filling in the required values (Stripe keys, DB urls, Resend tokens, KV urls).

Next, initialize the database:

```bash
npm run db:generate
npm run db:push
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing

This project uses Vitest for unit tests and Playwright for End-to-End testing.

```bash
npm run test       # Run unit tests
npm run test:e2e   # Run E2E tests
```
