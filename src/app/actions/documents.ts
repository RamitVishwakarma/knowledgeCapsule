"use server";

import { requireAuthAndDB } from "@/app/actions/utils";
import { Document as DocumentModel } from "@/lib/models/Document";
import { revalidatePath } from "next/cache";
import type { Document } from "@/lib/types";
import { serializeDoc, type RawDocumentDoc } from "@/utils/helpers/serialize";

function detectVideoProvider(url: string): "youtube" | "other" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "other";
}

export async function getDocuments(topicId: string): Promise<Document[]> {
  const userId = await requireAuthAndDB();
  if (!userId) return [];

  const docs = await DocumentModel.find({
    topicId,
    userId,
    archived: false,
  })
    .sort({ createdAt: -1 })
    .lean<RawDocumentDoc[]>();

  return docs.map(serializeDoc);
}

export async function getArchivedDocuments(): Promise<Document[]> {
  const userId = await requireAuthAndDB();
  if (!userId) return [];

  const docs = await DocumentModel.find({
    userId,
    archived: true,
  })
    .sort({ archivedAt: -1 })
    .lean<RawDocumentDoc[]>();

  return docs.map(serializeDoc);
}

export async function getDocument(id: string): Promise<Document | null> {
  const userId = await requireAuthAndDB();
  if (!userId) return null;

  const doc = await DocumentModel.findOne({ _id: id, userId }).lean<RawDocumentDoc>();
  if (!doc) return null;

  return serializeDoc(doc);
}

export async function createDocument(data: {
  topicId: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  videoUrl: string;
}): Promise<{ success: true; document: Document } | { error: string }> {
  const userId = await requireAuthAndDB();
  if (!userId) return { error: "Unauthorized" };

  if (!data.title.trim()) return { error: "Title is required" };
  if (!data.videoUrl.trim()) return { error: "Video URL is required" };

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
  return { success: true, document: serializeDoc(doc.toObject() as RawDocumentDoc) };
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
): Promise<{ success: true } | { error: string }> {
  const userId = await requireAuthAndDB();
  if (!userId) return { error: "Unauthorized" };

  const doc = await DocumentModel.findOneAndUpdate({ _id: id, userId }, updates);
  if (!doc) return { error: "Document not found" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function archiveDocument(id: string): Promise<{ success: true } | { error: string }> {
  const userId = await requireAuthAndDB();
  if (!userId) return { error: "Unauthorized" };

  const doc = await DocumentModel.findOneAndUpdate(
    { _id: id, userId },
    { archived: true, archivedAt: new Date() }
  );
  if (!doc) return { error: "Document not found" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function restoreDocument(id: string): Promise<{ success: true } | { error: string }> {
  const userId = await requireAuthAndDB();
  if (!userId) return { error: "Unauthorized" };

  const doc = await DocumentModel.findOneAndUpdate(
    { _id: id, userId },
    { archived: false, archivedAt: null }
  );
  if (!doc) return { error: "Document not found" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteDocument(id: string): Promise<{ success: true } | { error: string }> {
  const userId = await requireAuthAndDB();
  if (!userId) return { error: "Unauthorized" };

  const doc = await DocumentModel.findOneAndDelete({ _id: id, userId });
  if (!doc) return { error: "Document not found" };

  revalidatePath("/dashboard");
  return { success: true };
}
