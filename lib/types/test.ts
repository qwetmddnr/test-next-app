export interface TestOption {
  id: string;
  text: string;
  scores: Record<string, number>;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: TestOption[];
}

export interface TestResult {
  id: string;
  title: string;
  emoji: string;
  shortDesc: string;
  description: string;
  traits: string[];
  matches: string[];
  avoid: string[];
  image?: string;
  imageCredit?: string;
}

export interface TestDefinition {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  estimatedMinutes: number;
  questions: TestQuestion[];
  results: TestResult[];
}

export type TestAnswers = Record<string, string>;
