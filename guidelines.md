# Frontend Contributing Guidelines

## Project Structure

```
knowledge-capsule-next/
├── src/
│   ├── app/                         # Next.js App Router (pages, layouts, API routes, Server Actions)
│   │   ├── layout.tsx               # Root layout — Server Component
│   │   ├── page.tsx                 # Landing page shell (imports Client component)
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Dashboard shell (imports Client component)
│   │   ├── actions/                 # Server Actions ("use server" functions)
│   │   │   └── README.md
│   │   └── api/                     # API Routes (external HTTP endpoints only)
│   │       └── README.md
│   ├── components/                  # React components
│   │   ├── ui/                      # Base UI components (shadcn/ui)
│   │   ├── figma/                   # Figma-generated helpers
│   │   └── [feature].tsx            # Feature/page-level components ("use client")
│   ├── store/                       # Zustand stores
│   │   ├── appStore.ts              # App-wide state (auth, topics, documents, UI)
│   │   └── README.md
│   ├── lib/
│   │   ├── services/                # Server-side data access functions (DB/external API calls)
│   │   └── types/                   # Shared type re-exports
│   ├── styles/
│   │   └── globals.css              # Tailwind v4 + theme variables + Google Fonts
│   └── utils/
│       ├── helpers/                 # Pure utility functions
│       └── routes/
│           └── routes.ts            # Type-safe route constants
├── public/                          # Static assets
├── next.config.ts                   # Next.js config
├── postcss.config.mjs               # @tailwindcss/postcss
├── tsconfig.json                    # @/* alias → ./src/*
├── eslint.config.mjs                # ESLint 9 native flat config
└── .prettierrc                      # Prettier config
```

### Jargons you should know

- **Server Component:** A React component that runs only on the server. No hooks, no browser APIs, no event handlers. Can `async/await` directly.
- **Client Component:** A React component marked with `"use client"`. Can use hooks, animations, event handlers, and browser APIs.
- **Server Action:** An async function marked with `"use server"`. Called directly from Client Components like a normal function. Runs on the server — no HTTP round trip.
- **Feature Component:** A component tied to a specific feature (e.g., DocumentDetail, Sidebar). Lives in `src/components/`.
- **UI Component:** A generic, reusable primitive (button, input, card). Lives in `src/components/ui/`.

---

## Adding New Components

### Decision Tree: Where to Place Your Component?

```
Is this component interactive (hooks, events, animations)?
├─ YES → Add "use client" at the top
└─ NO  → Keep it as a Server Component (can async/await directly)

Where does it live?
├─ Generic, reusable primitive (button, card, input)?
│   └─ src/components/ui/
├─ Specific to a single feature or page?
│   └─ src/components/[feature-name].tsx
├─ Page-level shell (thin wrapper that imports a Client component)?
│   └─ src/app/[route]/page.tsx  (Server Component)
└─ Layout (persistent across routes)?
    └─ src/app/[route]/layout.tsx
```

### Component Organization Guidelines

#### 1. UI Components (`src/components/ui/`)

Base-level, generic UI components — typically from shadcn/ui. No business logic.

**When to use:**

- Reusable across the entire application
- Examples: Button, Input, Card, Dialog, Badge, Select

#### 2. Feature Components (`src/components/`)

Components specific to a feature or domain. Add `"use client"` if they use hooks or event handlers.

**When to use:**

- Component is specific to one feature or page
- Examples: `sidebar.tsx`, `document-list.tsx`, `document-detail.tsx`, `landing-page.tsx`

#### 3. Page Shell (`src/app/[route]/page.tsx`)

Thin Server Component shells that import Client components.

```tsx
// src/app/dashboard/page.tsx — Server Component
import { Dashboard } from "@/components/dashboard";

export default function DashboardPage() {
  return <Dashboard />;
}
```

**Rule:** Keep page shells as small as possible. Business logic lives in the imported Client component.

#### 4. Layout Files (`src/app/[route]/layout.tsx`)

For persistent UI shared across a route segment (e.g., sidebar that stays while navigating between sub-pages).

```tsx
// src/app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

---

## API Integration — Server Actions

> **This project does not use Axios or React Query.** All data mutations use Next.js Server Actions. All data fetching in Server Components uses direct `async/await`. This means: no HTTP round trips from the client, no query key management, no fetch wrappers.

### Pattern: Server Action for mutations

**Step 1: Create a Server Action file**

```ts
// src/app/actions/documents.ts
"use server";

import { revalidatePath } from "next/cache";

export async function createDocument(payload: { title: string; topicId: string }) {
  // Call your DB or external API directly here — this runs on the server
  // const doc = await db.documents.create({ data: payload });
  revalidatePath("/dashboard");
}

export async function deleteDocument(id: string) {
  // await db.documents.delete({ where: { id } });
  revalidatePath("/dashboard");
}
```

**Step 2: Call directly from a Client Component — no hook needed**

```tsx
// src/components/document-list.tsx
"use client";

import { createDocument } from "@/app/actions/documents";

export function DocumentList() {
  async function handleCreate() {
    await createDocument({ title: "New Document", topicId: "abc" });
    // Done — revalidatePath in the Server Action refreshes the data
  }

  return <button onClick={handleCreate}>Add Document</button>;
}
```

**Step 3: Data fetching in Server Components — async/await directly**

```tsx
// src/app/dashboard/page.tsx — Server Component
import { fetchDocuments } from "@/app/actions/documents";
import { Dashboard } from "@/components/dashboard";

export default async function DashboardPage() {
  const docs = await fetchDocuments(); // direct call, runs on server
  return <Dashboard initialDocs={docs} />;
}
```

### When to use API Routes instead

Only create `src/app/api/[resource]/route.ts` when:

- You need a **public HTTP endpoint** (e.g., a webhook receiver)
- A **mobile app or third-party service** needs to call your backend over HTTP
- Server Actions are not appropriate for the use case

For anything internal to the Next.js app, use Server Actions — not API routes.

---

## State Management

### Rule: Zustand only — no React Context

**Do not use the React Context API** for custom application state. Zustand is the sole state management solution. The only exception is when a third-party library (e.g., `next-auth`'s `SessionProvider`) requires wrapping the app in a Context Provider — that is acceptable.

### Pattern: Non-persisted Zustand store

```ts
// src/store/uiStore.ts
import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

### Pattern: Persisted Zustand store (auth, preferences)

```ts
// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    { name: "auth-storage" }
  )
);
```

### Using a store in a Client Component

```tsx
"use client";
import { useAppStore } from "@/store/appStore";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  // ...
}
```

No provider wrapper is needed. Zustand stores are globally accessible.

---

## Type Definitions

### Type Organization

1. Domain types live in `src/store/appStore.ts` and are exported from there (e.g., `Document`, `Topic`, `ViewMode`)
2. Shared re-exports live in `src/lib/types/index.ts`
3. Server Action payloads are defined inline in the action file or in a co-located `types.ts`
4. **Never use `any`.** `unknown` is acceptable when the type truly cannot be known statically.

### Creating Type Definitions

```ts
// src/lib/types/documents.ts

export interface Document {
  id: string;
  topicId: string;
  title: string;
  content: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentPayload {
  title: string;
  topicId: string;
  content?: string;
}

export type DocumentStatus = Document["status"];
```

### Type Best Practices

```ts
// DO: descriptive names
export interface Topic {
  id: string;
  name: string;
  createdAt: string;
}

// DO: union types for specific values
export type ViewMode = "active" | "archived";

// DO: use utility types
export type UpdateDocumentPayload = Partial<Document> & { id: string };
export type DocumentPreview = Pick<Document, "id" | "title" | "status">;

// DON'T: use any
const data: any = response; // never do this

// DON'T: define types inline in components
const MyComponent = ({ data }: { data: { id: string; name: string } }) => {};
```

---

## Next.js App Router — Specific Guidelines

### Server vs Client: Decision Tree

```
Does the component need any of these?
  • useState / useEffect / useReducer
  • useRouter / usePathname / useSearchParams
  • useAppStore (Zustand)
  • Event handlers (onClick, onChange, onSubmit)
  • Browser APIs (localStorage, window, document)
  • Animations (motion/react)
  │
  YES → Add "use client" at the top of the file
  │
  NO  → Keep it as a Server Component
          • Can use async/await directly
          • Can call DB or services directly
          • Cannot use any of the above
```

### "use client" Rules

- Add `"use client"` as the **very first line** of the file (before imports)
- A Client Component can import other Client Components freely
- A Client Component **cannot** import Server-only code (e.g., `fs`, DB clients)
- A Server Component **can** import and render a Client Component — this is the standard "shell + component" pattern

### Server Actions Rules

- Add `"use server"` as the **very first line** of the action file (or first line of the function)
- Server Actions can only receive and return **serializable values** (plain objects, primitives, arrays — no class instances, no functions)
- Call `revalidatePath()` or `revalidateTag()` after mutations to refresh cached data
- Server Actions run on the server — you can safely access environment variables, DB, secrets

### Navigation

```tsx
// In Client Components — use useRouter from next/navigation
"use client";
import { useRouter } from "next/navigation";

export function LoginButton() {
  const router = useRouter();
  return <button onClick={() => router.push("/dashboard")}>Login</button>;
}

// In Server Components — use redirect from next/navigation
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getSession();
  if (!session) redirect("/");
  return <Dashboard />;
}
```

### Metadata

```tsx
// Static metadata — export from any page or layout
export const metadata: Metadata = {
  title: "Knowledge Capsule",
  description: "Record it. Save it. Revisit it years later.",
};

// Dynamic metadata — use generateMetadata
export async function generateMetadata({ params }: { params: { id: string } }) {
  const doc = await fetchDocument(params.id);
  return { title: doc.title };
}
```

### Images

Use `next/image` instead of `<img>` for all images. Add external domains to `next.config.ts`.

```tsx
import Image from "next/image";

<Image src="/logo.png" alt="Logo" width={200} height={50} priority />;
```

### Links

Use `next/link` instead of `<a>` for internal navigation.

```tsx
import Link from "next/link";

<Link href="/dashboard">Go to Dashboard</Link>;
```

### Fonts

Prefer `next/font` over CSS `@import url()` for Google Fonts in new features — it eliminates the flash of unstyled text and self-hosts fonts automatically.

```tsx
// src/app/layout.tsx
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jost.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Configuration Files

### `routes.ts`

**Location:** `src/utils/routes/routes.ts`

Centralized route constants for type-safe navigation.

```ts
export const appRoutes = {
  home: "/",
  dashboard: "/dashboard",
} as const;

export type AppRoute = (typeof appRoutes)[keyof typeof appRoutes];
```

**Usage:**

```tsx
import { appRoutes } from "@/utils/routes/routes";
router.push(appRoutes.dashboard);
```

### `next.config.ts`

Minimal config. Add options only when needed (e.g., external image domains, environment variables).

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "example.com" }],
  },
};

export default nextConfig;
```

---

## Helper Functions

### Organization

- `src/utils/helpers/` — Pure utility functions (formatting, validation, transformation)
- No helper should import from React, Next.js, or Zustand — keep them side-effect free

### Guidelines

1. **Pure functions** — same input → same output, no side effects
2. **Single responsibility** — one function, one purpose
3. **Type-safe** — always type parameters and return values
4. **No `any`** — use proper types or `unknown` with type guards

```ts
// src/utils/helpers/formatters.ts

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));
};

export const truncate = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
```

---

## Development Workflow

### Starting Development

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build (also runs TypeScript check)
npm run lint      # ESLint
npm run format    # Prettier (formats all files)
```

### Code Quality Checklist

Before committing:

- [ ] No `any` types — use proper types or `unknown`
- [ ] Components are in the correct directory (`ui/` vs `components/`)
- [ ] Client Components have `"use client"` as the first line
- [ ] Server Actions have `"use server"` as the first line
- [ ] Data mutations go through Server Actions in `src/app/actions/`
- [ ] No React Context API for custom state — use Zustand
- [ ] Routes are defined in `routes.ts`
- [ ] No `console.log` in committed code (`console.warn` and `console.error` are allowed)
- [ ] `npm run build` passes with zero TypeScript errors

### Keeping Components Customizable

**Principle:** Extract decisions that can change across usages into props.

```tsx
// DON'T: hardcoded, inflexible
const StatusBadge = () => <span className="text-green-500">Active</span>;

// DO: customizable with defaults
interface StatusBadgeProps {
  status: "active" | "archived";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const label = status === "active" ? "Active" : "Archived";
  return <span className={cn("text-sm font-medium", className)}>{label}</span>;
};
```

### Error Handling

- **User-facing errors:** Use `sonner` toasts (`toast.error("Something went wrong")`)
- **Server Action errors:** Return an error object from the action and handle in the component — do not `throw` for user-facing errors unless you use an Error Boundary
- **Critical failures:** Use Next.js `error.tsx` files for route-level error boundaries
- **Never expose raw error messages from the server** to the client

### Logging

| Environment | Allowed                                        |
| ----------- | ---------------------------------------------- |
| Development | `console.log`, `console.warn`, `console.error` |
| Production  | `console.warn`, `console.error` only           |

Never log tokens, passwords, or any PII.

### Authentication & Token Management

- Store auth state in Zustand with `persist` middleware
- Store tokens in `httpOnly` cookies (preferred) or `localStorage` (with caution)
- Never expose tokens in URLs or logs
- Never commit tokens or API keys — use `.env.local` for all secrets
- Clear tokens on logout and redirect to `/`
