# Software Requirements Specification (SRS) — v0.3

- **Project:** (TBD)
- **Author:** Ramit
- **Status:** Architecture Locked (MongoDB + YT Transcript + Manual Fallback)

---

## 1. System Overview

A private, single-user knowledge vault platform that allows authenticated users to:

- Create topics
- Add documents under topics
- Attach external video links (primarily YouTube)
- Automatically generate summaries using YouTube transcripts
- Edit summaries inline using Tiptap
- Store everything privately per account

The system does **NOT**:

- Host videos
- Support collaboration
- Provide public viewing
- Perform speech-to-text processing

---

## 2. Architectural Decisions (Locked)

| Area             | Decision                          |
| ---------------- | --------------------------------- |
| Database         | MongoDB                           |
| ORM/ODM          | Mongoose (or native Mongo driver) |
| Auth             | NextAuth (Google primary)         |
| Backend          | Next.js API Routes                |
| Summary Input    | YouTube Transcript (if available) |
| Summary Fallback | Manual Transcript Paste           |
| Summary Storage  | Stored in MongoDB                 |
| Hosting          | TBD (likely Vercel)               |
| Privacy          | 100% private per user             |

---

## 3. System Architecture

### High-Level Flow

```
User adds YouTube link
→ Backend attempts transcript fetch
→ Transcript stored (if available)
→ Summary generated from transcript
→ Summary stored
→ User edits summary inline
→ Edits overwrite stored summary
```

**If transcript not available:**

```
User manually pastes transcript
→ Summary generated
→ Stored
```

---

## 4. Data Model (MongoDB Optimized)

Because MongoDB is document-based, we optimize for nested relationships where logical.

### 4.1 Users Collection

```json
{
  "_id": "ObjectId",
  "email": "string",
  "name": "string",
  "image": "string",
  "provider": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 4.2 Topics Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "name": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Indexes:**

- `userId`
- `userId` + `name` (optional uniqueness constraint per user)

### 4.3 Documents Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "topicId": "ObjectId",
  "title": "string",
  "shortDescription": "string",
  "longDescription": {
    "type": "Object   // Tiptap JSON"
  },
  "videoUrl": "string",
  "videoProvider": "youtube | other",
  "transcript": "string | null",
  "transcriptSource": "youtube | manual | null",
  "summary": {
    "type": "Object   // Tiptap JSON"
  },
  "summaryStatus": "none | processing | ready | failed",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Indexes:**

- `userId`
- `topicId`
- `userId` + `topicId`

---

## 5. Functional Requirements

### 5.1 Authentication

- **FR-A1:** User must sign in via NextAuth.
- **FR-A2:** Google provider required.
- **FR-A3:** Logout must invalidate session.
- **FR-A4:** All API routes must validate session.

> No anonymous access.

### 5.2 Topic Management

- **FR-T1:** Create topic
- **FR-T2:** Rename topic
- **FR-T3:** Delete topic (cascade delete documents)
- **FR-T4:** Topics visible only to owner
- **FR-T5:** Sidebar displays topics

### 5.3 Document Management

- **FR-D1:** Create document under topic
- **FR-D2:** Store external video link only
- **FR-D3:** Auto-detect if link is YouTube
- **FR-D4:** Inline editing for:
  - Title
  - Short Description
  - Long Description
  - Summary
- **FR-D5:** Delete document
- **FR-D6:** Show embedded video preview (YouTube embed if possible)

---

## 6. Transcript & Summary System

### 6.1 Transcript Retrieval (Option 1)

- **FR-S1:** If `videoProvider = youtube` → attempt transcript fetch
- **FR-S2:** If transcript exists → store in `transcript` field
- **FR-S3:** `transcriptSource = "youtube"`

**Failure cases:**

- Transcript disabled
- Transcript unavailable
- Private video

> If transcript fails → system sets `transcriptSource = null`

### 6.2 Manual Transcript Fallback (Option 2)

- **FR-S4:** If no transcript found → allow user to paste transcript manually
- **FR-S5:** `transcriptSource = "manual"`
- **FR-S6:** User can edit transcript

### 6.3 Summary Generation

- **FR-S7:** Summary generation requires transcript
- **FR-S8:** When generating summary:
  - `summaryStatus = "processing"`
  - After generation → `summaryStatus = "ready"`
  - On failure → `"failed"`
- **FR-S9:** Summary stored as Tiptap JSON
- **FR-S10:** User edits overwrite stored summary
- **FR-S11:** User can regenerate summary

### 6.4 Summary Generation Logic (No Paid APIs Assumed)

Since we are not using paid APIs:

**Acceptable approaches:**

- Lightweight server-side summarization algorithm
  (e.g., frequency-based extraction, paragraph condensation)
- Local LLM if running server locally (optional future)

**For SRS v0.3:**
System must support plug-in summarization engine.
Implementation may initially use simple extractive summarization.

---

## 7. UI Requirements

### 7.1 Pages

**Landing Page**

- CTA → Sign in with Google

**Dashboard**

- Layout:
  - **Left Sidebar:** Topics + Settings
  - **Main Area:**
    - Title input
    - Add More button
    - Video preview
    - Summary section

**Settings**

- Rename topic
- Future account settings placeholder

### 7.2 Responsiveness

Must:

- Work on mobile viewport
- Sidebar collapsible on small screens
- Editor usable on mobile

---

## 8. API Structure

### Topics

| Method   | Endpoint          |
| -------- | ----------------- |
| `GET`    | `/api/topics`     |
| `POST`   | `/api/topics`     |
| `PUT`    | `/api/topics/:id` |
| `DELETE` | `/api/topics/:id` |

### Documents

| Method   | Endpoint                    |
| -------- | --------------------------- |
| `GET`    | `/api/topics/:id/documents` |
| `POST`   | `/api/topics/:id/documents` |
| `PUT`    | `/api/documents/:id`        |
| `DELETE` | `/api/documents/:id`        |

### Transcript & Summary

| Method | Endpoint                              |
| ------ | ------------------------------------- |
| `POST` | `/api/documents/:id/fetch-transcript` |
| `POST` | `/api/documents/:id/generate-summary` |

---

## 9. Security Requirements

- Validate ownership on every request
- Prevent IDOR (Insecure Direct Object Reference)
- Validate YouTube URL format
- Sanitize transcript input
- Sanitize rich text output from Tiptap

---

## 10. Performance Expectations

Since single-user:

- Transcript fetch under 5 seconds acceptable
- Summary generation under 10 seconds acceptable
- No horizontal scaling required

---

## 11. Constraints

- Zero cost
- No video storage
- No speech-to-text processing
- No public APIs that require billing

---

## 12. Risks

- YouTube transcript scraping may break if API changes
- Some videos have disabled captions
- Extractive summarizer quality may be low
- Large transcripts may cause memory spikes

**Mitigation:**

- Limit transcript length
- Truncate very long transcripts before summarizing
- Cache transcript after first fetch

---

## 13. What Is Explicitly Out of Scope

- Collaboration
- Public sharing
- User roles
- Analytics
- Tagging
- Search inside transcript
- Version history
- Video upload
- Realtime processing queue

---

## 14. Future Upgrade Path

- Add search via Mongo text index
- Add tagging
- Add public read-only mode
- Replace summarizer with LLM API
- Add version history for summary edits

---

## 15. Final Architecture Snapshot

| Component         | Technology                        |
| ----------------- | --------------------------------- |
| Frontend          | Next.js + Tailwind                |
| Auth              | NextAuth (Google)                 |
| DB                | MongoDB                           |
| Transcript Source | YouTube API or caption endpoint   |
| Summary Engine    | Server-side extractive summarizer |
| Editor            | Tiptap                            |
| Hosting           | Vercel (likely)                   |
