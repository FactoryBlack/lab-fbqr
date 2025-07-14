# The Factory Black Lab: FBQR

Welcome to **FBQR**, a brutalist-inspired, highly customizable QR code generator. This project is the first official utility from **The Factory Black Lab**, designed for developers and designers who value powerful tools with a strong aesthetic.

Built with Next.js, Tailwind CSS, and Supabase, FBQR allows for deep customization of QR codes, from content type to visual style, all while maintaining a strict, minimalist design language.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://v0-simple-qr-code-generator.vercel.app/)

![FBQR Screenshot](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/og-4WVKb1BP7X1SP4EKSZv5ZAuMO84Af3.png)

## Features

- **Multiple Content Types:** Generate QR codes for URLs, text, email, SMS, phone numbers, and Wi-Fi credentials.
- **Deep Customization:**
  - **Style:** Control dot styles, corner styles, and corner square styles.
  - **Color:** Apply solid colors or create custom linear and radial gradients.
  - **Logo:** Embed your own logo in the center of the QR code.
- **Real-time Preview:** See your changes instantly as you adjust the settings.
- **User Collections (Supabase):** Authenticated users can save and manage collections of their favorite QR code configurations.
- **Download Options:** Export your final QR code as an SVG or PNG.
- **Brutalist UI:** A clean, sharp interface built with a strict design system.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI:** [shadcn/ui](https://ui.shadcn.com/) (heavily customized)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation & Setup

1.  **Clone the repository:**
    \`\`\`sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    \`\`\`

2.  **Install dependencies:**
    \`\`\`sh
    pnpm install
    \`\`\`

3.  **Set up environment variables:**
    - Create a free Supabase project at [supabase.com](https://supabase.com/).
    - In your Supabase project dashboard, go to **Project Settings > API**.
    - Find your **Project URL** and **Project API Keys** (use the `anon` `public` key).
    - Create a file named `.env.local` in the root of the project by copying the example file:
      \`\`\`sh
      cp .env.example .env.local
      \`\`\`
    - Add your Supabase URL and anon key to `.env.local`:
      \`\`\`
      NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
      \`\`\`

4.  **Run the Supabase database migrations:**
    - In your Supabase project dashboard, go to the **SQL Editor**.
    - Create a "New query" and paste the contents of the files from the `/scripts` directory in this repository, starting with `001-create-collections-table.sql`. Run each script in order.

5.  **Run the development server:**
    \`\`\`sh
    pnpm dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
