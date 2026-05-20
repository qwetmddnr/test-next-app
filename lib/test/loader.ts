import type { TestDefinition, TestResult } from "@/lib/types/test";
import animalFace from "@/data/tests/animal-face.json";
import pastLifeJob from "@/data/tests/past-life-job.json";
import loveStyle from "@/data/tests/love-style.json";
import mbti from "@/data/tests/mbti";
import tarot from "@/data/tests/tarot";
import newYear from "@/data/tests/new-year";

const TESTS: Record<string, TestDefinition> = {
  "animal-face": animalFace as unknown as TestDefinition,
  "past-life-job": pastLifeJob as unknown as TestDefinition,
  "love-style": loveStyle as unknown as TestDefinition,
  mbti,
  tarot,
  "new-year": newYear,
};

export function getTest(slug: string): TestDefinition | null {
  return TESTS[slug] ?? null;
}

export function getAllTestSlugs(): string[] {
  return Object.keys(TESTS);
}

export function getAllTests(): TestDefinition[] {
  return Object.values(TESTS);
}

export function getOtherTests(excludeSlug: string): TestDefinition[] {
  return getAllTests().filter((t) => t.slug !== excludeSlug);
}

export function getResult(
  testSlug: string,
  resultId: string
): { test: TestDefinition; result: TestResult } | null {
  const test = getTest(testSlug);
  if (!test) return null;
  const result = test.results.find((r) => r.id === resultId);
  if (!result) return null;
  return { test, result };
}

export function getAllResultParams(): { type: string; id: string }[] {
  const params: { type: string; id: string }[] = [];
  for (const [slug, test] of Object.entries(TESTS)) {
    for (const result of test.results) {
      params.push({ type: slug, id: result.id });
    }
  }
  return params;
}
