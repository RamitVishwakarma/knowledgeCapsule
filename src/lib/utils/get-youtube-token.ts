import clientPromise from "@/lib/db/mongodb";

interface TokenRefreshResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

async function refreshAccessToken(
  userId: string,
  refreshToken: string,
): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh YouTube access token");
  }

  const data: TokenRefreshResponse = await res.json();
  const newExpiresAt = Math.floor(Date.now() / 1000) + data.expires_in;

  const client = await clientPromise;
  const db = client.db("knowledge-capsule");
  await db
    .collection("accounts")
    .updateOne(
      { userId, provider: "google" },
      { $set: { access_token: data.access_token, expires_at: newExpiresAt } },
    );

  return data.access_token;
}

export async function getYouTubeToken(userId: string): Promise<string> {
  const client = await clientPromise;
  const db = client.db("knowledge-capsule");

  const account = await db
    .collection("accounts")
    .findOne({ userId, provider: "google" });

  if (!account) {
    throw new Error("No Google account linked. Please sign out and sign in again.");
  }

  if (!account.refresh_token) {
    throw new Error(
      "No refresh token found. Please sign out and sign in again to grant YouTube permissions.",
    );
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const isExpired = !account.expires_at || account.expires_at <= nowInSeconds + 60;

  if (isExpired) {
    return refreshAccessToken(userId, account.refresh_token as string);
  }

  return account.access_token as string;
}
