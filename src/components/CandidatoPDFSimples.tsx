import { forwardRef } from "react";
import logoRecrutamente from "@/assets/logo-recrutamente.png";
import { ScoredQuestion, scoreLabels } from "@/types/customQuestions";

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

interface CandidatoPDFSimplesProps {
  application: Application;
  job: Job;
}

const statusLabels: Record<string, string> = {
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

export const CandidatoPDFSimples = forwardRef<HTMLDivElement, CandidatoPDFSimplesProps>(
  ({ application, job }, ref) => {
    const currentDate = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const statusStyle = statusColors[application.status] || statusColors.pending;

    // Get scored questions from job
    const getScoredQuestions = (): ScoredQuestion[] => {
      if (!job.custom_questions) return [];
      if (Array.isArray(job.custom_questions)) return [];
      return job.custom_questions.scoredQuestions || [];
    };

    // Parse candidate answers and calculate scores
    const getAnswerAnalysis = () => {
      const scoredQuestions = getScoredQuestions();
      const customAnswers = application.custom_answers || {};
      
      const analysis: Array<{
        question: string;
        answer: string;
        score: number;
        maxScore: number;
        label: string;
      }> = [];

      for (const question of scoredQuestions) {
        const answerKey = `scored_${question.id}`;
        const answerValue = customAnswers[answerKey];
        
        if (answerValue) {
          // Parse "text|score" format
          const parts = answerValue.split('|');
          const answerText = parts[0] || answerValue;
          const score = parseInt(parts[1]) || 0;
          
          analysis.push({
            question: question.question,
            answer: answerText,
            score: score,
            maxScore: 4,
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

    const getScoreColor = (score: number) => {
      switch (score) {
        case 1: return { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' };
        case 2: return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
        case 3: return { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' };
        case 4: return { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' };
        default: return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
      }
    };

    return (
      <div
        ref={ref}
        style={{
          width: "794px",
          minHeight: "1123px",
          backgroundColor: "#FFFFFF",
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          color: "#1F2937",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Top Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(90deg, #1E3A8A, #3B82F6, #60A5FA)",
          }}
        />
        
        {/* Decorative Background Circles */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "-100px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(30, 58, 138, 0.03))",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "-150px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(30, 58, 138, 0.02))",
          }}
        />

        {/* Content Container */}
        <div style={{ padding: "48px 56px", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div
            data-section="header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
              paddingBottom: "24px",
              borderBottom: "2px solid #E5E7EB",
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={logoRecrutamente}
                alt="RecrutaMente"
                style={{ height: "48px", objectFit: "contain" }}
                crossOrigin="anonymous"
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  margin: 0,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Relatório do Candidato
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  margin: "4px 0 0 0",
                }}
              >
                {currentDate}
              </p>
            </div>
          </div>

          {/* Candidate Name Section - Centered */}
          <div
            data-section="candidate-name"
            style={{
              textAlign: "center",
              marginBottom: "36px",
              padding: "36px 32px",
              background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
              borderRadius: "16px",
              boxShadow: "0 10px 40px -10px rgba(30, 58, 138, 0.4)",
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                fontSize: "28px",
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              {application.full_name.charAt(0).toUpperCase()}
            </div>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#FFFFFF",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              {application.full_name}
            </h2>
            <div
              style={{
                display: "inline-block",
                marginTop: "16px",
                padding: "8px 24px",
                backgroundColor: statusStyle.bg,
                borderRadius: "24px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: statusStyle.text,
                }}
              >
                {statusLabels[application.status] || application.status}
              </span>
            </div>
          </div>

          {/* Contact Information - Centered Grid */}
          <div
            data-section="contact-info"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
              marginBottom: "32px",
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "24px 16px",
                backgroundColor: "#F8FAFC",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
              }}
            >
              <p style={{ fontSize: "11px", color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                ✉️ E-mail
              </p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", margin: "8px 0 0 0", wordBreak: "break-all" }}>
                {application.email}
              </p>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "24px 16px",
                backgroundColor: "#F8FAFC",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
              }}
            >
              <p style={{ fontSize: "11px", color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                📱 Telefone
              </p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", margin: "8px 0 0 0" }}>
                {application.phone}
              </p>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "24px 16px",
                backgroundColor: "#F8FAFC",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
              }}
            >
              <p style={{ fontSize: "11px", color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                📍 Localização
              </p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", margin: "8px 0 0 0" }}>
                {application.city}, {application.state}
              </p>
            </div>
          </div>

          {/* Job Applied Section - Centered */}
          <div
            data-section="job-info"
            style={{
              textAlign: "center",
              marginBottom: "32px",
              padding: "28px",
              background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
              borderRadius: "12px",
              border: "1px solid #A7F3D0",
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }}
          >
            <p style={{ fontSize: "11px", color: "#047857", margin: 0, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700" }}>
              💼 Vaga Aplicada
            </p>
            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#065F46", margin: "12px 0 0 0" }}>
              {job.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#047857", margin: "12px 0 0 0", fontWeight: "500" }}>
              {job.area} • {job.level} • {job.city}, {job.state}
            </p>
          </div>

          {/* Professional Information - Centered Grid */}
          <div 
            data-section="professional-info"
            style={{ 
              marginBottom: "32px",
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }}
          >
            <h3
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#1E3A8A",
                margin: "0 0 20px 0",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                textAlign: "center",
              }}
            >
              📋 Informações Profissionais
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  backgroundColor: "#FEFCE8",
                  borderRadius: "12px",
                  border: "1px solid #FDE68A",
                }}
              >
                <p style={{ fontSize: "11px", color: "#A16207", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                  🎓 Escolaridade
                </p>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#78350F", margin: "10px 0 0 0" }}>
                  {application.education_level}
                </p>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  backgroundColor: "#F0F9FF",
                  borderRadius: "12px",
                  border: "1px solid #BAE6FD",
                }}
              >
                <p style={{ fontSize: "11px", color: "#0369A1", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                  💼 Experiência
                </p>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#0C4A6E", margin: "10px 0 0 0" }}>
                  {application.experience}
                </p>
              </div>
              {application.salary_expectation && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    backgroundColor: "#FDF4FF",
                    borderRadius: "12px",
                    border: "1px solid #F5D0FE",
                  }}
                >
                  <p style={{ fontSize: "11px", color: "#86198F", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                    💰 Pretensão Salarial
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#701A75", margin: "10px 0 0 0" }}>
                    {application.salary_expectation}
                  </p>
                </div>
              )}
              {application.availability && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    backgroundColor: "#F0FDF4",
                    borderRadius: "12px",
                    border: "1px solid #BBF7D0",
                  }}
                >
                  <p style={{ fontSize: "11px", color: "#15803D", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                    ⏰ Disponibilidade
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#14532D", margin: "10px 0 0 0" }}>
                    {application.availability}
                  </p>
                </div>
              )}
            </div>
          </div>


          {/* Additional Information - Centered */}
          {application.expectations && (
            <div 
              data-section="expectations"
              style={{ 
                marginBottom: "16px",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "28px",
                  backgroundColor: "#F8FAFC",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <p style={{ fontSize: "11px", color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700" }}>
                  🎯 Expectativas
                </p>
                <p style={{ fontSize: "14px", color: "#334155", margin: "14px 0 0 0", lineHeight: "1.7" }}>
                  {application.expectations}
                </p>
              </div>
            </div>
          )}
          {application.additional_info && (
            <div 
              data-section="additional-info"
              style={{ 
                marginBottom: "32px",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "28px",
                  backgroundColor: "#F8FAFC",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <p style={{ fontSize: "11px", color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700" }}>
                  📝 Informações Adicionais
                </p>
                <p style={{ fontSize: "14px", color: "#334155", margin: "14px 0 0 0", lineHeight: "1.7" }}>
                  {application.additional_info}
                </p>
              </div>
            </div>
          )}

          {/* Links Section - Centered */}
          {(application.linkedin_url || application.portfolio_url) && (
            <div
              data-section="links"
              style={{
                display: "grid",
                gridTemplateColumns: application.linkedin_url && application.portfolio_url ? "1fr 1fr" : "1fr",
                gap: "16px",
                marginBottom: "32px",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              {application.linkedin_url && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    backgroundColor: "#EFF6FF",
                    borderRadius: "12px",
                    border: "1px solid #BFDBFE",
                  }}
                >
                  <p style={{ fontSize: "11px", color: "#1D4ED8", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "700" }}>
                    💼 LinkedIn
                  </p>
                  <a
                    href={application.linkedin_url}
                    style={{ fontSize: "12px", color: "#2563EB", margin: "10px 0 0 0", display: "block", wordBreak: "break-all", textDecoration: "none" }}
                  >
                    {application.linkedin_url}
                  </a>
                </div>
              )}
              {application.portfolio_url && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    border: "1px solid #A7F3D0",
                  }}
                >
                  <p style={{ fontSize: "11px", color: "#047857", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "700" }}>
                    🌐 Portfólio
                  </p>
                  <a
                    href={application.portfolio_url}
                    style={{ fontSize: "12px", color: "#059669", margin: "10px 0 0 0", display: "block", wordBreak: "break-all", textDecoration: "none" }}
                  >
                    {application.portfolio_url}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Scored Questions Analysis - Only shown if there are answers */}
          {answerAnalysis.length > 0 && (
            <>
              <div 
                data-section="analysis-header"
                style={{ 
                  marginBottom: "12px",
                  pageBreakInside: "avoid",
                  breakInside: "avoid",
                }}
              >
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#1E3A8A",
                    margin: "0",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    textAlign: "center",
                  }}
                >
                  📊 Avaliação das Respostas
                </h3>
              </div>
              
              {answerAnalysis.map((item, index) => {
                const color = getScoreColor(item.score);
                return (
                  <div
                    key={index}
                    data-section={`question-${index}`}
                    style={{
                      padding: "16px 20px",
                      backgroundColor: "#F8FAFC",
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                      marginBottom: "12px",
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748B",
                        margin: "0 0 8px 0",
                        fontWeight: "600",
                      }}
                    >
                      {item.question}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#1E293B",
                          margin: 0,
                          fontWeight: "500",
                          flex: 1,
                        }}
                      >
                        {item.answer}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            padding: "4px 12px",
                            backgroundColor: color.bg,
                            color: color.text,
                            borderRadius: "16px",
                            fontSize: "11px",
                            fontWeight: "700",
                            border: `1px solid ${color.border}`,
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#64748B",
                            fontWeight: "600",
                          }}
                        >
                          {Math.round((item.score / item.maxScore) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total Score */}
              <div
                data-section="total-score"
                style={{
                  marginTop: "4px",
                  marginBottom: "32px",
                  padding: "20px",
                  background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
                  borderRadius: "12px",
                  textAlign: "center",
                  pageBreakInside: "avoid",
                  breakInside: "avoid",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(255, 255, 255, 0.8)",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontWeight: "600",
                  }}
                >
                  📈 Aderência Total
                </p>
                <p
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#FFFFFF",
                    margin: "8px 0 4px 0",
                  }}
                >
                  {scorePercentage}%
                </p>
              </div>
            </>
          )}

          {/* Application Date - Centered */}
          <div
            data-section="application-date"
            style={{
              textAlign: "center",
              padding: "18px",
              backgroundColor: "#F1F5F9",
              borderRadius: "10px",
              marginBottom: "28px",
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }}
          >
            <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
              Candidatura realizada em{" "}
              <strong style={{ color: "#334155" }}>
                {new Date(application.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
            </p>
          </div>

          {/* Footer - Centered */}
          <div
            data-section="footer"
            style={{
              textAlign: "center",
              paddingTop: "24px",
              borderTop: "2px solid #E5E7EB",
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }}
          >
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, fontWeight: "600" }}>
              RecrutaMente
            </p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "6px 0 0 0" }}>
              Documento Confidencial • Uso Exclusivo para Processo Seletivo
            </p>
            <p style={{ fontSize: "10px", color: "#D1D5DB", margin: "8px 0 0 0" }}>
              www.recrutamente.site
            </p>
          </div>
        </div>
      </div>
    );
  }
);

CandidatoPDFSimples.displayName = "CandidatoPDFSimples";

export default CandidatoPDFSimples;
