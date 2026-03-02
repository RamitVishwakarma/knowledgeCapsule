# API Routes

API routes live here following the Next.js App Router convention.
Use these **only** for public HTTP endpoints (webhooks, mobile apps, third-party integrations).
For internal app data mutations, use Server Actions in `app/actions/` instead.

## Pattern

```
app/api/
└── documents/
    └── route.ts      → GET /api/documents, POST /api/documents
└── documents/[id]/
    └── route.ts      → GET /api/documents/:id, PATCH, DELETE
```

## Example `route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const topicId = request.nextUrl.searchParams.get("topicId");
  const data = await fetchDocuments(topicId);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const created = await createDocument(body);
  return NextResponse.json(created, { status: 201 });
}
```

## Route with path params

```ts
// app/api/documents/[id]/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await updateDocument(params.id, body);
  return NextResponse.json(updated);
}
```

See `guidelines.md` → "API Routes" for the full pattern.
