import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScoredQuestion, ScoredOption, scoreLabels } from "@/types/customQuestions";

interface CustomQuestionBuilderProps {
  questions: ScoredQuestion[];
  onChange: (questions: ScoredQuestion[]) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

const defaultOptions: ScoredOption[] = [
  { text: "", score: 1 },
  { text: "", score: 2 },
  { text: "", score: 3 },
  { text: "", score: 4 },
];

export const CustomQuestionBuilder = ({ questions, onChange }: CustomQuestionBuilderProps) => {
  const addQuestion = () => {
    const newQuestion: ScoredQuestion = {
      id: generateId(),
      question: "",
      options: defaultOptions.map(opt => ({ ...opt })),
    };
    onChange([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    onChange(questions.filter(q => q.id !== questionId));
  };

  const updateQuestionText = (questionId: string, text: string) => {
    onChange(
      questions.map(q => 
        q.id === questionId ? { ...q, question: text } : q
      )
    );
  };

  const updateOptionText = (questionId: string, score: number, text: string) => {
    onChange(
      questions.map(q => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: q.options.map(opt => 
            opt.score === score ? { ...opt, text } : opt
          ),
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-foreground">Perguntas com Classificação</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Crie perguntas personalizadas com 4 respostas. Cada resposta tem um nível de classificação oculto para o candidato.
          </p>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="border border-border rounded-xl p-5 bg-secondary/30"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Pergunta #{index + 1}
                  </Label>
                  <Input
                    value={q.question}
                    onChange={(e) => updateQuestionText(q.id, e.target.value)}
                    placeholder="Digite a pergunta (ex: Qual seu nível de experiência com Excel?)"
                    className="bg-background"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeQuestion(q.id)}
                  className="shrink-0 mt-6"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">
                  Respostas (ordenadas da pior para a melhor):
                </Label>
                {q.options.map((option) => {
                  const scoreInfo = scoreLabels[option.score];
                  return (
                    <div
                      key={option.score}
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-2 shrink-0 w-28">
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded"
                          style={{ backgroundColor: scoreInfo.bgColor, color: scoreInfo.color }}
                        >
                          {option.score}. {scoreInfo.label}
                        </span>
                      </div>
                      <Input
                        value={option.text}
                        onChange={(e) => updateOptionText(q.id, option.score, e.target.value)}
                        placeholder={`Resposta para "${scoreInfo.label}" (${option.score} ponto${option.score > 1 ? 's' : ''})`}
                        className="flex-1"
                      />
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground mt-4 bg-amber-50 text-amber-700 p-3 rounded-lg border border-amber-200">
                ⚠️ O candidato verá apenas as respostas, não os níveis de classificação. A pontuação aparece apenas no PDF.
              </p>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={addQuestion}
        className="w-full border-dashed"
      >
        <Plus size={18} className="mr-2" />
        Adicionar Pergunta Personalizada
      </Button>

      {questions.length > 0 && (
        <div className="p-4 bg-accent/10 rounded-xl">
          <p className="text-sm font-medium text-foreground">
            {questions.length} pergunta{questions.length !== 1 ? 's' : ''} personalizada{questions.length !== 1 ? 's' : ''} criada{questions.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pontuação máxima possível: {questions.length * 4} pontos
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomQuestionBuilder;
