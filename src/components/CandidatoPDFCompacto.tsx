import { forwardRef } from "react";
import { ScoredQuestion, scoreLabels } from "@/types/customQuestions";
import logoRecrutamente from "@/assets/logo-recrutamente.png";

interface CustomQuestionsData {
  predefinedQuestions?: string[];
  scoredQuestions?: ScoredQuestion[];
}

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  education_level: string;
  experience: string;
  salary_expectation: string | null;
  availability: string | null;
  expectations: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  additional_info: string | null;
  resume_url: string | null;
  status: string;
  created_at: string;
  custom_answers?: Record<string, string> | null;
}

interface Job {
  id: string;
  title: string;
  area: string;
  city: string;
  state: string;
  level: string;
  custom_questions?: CustomQuestionsData | string[] | null;
}

interface CandidatoPDFCompactoProps {
  applications: Application[];
  getJobForApplication: (app: Application) => Job | undefined;
}

const statusLabelsMap: Record<string, string> = {
  pending: "Pendente",
  reviewing: "Em Análise",
  approved: "Aprovado",
  rejected: "Rejeitado",
  hired: "Contratado",
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#FEF3C7", text: "#92400E" },
  reviewing: { bg: "#DBEAFE", text: "#1E40AF" },
  approved: { bg: "#D1FAE5", text: "#065F46" },
  rejected: { bg: "#FEE2E2", text: "#991B1B" },
  hired: { bg: "#E9D5FF", text: "#6B21A8" },
};

const getScoreColor = (score: number) => {
  switch (score) {
    case 1: return { bg: '#FEE2E2', text: '#DC2626' };
    case 2: return { bg: '#FEF3C7', text: '#D97706' };
    case 3: return { bg: '#DBEAFE', text: '#2563EB' };
    case 4: return { bg: '#D1FAE5', text: '#059669' };
    default: return { bg: '#F3F4F6', text: '#6B7280' };
  }
};

// Component for a single compact candidate card (half page)
const CandidateCard = ({ application, job }: { application: Application; job?: Job }) => {
  const statusStyle = statusColors[application.status] || statusColors.pending;

  // Get scored questions analysis
  const getScoredQuestions = (): ScoredQuestion[] => {
    if (!job?.custom_questions) return [];
    if (Array.isArray(job.custom_questions)) return [];
    return job.custom_questions.scoredQuestions || [];
  };

  const getAnswerAnalysis = () => {
    const scoredQuestions = getScoredQuestions();
    const customAnswers = application.custom_answers || {};
    
    const analysis: Array<{
      question: string;
      answer: string;
      score: number;
      label: string;
    }> = [];

    for (const question of scoredQuestions) {
      const answerKey = `scored_${question.id}`;
      const answerValue = customAnswers[answerKey];
      
      if (answerValue) {
        const parts = answerValue.split('|');
        const answerText = parts[0] || answerValue;
        const score = parseInt(parts[1]) || 0;
        
        analysis.push({
          question: question.question,
          answer: answerText,
          score: score,
          label: scoreLabels[score]?.label || 'N/A'
        });
      }
    }

    return analysis;
  };

  const answerAnalysis = getAnswerAnalysis();
  const totalScore = answerAnalysis.reduce((sum, a) => sum + a.score, 0);
  const maxTotalScore = answerAnalysis.length * 4;
  const scorePercentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "516px", // (1123 - 50 header - 40 footer) / 2 = ~516px per candidate
        padding: "16px 28px",
        boxSizing: "border-box",
        borderBottom: "1px dashed #D1D5DB",
        position: "relative",
      }}
    >
      {/* Header with Name and Status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "700",
                color: "#FFFFFF",
                flexShrink: 0,
              }}
            >
              {application.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1F2937",
                  margin: 0,
                }}
              >
                {application.full_name}
              </h2>
              <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0 0" }}>
                {application.email} • {application.phone}
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "6px 14px",
            backgroundColor: statusStyle.bg,
            borderRadius: "16px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: statusStyle.text,
            }}
          >
            {statusLabelsMap[application.status] || application.status}
          </span>
        </div>
      </div>

      {/* Job Info */}
      {job && (
        <div
          style={{
            padding: "6px 12px",
            backgroundColor: "#ECFDF5",
            borderRadius: "6px",
            marginBottom: "10px",
            display: "inline-block",
          }}
        >
          <span style={{ fontSize: "10px", color: "#047857", fontWeight: "600" }}>
            💼 {job.title} • {job.area} • {job.level}
          </span>
        </div>
      )}

      {/* Info Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        <div style={{ padding: "6px", backgroundColor: "#F8FAFC", borderRadius: "4px", textAlign: "center" }}>
          <p style={{ fontSize: "8px", color: "#64748B", margin: 0, textTransform: "uppercase", fontWeight: "600" }}>Localização</p>
          <p style={{ fontSize: "10px", fontWeight: "600", color: "#1E293B", margin: "2px 0 0 0" }}>{application.city}, {application.state}</p>
        </div>
        <div style={{ padding: "6px", backgroundColor: "#F8FAFC", borderRadius: "4px", textAlign: "center" }}>
          <p style={{ fontSize: "8px", color: "#64748B", margin: 0, textTransform: "uppercase", fontWeight: "600" }}>Escolaridade</p>
          <p style={{ fontSize: "10px", fontWeight: "600", color: "#1E293B", margin: "2px 0 0 0" }}>{application.education_level}</p>
        </div>
        {application.salary_expectation && (
          <div style={{ padding: "6px", backgroundColor: "#F8FAFC", borderRadius: "4px", textAlign: "center" }}>
            <p style={{ fontSize: "8px", color: "#64748B", margin: 0, textTransform: "uppercase", fontWeight: "600" }}>Pretensão</p>
            <p style={{ fontSize: "10px", fontWeight: "600", color: "#1E293B", margin: "2px 0 0 0" }}>{application.salary_expectation}</p>
          </div>
        )}
        {application.availability && (
          <div style={{ padding: "6px", backgroundColor: "#F8FAFC", borderRadius: "4px", textAlign: "center" }}>
            <p style={{ fontSize: "8px", color: "#64748B", margin: 0, textTransform: "uppercase", fontWeight: "600" }}>Disponibilidade</p>
            <p style={{ fontSize: "10px", fontWeight: "600", color: "#1E293B", margin: "2px 0 0 0" }}>{application.availability}</p>
          </div>
        )}
      </div>

      {/* Experience */}
      <div style={{ marginBottom: "10px" }}>
        <p style={{ fontSize: "9px", color: "#64748B", margin: "0 0 3px 0", fontWeight: "600", textTransform: "uppercase" }}>Experiência</p>
        <p style={{ fontSize: "10px", color: "#374151", margin: 0, lineHeight: "1.4" }}>
          {application.experience.length > 180 ? application.experience.substring(0, 180) + "..." : application.experience}
        </p>
      </div>

      {/* Scored Questions Analysis */}
      {answerAnalysis.length > 0 && (
        <div>
          <p style={{ fontSize: "9px", color: "#1E3A8A", margin: "0 0 6px 0", fontWeight: "700", textTransform: "uppercase" }}>
            📊 Avaliação das Respostas
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
            {answerAnalysis.slice(0, 6).map((item, index) => {
              const color = getScoreColor(item.score);
              return (
                <div
                  key={index}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: color.bg,
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontSize: "9px", color: color.text, fontWeight: "600" }}>
                    {item.label} ({Math.round((item.score / 4) * 100)}%)
                  </span>
                </div>
              );
            })}
          </div>
          {/* Total Score */}
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
              borderRadius: "6px",
            }}
          >
            <span style={{ fontSize: "10px", color: "#FFFFFF", fontWeight: "700" }}>
              📈 Aderência: {scorePercentage}%
            </span>
          </div>
        </div>
      )}

      {/* Candidatura date */}
      <p
        style={{
          position: "absolute",
          bottom: "8px",
          right: "28px",
          fontSize: "9px",
          color: "#9CA3AF",
          margin: 0,
        }}
      >
        Candidatura: {new Date(application.created_at).toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
};

export const CandidatoPDFCompacto = forwardRef<HTMLDivElement, CandidatoPDFCompactoProps>(
  ({ applications, getJobForApplication }, ref) => {
    // Group applications in pairs for 2 per page
    const pages: Application[][] = [];
    for (let i = 0; i < applications.length; i += 2) {
      pages.push(applications.slice(i, i + 2));
    }


    return (
      <div
        ref={ref}
        style={{
          width: "794px",
          backgroundColor: "#FFFFFF",
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          color: "#1F2937",
        }}
      >
        {pages.map((pageApps, pageIndex) => (
          <div
            key={pageIndex}
            style={{
              width: "794px",
              height: "1123px", // A4 height
              position: "relative",
              pageBreakAfter: pageIndex < pages.length - 1 ? "always" : "auto",
              overflow: "hidden",
            }}
          >
            {/* Logo */}
            <div style={{ padding: "12px 28px" }}>
              <img
                src={logoRecrutamente}
                alt="RecrutaMente"
                style={{ height: "32px", objectFit: "contain" }}
                crossOrigin="anonymous"
              />
            </div>

            {/* Candidates Container */}
            <div style={{ height: "1039px" }}> {/* 1123 - 48 logo - 36 footer = 1039 */}
              {pageApps.map((app) => (
                <CandidateCard
                  key={app.id}
                  application={app}
                  job={getJobForApplication(app)}
                />
              ))}

              {/* If only 1 candidate on page, add empty space */}
              {pageApps.length === 1 && (
                <div style={{ height: "516px", backgroundColor: "#FAFAFA" }}>
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#D1D5DB",
                      fontSize: "12px",
                    }}
                  >
                    — Fim do relatório —
                  </div>
                </div>
              )}
            </div>

            {/* Page Footer */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "8px 28px",
                backgroundColor: "#F8FAFC",
                borderTop: "1px solid #E5E7EB",
                textAlign: "center",
                height: "36px",
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: "9px", color: "#9CA3AF" }}>
                Documento Confidencial • Uso Exclusivo para Processo Seletivo • www.recrutamente.site
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

CandidatoPDFCompacto.displayName = "CandidatoPDFCompacto";

export default CandidatoPDFCompacto;
