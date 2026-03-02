# Server Actions

Server Actions are `"use server"` async functions that run on the server but can be called directly from Client Components — no HTTP round trip, no API route needed.

## Pattern

```
app/actions/[feature].ts  →  component calls it directly
```

## Example

```ts
// app/actions/documents.ts
"use server";

import { revalidatePath } from "next/cache";

export async function createDocument(payload: { title: string; topicId: string }) {
  // Call DB or external service directly here — this runs on the server
  await db.documents.create(payload);
  revalidatePath("/dashboard");
}

export async function fetchDocuments(topicId?: string) {
  // Direct DB/API call — returns plain serializable objects only
  return db.documents.findMany({ where: { topicId } });
}
```

## Calling from a Client Component

```tsx
"use client";

import { createDocument } from "@/app/actions/documents";

export function AddDocumentForm() {
  async function handleSubmit(formData: FormData) {
    await createDocument({
      title: formData.get("title") as string,
      topicId: formData.get("topicId") as string,
    });
  }
  return <form action={handleSubmit}>...</form>;
}
```

## Fetching in Server Components

```tsx
// app/dashboard/page.tsx — Server Component
import { fetchDocuments } from "@/app/actions/documents";

export default async function DashboardPage() {
  const docs = await fetchDocuments();
  return <Dashboard initialDocs={docs} />;
}
```

## When to use Server Actions vs API Routes

| | Server Actions | API Routes |
|---|---|---|
| Internal mutations | ✅ | ✗ |
| Form submissions | ✅ | ✗ |
| Public HTTP endpoint | ✗ | ✅ |
| Webhook receiver | ✗ | ✅ |
| Mobile app API | ✗ | ✅ |

See `guidelines.md` → "Server Actions" for the full pattern.
