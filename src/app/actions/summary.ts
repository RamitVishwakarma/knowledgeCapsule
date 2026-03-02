"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Document } from "@/lib/models/Document";
import { generateSummary } from "@/lib/services/summarizer";
import { revalidatePath } from "next/cache";
import { marked } from "marked";

export async function generateDocumentSummary(
  documentId: string
): Promise<{ success: true; summary: string } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectDB();
  const doc = await Document.findOne({ _id: documentId, userId: session.user.id });
  if (!doc) return { error: "Document not found" };

  if (!doc.transcript) {
    return { error: "No transcript available. Please fetch or add a transcript first." };
  }

  // Optimistically mark as processing
  await Document.findByIdAndUpdate(documentId, { summaryStatus: "processing" });

  try {
    const markdown = await generateSummary(doc.transcript, doc.title);
    const summary = marked.parse(markdown) as string;

    await Document.findByIdAndUpdate(documentId, {
      summary,
      summaryStatus: "ready",
    });

    revalidatePath("/dashboard");
    return { success: true, summary };
  } catch (err) {
    console.error("Summary generation failed:", err);
    await Document.findByIdAndUpdate(documentId, { summaryStatus: "failed" });
    return { error: "Summary generation failed. Please try again." };
  }
}
