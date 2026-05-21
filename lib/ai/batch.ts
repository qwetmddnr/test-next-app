import Anthropic from "@anthropic-ai/sdk";
import { INSIGHT_MODEL } from "@/lib/ai/insight";

export interface BatchRequestItem {
  customId: string;
  prompt: string;
}

export async function createInsightBatch(items: BatchRequestItem[]) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const batch = await client.messages.batches.create({
    requests: items.map((item) => ({
      custom_id: item.customId,
      params: {
        model: INSIGHT_MODEL,
        max_tokens: 800,
        messages: [{ role: "user", content: item.prompt }],
      },
    })),
  });
  return batch;
}

export async function retrieveBatch(batchId: string) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  return await client.messages.batches.retrieve(batchId);
}

export interface BatchResultItem {
  customId: string;
  ok: boolean;
  output?: string;
  error?: string;
}

export async function collectBatchResults(
  batchId: string
): Promise<BatchResultItem[]> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const out: BatchResultItem[] = [];

  for await (const item of await client.messages.batches.results(batchId)) {
    const customId = item.custom_id;
    if (item.result.type === "succeeded") {
      const text = item.result.message.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { type: "text"; text: string }).text)
        .join("\n")
        .trim();
      out.push({ customId, ok: Boolean(text), output: text });
    } else {
      out.push({
        customId,
        ok: false,
        error:
          item.result.type === "errored"
            ? item.result.error.error.message
            : item.result.type,
      });
    }
  }

  return out;
}
