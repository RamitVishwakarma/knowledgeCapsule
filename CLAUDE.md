# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build + TypeScript check
npm run lint      # ESLint
npm run format    # Prettier (formats all files)
```

There are no tests yet. Use `npm run build` to validate TypeScript.

## Project Overview

Knowledge Capsule is a private, single-user knowledge vault. Users record self-explanations of topics via external video links (primarily YouTube), which the app automatically transcribes and summarizes. The current codebase is a **frontend-only prototype** — all data lives in a Zustand store with mock data. The backend (MongoDB + NextAuth + transcript/summary APIs) is planned but not yet implemented.

## Architecture

### Tech Stack

- **Next.js 16** App Router — Server Components by default, `"use client"` explicitly opted in
- **Tailwind v4** with `@tailwindcss/postcss` (no `tailwind.config.js` — config lives in `globals.css`)
- **shadcn/ui** — base UI primitives in `src/components/ui/`
- **Zustand** — sole state manager (`src/store/appStore.ts`); no React Context for custom state
- **Sonner** — toast notifications (Toaster is in root layout)
- **MongoDB + NextAuth (Google)** — planned backend (see `SRS.md`)

### Key Conventions

**Server vs Client components:** Components are Server Components by default. Add `"use client"` as the very first line only when needing hooks, event handlers, browser APIs, animations, or Zustand.

**Data flow (current — mock):** All state is in `useAppStore` (Zustand). The store holds `topics`, `documents`, auth state, and UI state (sidebar, viewMode, selectedTopicId, selectedDocId).

**Data flow (planned — backend):** Mutations will go through Server Actions in `src/app/actions/`. Use `revalidatePath()` after mutations. API Routes (`src/app/api/`) are only for external HTTP endpoints (webhooks, mobile clients).

**Page shells:** `src/app/[route]/page.tsx` files are thin Server Components that import a single Client component. Keep all logic in the Client component.

**State management rules:**

- No React Context API for custom state — Zustand only
- Domain types are exported from `src/store/appStore.ts` (`Document`, `Topic`, `ViewMode`)
- Shared type re-exports live in `src/lib/types/`
- No `any` — use `unknown` when type is truly unknowable

**Routing:** All routes are centralized in `src/utils/routes/routes.ts` as `appRoutes` constants. Use these instead of string literals.

**Error display:** Use `sonner` toasts (`toast.error(...)`) for user-facing errors. Server Actions should return error objects rather than throwing.

**Utilities:** Pure helper functions go in `src/utils/helpers/`. No React/Next.js/Zustand imports allowed there.

**Logging:** No `console.log` in committed code. `console.warn` and `console.error` are allowed.

### Domain Model

A **Document** belongs to a **Topic** and has: `title`, `shortDescription`, `longDescription`, `videoUrl`, `transcript` (from YouTube or manual paste), `transcriptSource`, `summary` (Tiptap JSON eventually), and `summaryStatus` (`none | processing | ready | failed`).

Documents can be archived (soft delete) or permanently deleted. `viewMode` in the store controls whether active or archived documents are shown.

### Planned Backend (SRS.md)

- **Auth:** NextAuth with Google provider; all API routes validate session
- **DB:** MongoDB with Mongoose; collections: Users, Topics, Documents
- **Transcript:** Attempt YouTube transcript fetch → fall back to manual paste
- **Summary:** Server-side extractive summarizer (no paid APIs); stored as Tiptap JSON
- **API routes** (when built): topics CRUD, documents CRUD, `POST /api/documents/:id/fetch-transcript`, `POST /api/documents/:id/generate-summary`

## Special Instructions

- While testing, immediately report any security bugs
- Always use `rm -f` instead of `rm` command
- Make sure to check routes.ts when using router.xxx use routes defined inside the file if the route doesnt exist add it.
- Use size instead of h and w when h and w both have same value in tailwind classname
- Use Form from components/ui instead of FormProvider from radix
- Use z.email instead of z.string.email
- Always use Button from `components/ui` folder
- Always use utility functions when writing logic; if a suitable utility doesn't exist and the logic is reusable, create it in `lib/utils/`
- When creating UI, first check if a similar component already exists and reuse it. If no exact match exists and the feature could become a reusable component, ask the user before extracting it
- Always follow the DRY principle — never repeat code
- Always check globals.css for styles avoid custom tailwind classes
- For infinite scrolling implementation always use a query that uses useSelectQuery hook under the hood if that query doesnt exist create one.
- Do not use any type asertions anywhere unless necessary.
- DO NOT ASSUME ANYTHING ALWAYS ASK QUESTIONS
- All imports should use @ imports only
- No component should be above 300 lines.
- No function should be responsible to do multiple things
- Each function should be responsible to do atomic things only.
- All the buttons should come from a variant wrapping Button.tsx from the ui folder. No html button usage.
- No img tag is allowed in the codebase use npm i sharp and the Image tag only.
- No anchor tags allowed only Link tags are allowed.
- Keep components simple do not overdo a component.
- No DRY violations.
- No YAGNI violations.
