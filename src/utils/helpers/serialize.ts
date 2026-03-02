import type { Topic, Document } from "@/lib/types";

export interface RawTopicDoc {
  _id: { toString(): string };
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RawDocumentDoc {
  _id: { toString(): string };
  userId: string;
  topicId: string;
  title: string;
  shortDescription?: string;
  longDescription?: string;
  videoUrl: string;
  videoProvider?: "youtube" | "other";
  transcript?: string | null;
  transcriptSource?: "youtube" | "manual" | null;
  summary?: string;
  summaryStatus?: "none" | "processing" | "ready" | "failed";
  archived?: boolean;
  archivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocCountResult {
  _id: string;
  count: number;
}

export function serializeTopic(doc: RawTopicDoc, documentCount = 0): Topic {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    name: doc.name,
    documentCount,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function serializeDoc(doc: RawDocumentDoc): Document {
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
