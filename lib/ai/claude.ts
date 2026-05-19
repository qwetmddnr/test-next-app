import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface GenerateOptions {
  testType: string;
  prompt: string;
  useCache?: boolean;
  maxTokens?: number;
}

export async function generateAIResult({
  testType,
  prompt,
  useCache = true,
  maxTokens = 2000,
}: GenerateOptions): Promise<string> {
  const inputHash = crypto
    .createHash("sha256")
    .update(`${testType}:${prompt}`)
    .digest("hex");

  if (useCache) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("ai_cache")
      .select("output")
      .eq("input_hash", inputHash)
      .single();

    if (data) {
      console.log("[AI] Cache hit:", testType);
      return data.output;
    }
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  const output = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("\n");

  if (useCache) {
    const supabase = await createClient();
    await supabase.from("ai_cache").insert({
      input_hash: inputHash,
      test_type: testType,
      output,
    });
  }

  return output;
}
