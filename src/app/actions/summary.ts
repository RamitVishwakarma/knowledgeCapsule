"use server";

import { requireAuthAndDB } from "@/app/actions/utils";
import { Document } from "@/lib/models/Document";
import { generateSummary } from "@/lib/services/summarizer";
import { revalidatePath } from "next/cache";
import { marked } from "marked";
import { APIError } from "groq-sdk";

export async function generateDocumentSummary(
  documentId: string
): Promise<{ success: true; summary: string } | { error: string }> {
  const userId = await requireAuthAndDB();
  if (!userId) return { error: "Unauthorized" };

  const doc = await Document.findOne({ _id: documentId, userId });
  if (!doc) return { error: "Document not found" };

  if (!doc.transcript) {
    return { error: "No transcript available. Please fetch or add a transcript first." };
  }

  // Optimistically mark as processing
  await Document.findByIdAndUpdate(documentId, { summaryStatus: "processing" });

  try {
    const markdown = await generateSummary(doc.transcript, doc.title);
    const summary = await marked.parse(markdown);

    await Document.findByIdAndUpdate(documentId, {
      summary,
      summaryStatus: "ready",
    });

    revalidatePath("/dashboard");
    return { success: true, summary };
  } catch (err) {
    console.error("Summary generation failed:", err);
    await Document.findByIdAndUpdate(documentId, { summaryStatus: "failed" });

    if (err instanceof APIError) {
      if (err.status === 429)
        return { error: "Rate limit reached. Please wait a moment and try again." };
      if (err.status === 401) return { error: "API key is invalid or missing." };
      return { error: `API error (${err.status}): ${err.message}` };
    }

    return { error: "Summary generation failed. Please try again." };
  }
}
