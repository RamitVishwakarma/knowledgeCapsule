"use server";

import { requireAuthAndConnectDB } from "@/app/actions/utils";
import { Document } from "@/lib/models/Document";
import { generateSummary } from "@/lib/services/summarizer";
import { revalidatePath } from "next/cache";
import { marked } from "marked";
import { APIError } from "groq-sdk";
import { actionResponse, type ActionResponse } from "@/lib/utils/response";

export async function generateDocumentSummary(
  documentId: string
): Promise<ActionResponse<{ summary: string }>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to generate a summary."
    );

  const doc = await Document.findOne({ _id: documentId, userId });
  if (!doc) return actionResponse("Not Found", 404, false, "Document not found.");

  if (!doc.transcript) {
    return actionResponse(
      "Bad Request",
      400,
      false,
      "No transcript available. Please fetch or add a transcript first."
    );
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
    return actionResponse("Summary generated successfully", 200, true, undefined, { summary });
  } catch (err) {
    console.error("Summary generation failed:", err);
    await Document.findByIdAndUpdate(documentId, { summaryStatus: "failed" });

    if (err instanceof APIError) {
      if (err.status === 429)
        return actionResponse(
          "Rate limited",
          429,
          false,
          "Rate limit reached. Please wait a moment and try again."
        );
      if (err.status === 401)
        return actionResponse("Unauthorized API", 401, false, "API key is invalid or missing.");
      return actionResponse(
        "API Error",
        err.status || 500,
        false,
        `API error (${err.status}): ${err.message}`
      );
    }

    return actionResponse(
      "Server Error",
      500,
      false,
      "Summary generation failed. Please try again."
    );
  }
}
