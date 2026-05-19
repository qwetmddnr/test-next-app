import type { TestAnswers, TestDefinition, TestResult } from "@/lib/types/test";

export function calculateResult(
  test: TestDefinition,
  answers: TestAnswers
): TestResult {
  const scores: Record<string, number> = {};

  for (const question of test.questions) {
    const answerId = answers[question.id];
    if (!answerId) continue;

    const option = question.options.find((o) => o.id === answerId);
    if (!option) continue;

    for (const [resultId, score] of Object.entries(option.scores)) {
      scores[resultId] = (scores[resultId] ?? 0) + score;
    }
  }

  let topId: string | null = null;
  let topScore = -Infinity;

  for (const result of test.results) {
    const score = scores[result.id] ?? 0;
    if (score > topScore) {
      topScore = score;
      topId = result.id;
    }
  }

  const winner = test.results.find((r) => r.id === topId);
  if (!winner) {
    throw new Error("결과를 계산할 수 없습니다. 응답이 비어 있는지 확인해주세요.");
  }

  return winner;
}

export function isTestComplete(
  test: TestDefinition,
  answers: TestAnswers
): boolean {
  return test.questions.every((q) => Boolean(answers[q.id]));
}

export function getProgress(
  test: TestDefinition,
  answers: TestAnswers
): { current: number; total: number; percent: number } {
  const total = test.questions.length;
  const current = test.questions.filter((q) => answers[q.id]).length;
  return {
    current,
    total,
    percent: total === 0 ? 0 : Math.round((current / total) * 100),
  };
}
