import mongoose, { Schema, type Model } from "mongoose";
import type { DocumentBase } from "@/lib/types";

export interface IDocumentDocument extends DocumentBase {
  _id: mongoose.Types.ObjectId;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocumentDocument>(
  {
    userId: { type: String, required: true, index: true },
    topicId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    videoProvider: { type: String, enum: ["youtube", "other"], default: "other" },
    transcript: { type: String, default: null },
    transcriptSource: { type: String, enum: ["youtube", "manual", null], default: null },
    summary: { type: String, default: "" },
    summaryStatus: {
      type: String,
      enum: ["none", "processing", "ready", "failed"],
      default: "none",
    },
    archived: { type: Boolean, default: false, index: true },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

DocumentSchema.index({ userId: 1, topicId: 1 });

export const Document: Model<IDocumentDocument> =
  mongoose.models.KCDocument || mongoose.model<IDocumentDocument>("KCDocument", DocumentSchema);
