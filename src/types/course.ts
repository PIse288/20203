export type Question = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type CodeExercise = {
  id: string;
  title: string;
  prompt: string;
  hint?: string;
  starterCode: string;
  solutionCode: string;
  expectedOutputHints?: string[];
  expectedShape?: { rows?: number; cols?: number };
};

export type Lesson = {
  id: string;
  index: number;
  title: string;
  intro: string;
  keyPoints: string[];
  commonMistakes: string[];
  demoCode: string;
  blankCode: string;
  answerCode: string;
  questions: Question[];
  exercises: CodeExercise[];
};

export type Course = {
  id: string;
  index: number;
  title: string;
  summary: string;
  lessons: Lesson[];
};
