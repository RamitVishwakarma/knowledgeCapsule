import { YoutubeTranscript } from "youtube-transcript";

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function fetchYouTubeTranscript(
  videoUrl: string
): Promise<{ text: string } | null> {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) return null;

  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    const text = segments.map((s) => s.text).join(" ").replace(/\s+/g, " ").trim();
    if (!text) return null;
    return { text };
  } catch {
    return null;
  }
}
