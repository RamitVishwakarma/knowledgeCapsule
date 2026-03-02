import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { Topic } from "@/lib/models/Topic";
import { Document } from "@/lib/models/Document";
import { Dashboard } from "@/components/dashboard";
import { serializeTopic, type RawTopicDoc, type DocCountResult } from "@/utils/helpers/serialize";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  await connectDB();
  const userId = session.user.id;

  const [rawTopics, docCounts, archivedCount] = await Promise.all([
    Topic.find({ userId }).sort({ createdAt: 1 }).lean<RawTopicDoc[]>(),
    Document.aggregate<DocCountResult>([
      { $match: { userId: session.user.id, archived: false } },
      { $group: { _id: "$topicId", count: { $sum: 1 } } },
    ]),
    Document.countDocuments({ userId: session.user.id, archived: true }),
  ]);

  const countMap = new Map(docCounts.map((c) => [c._id.toString(), c.count]));
  const topics = rawTopics.map((raw) =>
    serializeTopic(raw, countMap.get(raw._id.toString()) ?? 0)
  );

  return <Dashboard initialTopics={topics} initialArchivedCount={archivedCount} />;
}
