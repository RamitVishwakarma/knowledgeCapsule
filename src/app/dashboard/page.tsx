import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { Topic } from "@/lib/models/Topic";
import { Document } from "@/lib/models/Document";
import { Dashboard } from "@/components/dashboard";
import type { Topic as TopicType } from "@/lib/types";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  await connectDB();
  const userId = session.user.id;

  const [rawTopics, docCounts, archivedCount] = await Promise.all([
    Topic.find({ userId }).sort({ createdAt: 1 }).lean(),
    Document.aggregate([
      { $match: { userId: session.user.id, archived: false } },
      { $group: { _id: "$topicId", count: { $sum: 1 } } },
    ]),
    Document.countDocuments({ userId: session.user.id, archived: true }),
  ]);

  const countMap = new Map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (docCounts as any[]).map((c) => [c._id.toString(), c.count as number])
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topics: TopicType[] = (rawTopics as any[]).map((raw: any) => {
    return {
      id: raw._id.toString(),
      userId: raw.userId.toString(),
      name: raw.name as string,
      documentCount: countMap.get(raw._id.toString()) ?? 0,
      createdAt: (raw.createdAt as Date).toISOString(),
      updatedAt: (raw.updatedAt as Date).toISOString(),
    };
  });

  return <Dashboard initialTopics={topics} initialArchivedCount={archivedCount} />;
}
