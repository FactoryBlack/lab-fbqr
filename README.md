# Brutalist App Boilerplate

*Built with [v0.dev](https://v0.dev)*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

## Overview

This repository is a ready-to-use boilerplate for building web applications with a distinct Swiss-Tech/Brutalist design aesthetic. It's built on Next.js, Tailwind CSS, and includes a complete, custom-styled component library.

This boilerplate was forked from the [FBQR](https://v0.dev/chat/xar89cDgaSL) project and generalized for reuse.

## Features

- **Next.js App Router:** Modern, server-first architecture.
- **Brutalist Component Library:** A full set of UI components like buttons, cards, inputs, and more, all styled with a unique, bold aesthetic. Find them in `/components/ui`.
- **Supabase Auth Ready:** Includes client and server helpers, middleware, and a pre-built login/signup modal.
- **Responsive Layout:** A flexible multi-column layout that adapts from mobile to large desktops.
- **Customizable Theme:** Easily tweak colors and fonts via `app/globals.css`.

## Getting Started

1.  **Clone the repository.**
2.  **Install dependencies:** `npm install`
3.  **Set up your environment variables:** Create a `.env.local` file and add your Supabase credentials:
  \`\`\`
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  \`\`\`
4.  **Run the development server:** `npm run dev`

Now you can start building your application by modifying `app/page.tsx`.

## Building Your App

- **Components:** All reusable UI components are in `/components/ui`. You can use them directly in your pages.
- **Styling:** The core theme is defined in `app/globals.css`. You can adjust the CSS variables there to change the color palette.
- **Authentication:** The boilerplate comes with a pre-configured `AuthModal` and `AuthButton`. To enable database integration with user accounts, you'll need to set up your own tables in Supabase.
