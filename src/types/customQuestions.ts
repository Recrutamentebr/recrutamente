// Types for custom questions with scoring

export interface ScoredOption {
  text: string;
  score: number; // 1 = Ruim, 2 = Regular, 3 = Bom, 4 = Excelente
}

export interface ScoredQuestion {
  id: string;
  question: string;
  options: ScoredOption[];
}

export interface ScoredAnswer {
  questionId: string;
  question: string;
  selectedOption: string;
  score: number;
}

export const scoreLabels: Record<number, { label: string; color: string; bgColor: string }> = {
  1: { label: "Ruim", color: "#DC2626", bgColor: "#FEE2E2" },
  2: { label: "Regular", color: "#D97706", bgColor: "#FEF3C7" },
  3: { label: "Bom", color: "#2563EB", bgColor: "#DBEAFE" },
  4: { label: "Excelente", color: "#16A34A", bgColor: "#D1FAE5" },
};

export const getScoreLabel = (score: number) => {
  return scoreLabels[score] || scoreLabels[1];
};
