import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";

/**
 * Ensures the user is authenticated and the database is connected.
 * Returns the userId if successful, or null if unauthorized.
 */
export async function requireAuthAndDB(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  await connectDB();
  return session.user.id;
}
