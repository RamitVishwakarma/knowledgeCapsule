"use server";

import { requireAuthAndConnectDB } from "@/app/actions/utils";
import { Document } from "@/lib/models/Document";
import { fetchYouTubeTranscript } from "@/lib/services/transcript";
import { revalidatePath } from "next/cache";
import { actionResponse, type ActionResponse } from "@/lib/utils/response";

export async function fetchTranscript(
  documentId: string
): Promise<ActionResponse<{ transcript: string }>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to fetch transcripts."
    );

  const doc = await Document.findOne({ _id: documentId, userId });
  if (!doc) return actionResponse("Not Found", 404, false, "Document not found.");

  if (doc.videoProvider !== "youtube") {
    return actionResponse(
      "Bad Request",
      400,
      false,
      "Transcript fetching is only available for YouTube videos"
    );
  }

  const result = await fetchYouTubeTranscript(doc.videoUrl);

  if (!result) {
    return actionResponse(
      "Not Found",
      404,
      false,
      "Transcript not available for this video. You can paste it manually."
    );
  }

  await Document.findByIdAndUpdate(documentId, {
    transcript: result.text,
    transcriptSource: "youtube",
  });

  revalidatePath("/dashboard");
  return actionResponse("Transcript fetched successfully", 200, true, undefined, {
    transcript: result.text,
  });
}

export async function saveManualTranscript(
  documentId: string,
  transcript: string
): Promise<ActionResponse<void>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse("Unauthorized", 401, false, "You must be logged in to save transcripts.");

  if (!transcript.trim())
    return actionResponse("Bad Request", 400, false, "Transcript cannot be empty");

  const doc = await Document.findOneAndUpdate(
    { _id: documentId, userId },
    { transcript: transcript.trim(), transcriptSource: "manual" }
  );
  if (!doc) return actionResponse("Not Found", 404, false, "Document not found.");

  revalidatePath("/dashboard");
  return actionResponse("Manual transcript saved successfully", 200, true);
}
