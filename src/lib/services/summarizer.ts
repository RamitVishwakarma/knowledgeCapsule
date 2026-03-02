import Groq from "groq-sdk";

// ~4 chars per token; leave headroom for the prompt and response
const MAX_TRANSCRIPT_CHARS = 24_000;

export async function generateSummary(
  transcript: string,
  title: string
): Promise<string> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const truncated =
    transcript.length > MAX_TRANSCRIPT_CHARS
      ? transcript.slice(0, MAX_TRANSCRIPT_CHARS) + "\n\n[transcript truncated]"
      : transcript;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are helping someone build a personal knowledge vault. They record themselves explaining topics they have learned. Your job is to generate a clear, structured summary from their spoken explanation.

Write the summary as if addressing the person who recorded it ("you noticed", "you explained", "your key insight"). Focus on:
- The core concepts they explained
- Key insights and mental models they shared
- Important examples or analogies they used
- Any timestamps or specific moments they mentioned

Format the summary with clear markdown sections (##, ###, bold key terms, bullet lists). Keep it concise and scannable — the person will use this as a future reference card.`,
      },
      {
        role: "user",
        content: `Recording title: "${title}"\n\nTranscript:\n${truncated}\n\nGenerate a structured summary.`,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.3,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content ?? "";
}
