"use server";

import { requireAuthAndDB } from "@/app/actions/utils";
import { Document } from "@/lib/models/Document";
import { fetchYouTubeTranscript } from "@/lib/services/transcript";
import { revalidatePath } from "next/cache";

export async function fetchTranscript(
  documentId: string
): Promise<{ success: true; transcript: string } | { error: string }> {
  const userId = await requireAuthAndDB();
  if (!userId) return { error: "Unauthorized" };

  const doc = await Document.findOne({ _id: documentId, userId });
  if (!doc) return { error: "Document not found" };

  if (doc.videoProvider !== "youtube") {
    return { error: "Transcript fetching is only available for YouTube videos" };
  }

  const result = await fetchYouTubeTranscript(doc.videoUrl);

  if (!result) {
    return {
      error: "Transcript not available for this video. You can paste it manually.",
    };
  }

  await Document.findByIdAndUpdate(documentId, {
    transcript: result.text,
    transcriptSource: "youtube",
  });

  revalidatePath("/dashboard");
  return { success: true, transcript: result.text };
}

export async function saveManualTranscript(
  documentId: string,
  transcript: string
): Promise<{ success: true } | { error: string }> {
  const userId = await requireAuthAndDB();
  if (!userId) return { error: "Unauthorized" };

  if (!transcript.trim()) return { error: "Transcript cannot be empty" };

  const doc = await Document.findOneAndUpdate(
    { _id: documentId, userId },
    { transcript: transcript.trim(), transcriptSource: "manual" }
  );
  if (!doc) return { error: "Document not found" };

  revalidatePath("/dashboard");
  return { success: true };
}
