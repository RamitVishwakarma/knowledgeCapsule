import { YoutubeTranscript } from "youtube-transcript";
import { extractVideoId } from "@/utils/helpers/youtube";

export async function fetchYouTubeTranscript(videoUrl: string): Promise<{ text: string } | null> {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) return null;

  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    const text = segments
      .map((s) => s.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return null;
    return { text };
  } catch {
    return null;
  }
}
