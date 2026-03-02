"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Document as DocumentModel } from "@/lib/models/Document";
import { revalidatePath } from "next/cache";
import type { Document } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeDoc(doc: any): Document {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    topicId: doc.topicId.toString(),
    title: doc.title,
    shortDescription: doc.shortDescription ?? "",
    longDescription: doc.longDescription ?? "",
    videoUrl: doc.videoUrl,
    videoProvider: doc.videoProvider ?? "other",
    transcript: doc.transcript ?? null,
    transcriptSource: doc.transcriptSource ?? null,
    summary: doc.summary ?? "",
    summaryStatus: doc.summaryStatus ?? "none",
    archived: doc.archived ?? false,
    archivedAt: doc.archivedAt ? new Date(doc.archivedAt).toISOString() : null,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

function detectVideoProvider(url: string): "youtube" | "other" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "other";
}

export async function getDocuments(topicId: string): Promise<Document[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  await connectDB();
  const docs = await DocumentModel.find({
    topicId,
    userId: session.user.id,
    archived: false,
  })
    .sort({ createdAt: -1 })
    .lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (docs as any[]).map(serializeDoc);
}

export async function getArchivedDocuments(): Promise<Document[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  await connectDB();
  const docs = await DocumentModel.find({
    userId: session.user.id,
    archived: true,
  })
    .sort({ archivedAt: -1 })
    .lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (docs as any[]).map(serializeDoc);
}

export async function getDocument(id: string): Promise<Document | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  await connectDB();
  const doc = await DocumentModel.findOne({ _id: id, userId: session.user.id }).lean();
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
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  if (!data.title.trim()) return { error: "Title is required" };
  if (!data.videoUrl.trim()) return { error: "Video URL is required" };

  await connectDB();
  const doc = await DocumentModel.create({
    userId: session.user.id,
    topicId: data.topicId,
    title: data.title.trim(),
    shortDescription: data.shortDescription.trim(),
    longDescription: data.longDescription,
    videoUrl: data.videoUrl.trim(),
    videoProvider: detectVideoProvider(data.videoUrl),
  });

  revalidatePath("/dashboard");
  return { success: true, document: serializeDoc(doc) };
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
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectDB();
  const doc = await DocumentModel.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    updates
  );
  if (!doc) return { error: "Document not found" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function archiveDocument(
  id: string
): Promise<{ success: true } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectDB();
  const doc = await DocumentModel.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { archived: true, archivedAt: new Date() }
  );
  if (!doc) return { error: "Document not found" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function restoreDocument(
  id: string
): Promise<{ success: true } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectDB();
  const doc = await DocumentModel.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { archived: false, archivedAt: null }
  );
  if (!doc) return { error: "Document not found" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteDocument(
  id: string
): Promise<{ success: true } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectDB();
  const doc = await DocumentModel.findOneAndDelete({ _id: id, userId: session.user.id });
  if (!doc) return { error: "Document not found" };

  revalidatePath("/dashboard");
  return { success: true };
}
