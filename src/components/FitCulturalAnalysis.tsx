import { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface FitCulturalAnalysisProps {
  customAnswers: Record<string, string> | null;
  jobRequirements?: {
    level?: string;
    area?: string;
  };
}

interface CategoryScore {
  category: string;
  score: number;
  fullMark: 100;
}

// Mapping de respostas para pontuações (0-100)
const scoreMapping: Record<string, number> = {
  // Níveis genéricos
  "Nenhum": 0,
  "Básico": 25,
  "Intermediário": 50,
  "Avançado": 75,
  "Avançado / Fluente": 100,
  
  // Experiência específica
  "Nenhuma": 0,
  "Básica": 25,
  "Intermediária": 50,
  "Avançada": 75,
  
  // Qualidade comportamental
  "Boa": 50,
  "Muito boa": 75,
  "Excelente": 100,
  
  // Liderança
  "Não": 0,
  "Sim, equipes pequenas": 33,
  "Sim, equipes médias": 66,
  "Sim, equipes grandes": 100,
  
  // Tomada de decisão
  "Operacional": 33,
  "Tática": 66,
  "Estratégica": 100,
  
  // Tempo de experiência
  "Sem experiência": 0,
  "Até 1 ano": 25,
  "1 a 3 anos": 50,
  "3 a 5 anos": 75,
  "Mais de 5 anos": 100,
  
  // Disponibilidade
  "Imediata": 100,
  "Até 15 dias": 75,
  "Até 30 dias": 50,
  "Acima de 30 dias": 25,
  
  // Aderência
  "Baixo": 25,
  "Médio": 50,
  "Alto": 75,
  "Muito alto": 100,
  
  // Excel específico
  "Básico (fórmulas simples)": 25,
  "Intermediário (PROCV/XLOOKUP, tabelas dinâmicas)": 50,
  "Avançado (Power BI, VBA, Power Query)": 100,
  
  // Cultura - Estilo de trabalho
  "Trabalho individual com autonomia": 75,
  "Trabalho em equipe com colaboração constante": 75,
  "Misto - autonomia com pontos de colaboração": 100,
  "Liderança de projetos/equipes": 100,
  
  // Cultura - Ambiente
  "Ambiente estruturado com processos definidos": 75,
  "Ambiente dinâmico com mudanças frequentes": 75,
  "Startup/ambiente inovador com riscos": 75,
  "Ambiente tradicional e estável": 75,
  
  // Cultura - Motivação
  "Crescimento de carreira e promoções": 75,
  "Remuneração e benefícios": 75,
  "Aprendizado e novos desafios": 100,
  "Propósito e impacto social": 100,
  "Equilíbrio vida pessoal/profissional": 75,
  
  // Cultura - Pressão
  "Muito bem - me motiva a produzir mais": 100,
  "Bem - consigo me organizar e entregar": 75,
  "Razoavelmente - preciso de suporte": 50,
  "Com dificuldade - prefiro prazos confortáveis": 25,
  
  // Cultura - Feedback
  "Direto e objetivo, mesmo se for crítico": 100,
  "Construtivo e com sugestões de melhoria": 100,
  "Em conversas periódicas (1:1)": 75,
  "Por escrito para refletir depois": 75,
  
  // Cultura - Conflitos
  "Diálogo direto com a pessoa envolvida": 100,
  "Mediação com gestor ou RH": 75,
  "Evito conflitos e busco consenso": 50,
  "Análise racional focada na solução": 100,
  
  // Cultura - Mudanças
  "Me adapto rapidamente sem problemas": 100,
  "Preciso de um tempo para ajustar": 75,
  "Prefiro mudanças planejadas": 50,
  "Tenho dificuldade com mudanças": 25,
  
  // Cultura - Ética
  "Reporta imediatamente à liderança": 100,
  "Busca orientação antes de agir": 100,
  "Tenta resolver discretamente": 50,
  "Avalia as consequências antes de decidir": 75,
};

// Categorias e suas questões relacionadas
const categoryQuestions: Record<string, string[]> = {
  "Técnico": ["pacote_office", "nivel_excel", "analise_dados", "conhecimento_ti", "experiencia_erp", "automacao_bi"],
  "Experiência": ["tempo_experiencia", "experiencia_area"],
  "Liderança": ["lideranca_equipes", "tomada_decisao", "planejamento_estrategico", "gestao_orcamento"],
  "Comportamental": ["trabalho_equipe", "lideranca_influencia", "organizacao_tempo", "comunicacao"],
  "Financeiro": ["financas_corporativas", "contabilidade", "orcamento_fluxo"],
  "Idiomas": ["ingles", "outros_idiomas"],
  "Cultura": ["estilo_trabalho", "ambiente_preferido", "motivacao_principal", "pressao_prazos", "feedback_preferencia", "conflitos", "mudancas", "etica_dilema"],
};

const getScore = (answer: string): number => {
  // Tenta encontrar a pontuação exata primeiro
  if (scoreMapping[answer] !== undefined) {
    return scoreMapping[answer];
  }
  
  // Fallback para matching parcial
  const lowerAnswer = answer.toLowerCase();
  if (lowerAnswer.includes("avançad") || lowerAnswer.includes("fluente")) return 100;
  if (lowerAnswer.includes("intermediári")) return 50;
  if (lowerAnswer.includes("básic")) return 25;
  if (lowerAnswer.includes("nenhum") || lowerAnswer.includes("não")) return 0;
  
  return 50; // Default médio
};

export const FitCulturalAnalysis = ({ customAnswers }: FitCulturalAnalysisProps) => {
  const { radarData, barData, overallScore, recommendation } = useMemo(() => {
    if (!customAnswers || Object.keys(customAnswers).length === 0) {
      return {
        radarData: [],
        barData: [],
        overallScore: 0,
        recommendation: "Dados insuficientes para análise",
      };
    }

    const categoryScores: CategoryScore[] = [];

    Object.entries(categoryQuestions).forEach(([category, questionIds]) => {
      const answeredQuestions = questionIds.filter(qId => customAnswers[qId]);
      if (answeredQuestions.length === 0) return;

      const totalScore = answeredQuestions.reduce((sum, qId) => {
        const answer = customAnswers[qId];
        return sum + getScore(answer);
      }, 0);

      const avgScore = Math.round(totalScore / answeredQuestions.length);
      categoryScores.push({
        category,
        score: avgScore,
        fullMark: 100,
      });
    });

    const overall = categoryScores.length > 0
      ? Math.round(categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categoryScores.length)
      : 0;

    let rec = "";
    if (overall >= 80) {
      rec = "Candidato altamente qualificado. Recomendado para entrevista imediata.";
    } else if (overall >= 60) {
      rec = "Candidato com bom potencial. Recomendado para próxima fase.";
    } else if (overall >= 40) {
      rec = "Candidato com perfil parcialmente aderente. Avaliar pontos específicos.";
    } else {
      rec = "Candidato com baixa aderência ao perfil da vaga.";
    }

    return {
      radarData: categoryScores,
      barData: categoryScores.map(cat => ({
        ...cat,
        fill: cat.score >= 70 ? "hsl(var(--accent))" : cat.score >= 40 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
      })),
      overallScore: overall,
      recommendation: rec,
    };
  }, [customAnswers]);

  if (radarData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Dados insuficientes para análise de fit cultural.</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-300";
    if (score >= 60) return "bg-blue-100 border-blue-300";
    if (score >= 40) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg text-foreground">Análise de Fit Cultural</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">Perfil do Candidato</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--accent))"
                fill="hsl(var(--accent))"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">Compatibilidade por Área</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis 
                type="category" 
                dataKey="category" 
                tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                width={100}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, "Score"]}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(overallScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Score Geral</p>
            <p className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </p>
          </div>
          <div className="text-right flex-1 ml-6">
            <p className="text-sm font-medium text-foreground">{recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitCulturalAnalysis;
