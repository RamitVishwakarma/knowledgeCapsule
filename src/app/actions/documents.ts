"use server";

import { requireAuthAndConnectDB } from "@/app/actions/utils";
import { Document as DocumentModel } from "@/lib/models/Document";
import { revalidatePath } from "next/cache";
import type { Document } from "@/lib/types";
import { serializeDoc, type RawDocumentDoc } from "@/utils/helpers/serialize";
import { actionResponse, type ActionResponse } from "@/lib/utils/response";

function detectVideoProvider(url: string): "youtube" | "other" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "other";
}

export async function getDocuments(topicId: string): Promise<ActionResponse<Document[]>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId) {
    return actionResponse("Unauthorized", 401, false, "You must be logged in to view documents.");
  }

  try {
    const docs = await DocumentModel.find({
      topicId,
      userId,
      archived: false,
    })
      .sort({ createdAt: -1 })
      .lean<RawDocumentDoc[]>();

    return actionResponse(
      "Documents fetched successfully",
      200,
      true,
      undefined,
      docs.map(serializeDoc)
    );
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return actionResponse("Failed to fetch documents", 500, false, "An unexpected error occurred.");
  }
}

export async function getArchivedDocuments(): Promise<ActionResponse<Document[]>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId) {
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to view archived documents."
    );
  }

  try {
    const docs = await DocumentModel.find({
      userId,
      archived: true,
    })
      .sort({ archivedAt: -1 })
      .lean<RawDocumentDoc[]>();

    return actionResponse(
      "Archived documents fetched successfully",
      200,
      true,
      undefined,
      docs.map(serializeDoc)
    );
  } catch (error) {
    console.error("Failed to fetch archived documents:", error);
    return actionResponse(
      "Failed to fetch archived documents",
      500,
      false,
      "An unexpected error occurred."
    );
  }
}

export async function getDocument(id: string): Promise<ActionResponse<Document | null>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId) {
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to view this document."
    );
  }

  try {
    const doc = await DocumentModel.findOne({ _id: id, userId }).lean<RawDocumentDoc>();
    if (!doc) {
      return actionResponse("Not Found", 404, false, "Document not found.");
    }

    return actionResponse("Document fetched successfully", 200, true, undefined, serializeDoc(doc));
  } catch (error) {
    console.error("Failed to fetch document:", error);
    return actionResponse("Failed to fetch document", 500, false, "An unexpected error occurred.");
  }
}

export async function createDocument(data: {
  topicId: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  videoUrl: string;
}): Promise<ActionResponse<Document>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to create a document."
    );

  if (!data.title.trim()) return actionResponse("Bad Request", 400, false, "Title is required");
  if (!data.videoUrl.trim())
    return actionResponse("Bad Request", 400, false, "Video URL is required");

  try {
    const doc = await DocumentModel.create({
      userId,
      topicId: data.topicId,
      title: data.title.trim(),
      shortDescription: data.shortDescription.trim(),
      longDescription: data.longDescription,
      videoUrl: data.videoUrl.trim(),
      videoProvider: detectVideoProvider(data.videoUrl),
    });

    revalidatePath("/dashboard");
    return actionResponse(
      "Document created successfully",
      201,
      true,
      undefined,
      serializeDoc(doc.toObject() as RawDocumentDoc)
    );
  } catch (error) {
    console.error("Failed to create document:", error);
    return actionResponse(
      "Failed to create document",
      500,
      false,
      "An unexpected error occurred while creating."
    );
  }
}

export async function updateDocument(
  id: string,
  updates: Partial<{
    title: string;
    shortDescription: string;
    longDescription: string;
    videoUrl: string;
    transcript: string;
    transcriptSource: "youtube" | "manual";
    summary: string;
    summaryStatus: "none" | "processing" | "ready" | "failed";
  }>
): Promise<ActionResponse<void>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to update this document."
    );

  try {
    const doc = await DocumentModel.findOneAndUpdate({ _id: id, userId }, updates);
    if (!doc) return actionResponse("Not Found", 404, false, "Document not found.");

    revalidatePath("/dashboard");
    return actionResponse("Document updated successfully", 200, true);
  } catch (error) {
    console.error("Failed to update document:", error);
    return actionResponse(
      "Failed to update document",
      500,
      false,
      "An unexpected error occurred while updating."
    );
  }
}

export async function archiveDocument(id: string): Promise<ActionResponse<void>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to archive this document."
    );

  try {
    const doc = await DocumentModel.findOneAndUpdate(
      { _id: id, userId },
      { archived: true, archivedAt: new Date() }
    );
    if (!doc) return actionResponse("Not Found", 404, false, "Document not found.");

    revalidatePath("/dashboard");
    return actionResponse("Document archived successfully", 200, true);
  } catch (error) {
    console.error("Failed to archive document:", error);
    return actionResponse(
      "Failed to archive document",
      500,
      false,
      "An unexpected error occurred."
    );
  }
}

export async function restoreDocument(id: string): Promise<ActionResponse<void>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to restore this document."
    );

  try {
    const doc = await DocumentModel.findOneAndUpdate(
      { _id: id, userId },
      { archived: false, archivedAt: null }
    );
    if (!doc) return actionResponse("Not Found", 404, false, "Document not found.");

    revalidatePath("/dashboard");
    return actionResponse("Document restored successfully", 200, true);
  } catch (error) {
    console.error("Failed to restore document:", error);
    return actionResponse(
      "Failed to restore document",
      500,
      false,
      "An unexpected error occurred."
    );
  }
}

export async function deleteDocument(id: string): Promise<ActionResponse<void>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to delete this document."
    );

  try {
    const doc = await DocumentModel.findOneAndDelete({ _id: id, userId });
    if (!doc) return actionResponse("Not Found", 404, false, "Document not found.");

    revalidatePath("/dashboard");
    return actionResponse("Document deleted successfully", 200, true);
  } catch (error) {
    console.error("Failed to delete document:", error);
    return actionResponse("Failed to delete document", 500, false, "An unexpected error occurred.");
  }
}
