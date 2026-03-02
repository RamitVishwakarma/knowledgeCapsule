import mongoose, { Schema, type Model } from "mongoose";

export interface ITopicDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopicDocument>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

TopicSchema.index({ userId: 1, name: 1 });

export const Topic: Model<ITopicDocument> =
  mongoose.models.Topic || mongoose.model<ITopicDocument>("Topic", TopicSchema);
