import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getYouTubeToken } from "@/lib/utils/get-youtube-token";
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let accessToken: string;
  try {
    accessToken = await getYouTubeToken(session.user.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get YouTube token";
    return NextResponse.json({ error: message }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const title = (formData.get("title") as string) || "Untitled Video";

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No video file provided" }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = Readable.from(buffer);

  try {
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description: "Uploaded via Knowledge Capsule",
        },
        status: {
          privacyStatus: "unlisted",
        },
      },
      media: {
        mimeType: file.type || "video/*",
        body: stream,
      },
    });

    const videoId = response.data.id;
    if (!videoId) {
      return NextResponse.json({ error: "YouTube did not return a video ID" }, { status: 500 });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    return NextResponse.json({ videoId, videoUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "YouTube upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
