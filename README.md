# Figure

A local-first personal expense tracker with optional Google Drive backup.

## Features

- **Local-first** — all data lives in your browser, no account required
- **Month navigation** — browse expenses by month
- **Tags** — organize expenses with custom color-coded categories
- **Group by date or tag** — switch views on the fly
- **Multiple currencies** — USD, EUR, GBP, and more
- **Dark mode** — system, light, or dark theme
- **Google Drive backup** — optional encrypted JSON snapshots stored in your Drive's private app folder

## Stack

- [Next.js 16](https://nextjs.org) with Turbopack
- [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS v4](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs) for state management (persisted to localStorage)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for form validation
- Google Identity Services + Drive REST API for backup/restore

## Google Drive Backup (optional)

To enable backup, create a Google Cloud project and set:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Requirements in Google Cloud Console:
1. Enable the **Google Drive API**
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add your origin to **Authorized JavaScript origins**
4. Add `https://www.googleapis.com/auth/drive.appdata` scope to the OAuth consent screen

Backups are stored as JSON snapshots in the hidden `appDataFolder` — invisible to the user's Drive files.

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).
