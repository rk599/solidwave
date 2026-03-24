# Solidwave Group SA — Website

Independent insurance broker website built with Astro 5, React 19, and Tailwind CSS v4.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Astro | 5.x |
| UI Islands | React | 19.x |
| Styling | Tailwind CSS | 4.x (via Vite plugin) |
| Icons | lucide-react | 1.x |
| Validation | Zod | 3.x |
| Email | Resend | 4.x |
| Deploy | Vercel (@astrojs/vercel) | v8 |
| Package Manager | bun | 1.x |

## Architecture

- **Output**: Hybrid — static prerendered pages + 2 SSR routes (`/` redirect + `/api/contact`)
- **i18n**: JSON dictionaries (DE + EN), URL-based routing (`/de/...`, `/en/...`)
- **Pages**: 44 total (22 per language)
- **Brand**: Navy `#0A2647` primary, Teal `#4A7C8C` accent, Inter font, WCAG AA compliant

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun build

# Preview production build
bun preview
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_TO_EMAIL=mm@solidwave.ch
CONTACT_FROM_EMAIL=noreply@solidwave.ch
```

## Deployment on Vercel

1. Push to GitHub: `git push origin main`
2. Import repo in Vercel dashboard → **New Project**
3. Framework preset: **Astro** (auto-detected)
4. Add environment variables in Vercel project settings
5. Deploy

### Environment Variables in Vercel

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO_EMAIL` | Where contact form emails go |
| `CONTACT_FROM_EMAIL` | Verified sender in Resend |

## Project Structure

```
src/
├── components/       # Shared UI components
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Breadcrumb.astro
│   ├── ServiceCard.astro
│   ├── CtaBanner.astro
│   └── ContactForm.tsx   # React island
├── i18n/             # Translations + helpers
│   ├── de.json
│   ├── en.json
│   └── index.ts
├── layouts/
│   └── Base.astro
├── lib/
│   └── cn.ts
├── pages/
│   ├── index.astro           # Root redirect (SSR)
│   ├── api/
│   │   └── contact.ts        # Contact form API (SSR)
│   ├── de/                   # German pages
│   └── en/                   # English pages
└── styles/
    └── global.css
public/
├── favicon.svg
├── fonts/            # Self-hosted Inter Variable
└── images/           # SVG logo variants
```

## Adding a Font

Download Inter Variable from [rsms.me/inter](https://rsms.me/inter) and place `InterVariable.woff2` in `public/fonts/`.

## i18n

All copy lives in `src/i18n/de.json` and `src/i18n/en.json`. To add a new language:
1. Add a new JSON file in `src/i18n/`
2. Add the locale to `astro.config.mjs`
3. Create the page directory under `src/pages/`
