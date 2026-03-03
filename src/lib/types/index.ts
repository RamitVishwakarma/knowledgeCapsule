// Domain types — sourced from Mongoose model shapes, serialized for client use.
// These are the plain-object versions passed between server and client.

export interface Topic {
  id: string;
  userId: string;
  name: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentBase {
  userId: string;
  topicId: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  videoUrl: string;
  videoProvider: "youtube" | "other";
  transcript: string | null;
  transcriptSource: "youtube" | "manual" | null;
  summary: string;
  summaryStatus: "none" | "processing" | "ready" | "failed";
  archived: boolean;
}

export interface Document extends DocumentBase {
  id: string;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = "active" | "archived";

export interface SelectOptions {
  label: string | React.ReactNode;
  value: string | number;
  [key: string]: unknown;
}
