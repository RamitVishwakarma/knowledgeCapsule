"use server";

import { requireAuthAndConnectDB } from "@/app/actions/utils";
import { Topic as TopicModel } from "@/lib/models/Topic";
import { Document as DocumentModel } from "@/lib/models/Document";
import { revalidatePath } from "next/cache";
import type { Topic } from "@/lib/types";
import { serializeTopic, type RawTopicDoc, type DocCountResult } from "@/utils/helpers/serialize";
import { actionResponse, type ActionResponse } from "@/lib/utils/response";

export async function getTopics(): Promise<ActionResponse<Topic[]>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId) {
    return actionResponse("Unauthorized", 401, false, "You must be logged in to view topics.");
  }

  try {
    const [rawTopics, docCounts] = await Promise.all([
      TopicModel.find({ userId }).sort({ createdAt: 1 }).lean<RawTopicDoc[]>(),
      DocumentModel.aggregate<DocCountResult>([
        { $match: { userId, archived: false } },
        { $group: { _id: "$topicId", count: { $sum: 1 } } },
      ]),
    ]);

    const countMap = new Map(docCounts.map((c) => [c._id.toString(), c.count]));

    return actionResponse(
      "Topics fetched successfully",
      200,
      true,
      undefined,
      rawTopics.map((t) => serializeTopic(t, countMap.get(t._id.toString()) ?? 0))
    );
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return actionResponse("Failed to fetch topics", 500, false, "An unexpected error occurred.");
  }
}

export async function createTopic(name: string): Promise<ActionResponse<Topic>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse("Unauthorized", 401, false, "You must be logged in to create a topic.");

  if (!name.trim()) return actionResponse("Bad Request", 400, false, "Topic name is required");

  try {
    const topic = await TopicModel.create({ userId, name: name.trim() });
    revalidatePath("/dashboard");
    return actionResponse(
      "Topic created successfully",
      201,
      true,
      undefined,
      serializeTopic(topic.toObject() as RawTopicDoc)
    );
  } catch (error) {
    console.error("Failed to create topic:", error);
    return actionResponse("Failed to create topic", 500, false, "An unexpected error occurred.");
  }
}

export async function renameTopic(id: string, name: string): Promise<ActionResponse<void>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to rename this topic."
    );

  if (!name.trim()) return actionResponse("Bad Request", 400, false, "Topic name is required");

  try {
    const topic = await TopicModel.findOneAndUpdate({ _id: id, userId }, { name: name.trim() });
    if (!topic) return actionResponse("Not Found", 404, false, "Topic not found.");

    revalidatePath("/dashboard");
    return actionResponse("Topic renamed successfully", 200, true);
  } catch (error) {
    console.error("Failed to rename topic:", error);
    return actionResponse("Failed to rename topic", 500, false, "An unexpected error occurred.");
  }
}

export async function deleteTopic(id: string): Promise<ActionResponse<void>> {
  const userId = await requireAuthAndConnectDB();
  if (!userId)
    return actionResponse(
      "Unauthorized",
      401,
      false,
      "You must be logged in to delete this topic."
    );

  try {
    const topic = await TopicModel.findOneAndDelete({ _id: id, userId });
    if (!topic) return actionResponse("Not Found", 404, false, "Topic not found.");

    // Cascade delete all documents under this topic
    await DocumentModel.deleteMany({ topicId: id, userId });

    revalidatePath("/dashboard");
    return actionResponse("Topic deleted successfully", 200, true);
  } catch (error) {
    console.error("Failed to delete topic:", error);
    return actionResponse("Failed to delete topic", 500, false, "An unexpected error occurred.");
  }
}
