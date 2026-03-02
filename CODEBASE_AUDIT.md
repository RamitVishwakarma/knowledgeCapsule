# Codebase Audit — Knowledge Capsule

> Generated: 2026-03-03
> Covers: DRY violations, YAGNI violations, anti-patterns, and full repo structure

---

## Table of Contents

1. [Repository Structure](#repository-structure)
2. [DRY Violations](#dry-violations)
3. [YAGNI Violations](#yagni-violations)
4. [Anti-Pattern Violations](#anti-pattern-violations)
5. [Summary Table](#summary-table)
6. [Recommendations](#recommendations)

---

## Repository Structure

```
knowledge-capsule-next/
│
├── public/
│   └── logo.svg                     — App logo (SVG asset)
│
├── src/
│   │
│   ├── app/                         — Next.js App Router root
│   │   ├── layout.tsx               — Root layout: wraps all pages with <Providers> and <Toaster>
│   │   ├── page.tsx                 — Landing page shell (Server Component → renders <LandingPage>)
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx             — Dashboard shell (Server Component): fetches initial topics/docs from
│   │   │                              MongoDB and passes them as props to <Dashboard>
│   │   │
│   │   ├── api/
│   │   │   ├── README.md            — Documents API route conventions
│   │   │   └── auth/[...nextauth]/
│   │   │       └── route.ts         — NextAuth catch-all handler; force-dynamic to avoid static analysis error
│   │   │
│   │   └── actions/                 — All server mutations live here (no API routes for internal use)
│   │       ├── README.md            — Documents Server Action conventions
│   │       ├── topics.ts            — CRUD for Topics (create, rename, delete, list)
│   │       ├── documents.ts         — CRUD for Documents (create, update, archive, restore, delete, list)
│   │       ├── transcript.ts        — Fetch YouTube transcript or save manual transcript
│   │       └── summary.ts           — Trigger Groq summary generation for a document
│   │
│   ├── lib/                         — Pure backend/shared library code
│   │   ├── auth.ts                  — NextAuth v4 config: Google provider + MongoDB adapter + session callbacks
│   │   │
│   │   ├── types/
│   │   │   └── index.ts             — Re-exports domain types (Topic, Document, SummaryStatus, etc.)
│   │   │
│   │   ├── db/
│   │   │   ├── mongodb.ts           — Native MongoClient singleton (used by NextAuth adapter only)
│   │   │   └── mongoose.ts          — Mongoose connection singleton (used by all Mongoose models)
│   │   │
│   │   ├── models/
│   │   │   ├── Topic.ts             — Mongoose schema for Topic (userId as String, timestamps)
│   │   │   └── Document.ts          — Mongoose schema named KCDocument (avoids conflict with global Document)
│   │   │
│   │   └── services/
│   │       ├── transcript.ts        — YouTube transcript fetching via `youtube-transcript` npm package
│   │       └── summarizer.ts        — Groq API summarization (llama3-8b-8192, free tier)
│   │
│   ├── components/
│   │   ├── providers.tsx            — Thin wrapper: SessionProvider from next-auth/react
│   │   ├── landing-page.tsx         — Full landing page UI with hero, features, animations (~600 lines)
│   │   ├── dashboard.tsx            — Main app layout: sidebar + document list + document detail
│   │   ├── sidebar.tsx              — Topic list, add/rename/delete topic, settings panel
│   │   ├── document-list.tsx        — Active and archived document lists with inline actions
│   │   ├── document-detail.tsx      — Full document view: title, descriptions, video, transcript, summary
│   │   ├── tiptap-editor.tsx        — Tiptap rich-text editor wrapper (used for summary display/edit)
│   │   │
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx — Image component with error fallback (UNUSED — see YAGNI section)
│   │   │
│   │   └── ui/                      — shadcn/ui primitives (auto-generated, ~40+ components)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── form.tsx
│   │       ├── label.tsx
│   │       ├── textarea.tsx
│   │       ├── select.tsx
│   │       ├── dialog.tsx
│   │       ├── tabs.tsx
│   │       ├── accordion.tsx
│   │       ├── badge.tsx
│   │       ├── card.tsx
│   │       ├── separator.tsx
│   │       ├── tooltip.tsx
│   │       ├── alert.tsx
│   │       ├── sonner.tsx
│   │       ├── use-mobile.ts
│   │       ├── utils.ts
│   │       └── ... (20+ more — see YAGNI section for unused ones)
│   │
│   ├── store/
│   │   ├── README.md                — Documents Zustand store conventions
│   │   └── appStore.ts              — Zustand store: UI-only state (selectedTopicId, selectedDocId,
│   │                                   sidebarOpen, viewMode). Domain types also exported from here.
│   │
│   ├── utils/
│   │   └── routes/
│   │       └── routes.ts            — Centralized type-safe route constants (appRoutes object)
│   │
│   ├── styles/
│   │   └── globals.css              — Tailwind v4 config via CSS (@theme), all CSS custom properties,
│   │                                   base styles. No tailwind.config.js.
│   │
│   └── proxy.ts                     — NextAuth middleware (not middleware.ts — deprecated in Next.js 16);
│                                       protects /dashboard route
│
├── CLAUDE.md                        — Project guidelines for Claude Code
├── CODEBASE_AUDIT.md                — This file
├── README.md                        — Project README
├── SRS.md                           — Software Requirements Specification
├── guidelines.md                    — Additional development guidelines
├── next.config.ts                   — Next.js config (minimal)
├── tsconfig.json                    — TypeScript config (strict, path aliases via @/*)
├── postcss.config.mjs               — PostCSS config for Tailwind v4
├── eslint.config.mjs                — ESLint config (no-any rule enforced)
└── package.json                     — Dependencies and npm scripts
```

---

## DRY Violations

### 1. Topic Serialization Duplicated in Two Places (HIGH)

**Files affected:**
- [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx) — inline serialization inside `Page`
- [src/app/actions/topics.ts](src/app/actions/topics.ts) — `serializeTopic()` helper function

`dashboard/page.tsx` re-implements the exact same MongoDB → TypeScript mapping that `topics.ts` already has in `serializeTopic()`. If a field is added to the Topic schema, it must be updated in both places.

```typescript
// dashboard/page.tsx (duplicated logic)
const topics: TopicType[] = (rawTopics as any[]).map((raw: any) => ({
  id: raw._id.toString(),
  userId: raw.userId.toString(),
  name: raw.name,
  createdAt: raw.createdAt?.toISOString(),
  updatedAt: raw.updatedAt?.toISOString(),
  documentCount: countMap.get(raw._id.toString()) ?? 0,
}));

// topics.ts (canonical version that exists but isn't reused in page.tsx)
function serializeTopic(doc: any, documentCount = 0): Topic {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    name: doc.name,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
    documentCount,
  };
}
```

**Fix:** Export `serializeTopic` from `actions/topics.ts` and call it from `dashboard/page.tsx`.

---

### 2. Session Auth Check Repeated 13+ Times (MEDIUM)

**Files affected:**
- [src/app/actions/topics.ts](src/app/actions/actions/topics.ts) — 4 occurrences
- [src/app/actions/documents.ts](src/app/actions/documents.ts) — 7 occurrences
- [src/app/actions/transcript.ts](src/app/actions/transcript.ts) — 2 occurrences
- [src/app/actions/summary.ts](src/app/actions/summary.ts) — 1 occurrence

Every server action starts with this identical guard:

```typescript
const session = await getServerSession(authOptions);
if (!session?.user?.id) return { error: "Unauthorized" };
```

**Fix:** Create a utility in `src/lib/auth.ts` (or `src/utils/helpers/auth.ts`):

```typescript
export async function requireUserId(): Promise<{ userId: string } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };
  return { userId: session.user.id };
}
```

---

### 3. Edit State Pattern Repeated 4 Times (MEDIUM)

**File:** [src/components/document-detail.tsx](src/components/document-detail.tsx)

Four fields all use the same `[editing, setEditing]` + `[draft, setDraft]` pattern:

```typescript
const [editingTitle, setEditingTitle] = useState(false);
const [titleDraft, setTitleDraft] = useState("");

const [editingShortDesc, setEditingShortDesc] = useState(false);
const [shortDescDraft, setShortDescDraft] = useState("");

const [editingLongDesc, setEditingLongDesc] = useState(false);
const [longDescDraft, setLongDescDraft] = useState("");

const [editingTranscript, setEditingTranscript] = useState(false);
const [transcriptDraft, setTranscriptDraft] = useState("");
```

**Fix:** Create a `useEditField(initialValue)` hook that returns `{ isEditing, draft, startEdit, setDraft, cancelEdit }`.

---

### 4. YouTube Video ID Extraction Duplicated (LOW)

**Files affected:**
- [src/lib/services/transcript.ts](src/lib/services/transcript.ts) — full multi-pattern extraction
- [src/components/document-detail.tsx](src/components/document-detail.tsx) — single-pattern extraction for embed URL

Both parse the YouTube video ID with the same regex. The client-side one only handles `watch?v=` and `youtu.be/` but not `/embed/`.

```typescript
// transcript.ts (server)
const patterns = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
];

// document-detail.tsx (client)
const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
```

**Fix:** Move the extraction logic to `src/utils/helpers/youtube.ts` and import in both locations. This also ensures the embed URL builder handles all URL formats.

---

### 5. Document Mutation Optimistic Updates Repeated (LOW)

**File:** [src/components/document-detail.tsx](src/components/document-detail.tsx)

Every `handleSaveField` call wraps `setDoc` in the same pattern:

```typescript
setDoc((prev) => prev ? { ...prev, [field]: value } : prev);
```

The `prev ? ... : prev` guard is applied identically ~8 times. Since `doc` is already guaranteed non-null at render time, the ternary adds noise.

---

## YAGNI Violations

### 1. Unused npm Dependencies (~10 packages) (HIGH)

**File:** [package.json](package.json)

The following packages are installed but **not imported anywhere** in the codebase:

| Package | Version | Likely Intent |
|---------|---------|---------------|
| `@emotion/react` | 11.14.0 | MUI peer dep |
| `@emotion/styled` | 11.14.1 | MUI peer dep |
| `@mui/material` | 7.3.5 | Alternative UI library |
| `@mui/icons-material` | 7.3.5 | MUI icons |
| `react-dnd` | 16.0.1 | Drag-and-drop |
| `react-dnd-html5-backend` | 16.0.1 | DnD HTML5 backend |
| `react-responsive-masonry` | 2.7.1 | Masonry layout |
| `react-slick` | 0.31.0 | Carousel/slider |
| `recharts` | 2.15.2 | Charts |

These inflate the production bundle and install time with no current benefit.

**Fix:** Remove them via `npm uninstall <package>`.

---

### 2. Unused shadcn/ui Components (MEDIUM)

**Folder:** [src/components/ui/](src/components/ui/)

Approximately 20+ shadcn components are present but never imported by application code:

- carousel.tsx
- chart.tsx
- context-menu.tsx
- drawer.tsx
- dropdown-menu.tsx
- hover-card.tsx
- input-otp.tsx
- menubar.tsx
- navigation-menu.tsx
- pagination.tsx
- popover.tsx
- progress.tsx
- resizable.tsx
- scroll-area.tsx
- sheet.tsx
- sidebar.tsx _(the shadcn sidebar, not the custom one)_
- skeleton.tsx
- slider.tsx
- table.tsx
- toggle.tsx
- toggle-group.tsx
- alert-dialog.tsx
- radio-group.tsx

These are tree-shaken at build time by Next.js but they still add cognitive overhead and maintenance surface.

---

### 3. `ImageWithFallback` Component Never Used (LOW)

**File:** [src/components/figma/ImageWithFallback.tsx](src/components/figma/ImageWithFallback.tsx)

This component is defined but imported nowhere. The entire `figma/` directory exists for a Figma-to-code workflow that hasn't been adopted.

**Fix:** Delete the file and directory, or keep only if Figma integration is planned.

---

### 4. Inline Custom SVG Icon When Lucide Has It (LOW)

**File:** [src/components/document-detail.tsx](src/components/document-detail.tsx)

A `SparklesIcon` function component is defined inline with raw SVG path data:

```typescript
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ...>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582..." />
      ...
    </svg>
  );
}
```

Lucide (already a dependency) exports a `Sparkles` icon that is identical.

**Fix:** Replace with `import { Sparkles } from "lucide-react"`.

---

## Anti-Pattern Violations

### 1. `any` Type Assertions With ESLint Suppression (HIGH)

**Files affected:**
- [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)
- [src/app/actions/topics.ts](src/app/actions/topics.ts)
- [src/app/actions/documents.ts](src/app/actions/documents.ts)

Despite `"@typescript-eslint/no-explicit-any": "error"` in the ESLint config, multiple `// eslint-disable-next-line` comments bypass the rule. This defeats the purpose of the strict setting.

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topics: TopicType[] = (rawTopics as any[]).map((raw: any) => { ... });
```

**Root cause:** MongoDB aggregation pipeline results are untyped by default.

**Fix:** Define types for the aggregation result shape:

```typescript
interface RawTopicDoc {
  _id: Types.ObjectId;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

Then use `lean<RawTopicDoc[]>()` on the Mongoose query.

---

### 2. `dangerouslySetInnerHTML` on User-Provided Content (HIGH)

**File:** [src/components/document-detail.tsx](src/components/document-detail.tsx)

```typescript
// For longDescription
dangerouslySetInnerHTML={{ __html: doc.longDescription }}

// For summary (rendered as HTML from Tiptap output)
dangerouslySetInnerHTML={{ __html: renderedSummary }}
```

Both fields originate from user input. While Tiptap does some sanitization, content stored in MongoDB could theoretically be crafted or corrupted. Rendering it with `dangerouslySetInnerHTML` without explicit sanitization is an XSS risk.

**Fix:** Use [DOMPurify](https://github.com/cure53/DOMPurify) before rendering:

```typescript
import DOMPurify from "dompurify";
dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(doc.longDescription) }}
```

---

### 3. Missing Effect Cleanup — Potential State Update on Unmounted Component (MEDIUM)

**Files affected:**
- [src/components/document-detail.tsx](src/components/document-detail.tsx)
- [src/components/document-list.tsx](src/components/document-list.tsx)

Both effects fire async calls without cleanup, so if the component unmounts before the promise resolves, `setState` is called on an unmounted component:

```typescript
// document-list.tsx
useEffect(() => {
  setIsLoading(true);
  getDocuments(selectedTopicId).then((docs) => {
    setDocuments(docs);      // ← called even if component is gone
    setIsLoading(false);
  });
}, [selectedTopicId]);
```

**Fix:** Use an `isMounted` flag or an `AbortController`:

```typescript
useEffect(() => {
  let cancelled = false;
  setIsLoading(true);
  getDocuments(selectedTopicId).then((docs) => {
    if (!cancelled) {
      setDocuments(docs);
      setIsLoading(false);
    }
  });
  return () => { cancelled = true; };
}, [selectedTopicId]);
```

---

### 4. Race Condition in Summary Generation (MEDIUM)

**File:** [src/components/document-detail.tsx](src/components/document-detail.tsx)

The "Generate Summary" button is disabled via `isGenerating`, but there is no protection against a stale request overwriting a fresher one if the user somehow triggers two calls:

```typescript
const handleGenerateSummary = () => {
  startGenerating(async () => {
    setDoc((prev) => prev ? { ...prev, summaryStatus: "processing" } : prev);
    const result = await generateDocumentSummary(doc.id);
    // result from first call may arrive AFTER second call resolves
    setDoc((prev) => prev ? { ...prev, summary: result.summary, summaryStatus: "ready" } : prev);
  });
};
```

`useTransition` batches the UI but does not cancel in-flight server actions. This is a latent issue.

---

### 5. Unnecessary Ternary in Guaranteed Non-Null State Updates (LOW)

**File:** [src/components/document-detail.tsx](src/components/document-detail.tsx)

The component returns `null` early if `!doc` (line ~76), making all subsequent `setDoc` calls within handlers unreachable when `doc` is null. Yet every updater still defensively checks:

```typescript
setDoc((prev) => prev ? { ...prev, [field]: value } : prev);
```

Since `doc` is guaranteed non-null at that point, this is dead code noise.

**Fix:**

```typescript
setDoc((prev) => ({ ...prev!, [field]: value }));
```

---

### 6. Error Discrimination Missing in Summary Action (LOW)

**File:** [src/app/actions/summary.ts](src/app/actions/summary.ts)

The catch block treats all errors identically:

```typescript
} catch (err) {
  console.error("Summary generation failed:", err);
  await Document.findByIdAndUpdate(documentId, { summaryStatus: "failed" });
  return { error: "Summary generation failed. Please try again." };
}
```

A Groq rate-limit error, a DB connection error, and a malformed response all surface the same message. Users have no way to understand whether to retry immediately or wait.

---

### 7. Zustand Store Imports Not Via Selector (LOW)

**File:** [src/store/appStore.ts](src/store/appStore.ts) (and consumers)

Components call `useAppStore()` and destructure multiple values:

```typescript
const { selectedTopicId, selectedDocId, sidebarOpen, setSelectedDocId } = useAppStore();
```

This causes the component to re-render on **any** store change, even changes to unrelated slices. Zustand's recommended pattern is to use individual selectors:

```typescript
const selectedTopicId = useAppStore((s) => s.selectedTopicId);
```

---

## Summary Table

| # | Issue | File(s) | Type | Severity |
|---|-------|---------|------|----------|
| 1 | Topic serialization duplicated | `dashboard/page.tsx` + `actions/topics.ts` | DRY | HIGH |
| 2 | Session auth guard repeated 13+ times | All `actions/*.ts` | DRY | MEDIUM |
| 3 | Edit state pattern repeated 4× | `document-detail.tsx` | DRY | MEDIUM |
| 4 | YouTube ID extraction duplicated | `transcript.ts` + `document-detail.tsx` | DRY | LOW |
| 5 | Optimistic update ternary noise repeated 8× | `document-detail.tsx` | DRY | LOW |
| 6 | 9 unused npm packages installed | `package.json` | YAGNI | HIGH |
| 7 | 20+ unused shadcn/ui components | `src/components/ui/` | YAGNI | MEDIUM |
| 8 | `ImageWithFallback` component unused | `figma/ImageWithFallback.tsx` | YAGNI | LOW |
| 9 | Inline custom `SparklesIcon` SVG | `document-detail.tsx` | YAGNI | LOW |
| 10 | `any` assertions with ESLint suppression | `dashboard/page.tsx`, `actions/*.ts` | Anti-pattern | HIGH |
| 11 | `dangerouslySetInnerHTML` without sanitization | `document-detail.tsx` | Anti-pattern | HIGH |
| 12 | Missing effect cleanup (unmount leak) | `document-detail.tsx`, `document-list.tsx` | Anti-pattern | MEDIUM |
| 13 | Race condition in summary generation | `document-detail.tsx` | Anti-pattern | MEDIUM |
| 14 | Unnecessary null ternary in state updaters | `document-detail.tsx` | Anti-pattern | LOW |
| 15 | No error discrimination in catch block | `actions/summary.ts` | Anti-pattern | LOW |
| 16 | Zustand accessed without selectors | All consumer components | Anti-pattern | LOW |

---

## Recommendations

### High Priority (Security / Correctness)

1. **Remove unused npm packages** — `npm uninstall @emotion/react @emotion/styled @mui/material @mui/icons-material react-dnd react-dnd-html5-backend react-responsive-masonry react-slick recharts`
2. **Sanitize HTML before rendering** — add `dompurify` and wrap all `dangerouslySetInnerHTML` usages
3. **Eliminate `any` via proper Mongoose lean types** — define `RawTopicDoc` / `RawDocumentDoc` interfaces; use `.lean<T[]>()`

### Medium Priority (Maintainability)

4. **Extract `requireUserId()` utility** — remove the 13+ duplicated session guards into one function
5. **Export and reuse `serializeTopic()`** — call it from `dashboard/page.tsx` instead of re-implementing
6. **Add effect cleanup** — add `cancelled` flags in `document-detail.tsx` and `document-list.tsx` effects
7. **Create `useEditField` hook** — eliminate the 4× repeated editing state boilerplate

### Low Priority (Housekeeping)

8. **Move YouTube ID extraction to `src/utils/helpers/youtube.ts`** — reuse on client and server
9. **Replace inline `SparklesIcon` with `import { Sparkles } from "lucide-react"`**
10. **Delete `src/components/figma/`** — unused directory
11. **Use Zustand selectors** — replace bulk destructuring with per-field selectors to avoid unnecessary re-renders
12. **Remove or plan unused shadcn/ui components** — delete the ones with no current or near-term use
