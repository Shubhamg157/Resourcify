// ═══════════════════════════════════════════════════════════
// GapZero — Shared TypeScript Types
// ═══════════════════════════════════════════════════════════

// ─── Question Types ───
export type QuestionType = 'fundamental' | 'formula' | 'application' | 'misconception' | 'jee_style';

// ─── Resource Types ───
export type ResourceType =
  | 'VIDEO'
  | 'SHORT_VIDEO'
  | 'ONE_SHOT'
  | 'NOTES'
  | 'FORMULA_SHEET'
  | 'ARTICLE'
  | 'PYQ'
  | 'QUESTION_BANK'
  | 'WORKED_EXAMPLE'
  | 'PRACTICE_SET'
  | 'NCERT'
  | 'MOCK_TEST'
  | 'DOUBT_RESOURCE';

// ─── Exam Target ───
export type ExamTarget = 'JEE Main' | 'JEE Advanced' | 'Both';

// ─── AI Structured Output Types ───

export interface AnswerEvaluation {
  questionId: string;
  isCorrect: boolean;
  detectedMisconception: string;
  conceptStrength: 'strong' | 'moderate' | 'weak';
  reasoning: string;
}

export interface DiagnosticResult {
  overall_score: number;
  confidence: number;
  mastered_concepts: string[];
  weak_concepts: string[];
  root_prerequisite: string[];
  error_types: string[];
  recommended_intervention: string[];
}

export interface FormulaCard {
  title: string;
  formulas: {
    expression: string;
    description: string;
    conditions?: string;
    commonMistake?: string;
  }[];
  tips: string[];
}

export interface ChatResponse {
  mode: 'academic' | 'navigation';
  content: string;
  suggestedResources?: string[];
  followUp?: string;
}

// ─── UI State Types ───

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  startedAt: number;
  isSubmitting: boolean;
}

// ─── Concept Tree Types (for Topic Selector) ───

export interface ConceptTreeNode {
  id: string;
  name: string;
  children?: ConceptTreeNode[];
  conceptCount?: number;
  masteryPercent?: number;
}

// Demo user ID constant
export const DEMO_USER_ID = 'demo-user-001';
