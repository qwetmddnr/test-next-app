import type { TestCategory, TestDefinition, TestResult } from "@/lib/types/test";
import animalFace from "@/data/tests/animal-face.json";
import pastLifeJob from "@/data/tests/past-life-job.json";
import loveStyle from "@/data/tests/love-style.json";
import mbti from "@/data/tests/mbti";
import tarot from "@/data/tests/tarot";
import newYear from "@/data/tests/new-year";
import saju from "@/data/tests/saju";
import dream from "@/data/tests/dream";
import zodiac from "@/data/tests/zodiac";

const TESTS: Record<string, TestDefinition> = {
  "animal-face": animalFace as unknown as TestDefinition,
  "past-life-job": pastLifeJob as unknown as TestDefinition,
  "love-style": loveStyle as unknown as TestDefinition,
  mbti,
  tarot,
  "new-year": newYear,
  saju,
  dream,
  zodiac,
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
  return getAllTests().filter(
    (t) => t.slug !== excludeSlug && !t.comingSoon
  );
}

export function getTestsByCategory(): Record<TestCategory, TestDefinition[]> {
  const all = getAllTests();
  return {
    fortune: all.filter((t) => t.category === "fortune"),
    fun: all.filter((t) => t.category === "fun"),
  };
}

export function getEntryPath(test: TestDefinition): string {
  return test.entryPath ?? `/tests/${test.slug}`;
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
