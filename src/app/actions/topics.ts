"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Topic as TopicModel } from "@/lib/models/Topic";
import { Document as DocumentModel } from "@/lib/models/Document";
import { revalidatePath } from "next/cache";
import type { Topic } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeTopic(doc: any, documentCount = 0): Topic {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    name: doc.name,
    documentCount,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function getTopics(): Promise<Topic[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  await connectDB();

  const [rawTopics, docCounts] = await Promise.all([
    TopicModel.find({ userId: session.user.id }).sort({ createdAt: 1 }).lean(),
    DocumentModel.aggregate([
      { $match: { userId: session.user.id, archived: false } },
      { $group: { _id: "$topicId", count: { $sum: 1 } } },
    ]),
  ]);

  const countMap = new Map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (docCounts as any[]).map((c) => [c._id.toString(), c.count as number])
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (rawTopics as any[]).map((t) =>
    serializeTopic(t, countMap.get(t._id.toString()) ?? 0)
  );
}

export async function createTopic(
  name: string
): Promise<{ success: true; topic: Topic } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  if (!name.trim()) return { error: "Topic name is required" };

  await connectDB();
  const topic = await TopicModel.create({ userId: session.user.id, name: name.trim() });
  revalidatePath("/dashboard");
  return { success: true, topic: serializeTopic(topic) };
}

export async function renameTopic(
  id: string,
  name: string
): Promise<{ success: true } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  if (!name.trim()) return { error: "Topic name is required" };

  await connectDB();
  const topic = await TopicModel.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { name: name.trim() }
  );
  if (!topic) return { error: "Topic not found" };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTopic(
  id: string
): Promise<{ success: true } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  await connectDB();
  const topic = await TopicModel.findOneAndDelete({ _id: id, userId: session.user.id });
  if (!topic) return { error: "Topic not found" };

  // Cascade delete all documents under this topic
  await DocumentModel.deleteMany({ topicId: id, userId: session.user.id });

  revalidatePath("/dashboard");
  return { success: true };
}
