import { forwardRef } from "react";
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
  Cell,
} from "recharts";
import { getQuestionLabel } from "@/data/customQuestions";
import logoRecrutamente from "@/assets/logo-recrutamente.png";

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
  custom_answers: Record<string, string> | null;
}

interface Job {
  id: string;
  title: string;
  area: string;
  city: string;
  state: string;
  level?: string;
}

interface CandidatoPDFReportProps {
  application: Application;
  job: Job;
  analysisData: {
    radarData: Array<{ category: string; score: number; fullMark: number }>;
    barData: Array<{ category: string; score: number; fill: string }>;
    overallScore: number;
    recommendation: string;
  };
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  reviewing: "Em Análise",
  approved: "Aprovado",
  rejected: "Rejeitado",
  hired: "Contratado",
};

export const CandidatoPDFReport = forwardRef<HTMLDivElement, CandidatoPDFReportProps>(
  ({ application, job, analysisData }, ref) => {
    const { radarData, barData, overallScore, recommendation } = analysisData;

    const getScoreColor = (score: number) => {
      if (score >= 80) return "#16a34a";
      if (score >= 60) return "#2563eb";
      if (score >= 40) return "#ca8a04";
      return "#dc2626";
    };

    const getScoreBgColor = (score: number) => {
      if (score >= 80) return "#dcfce7";
      if (score >= 60) return "#dbeafe";
      if (score >= 40) return "#fef9c3";
      return "#fee2e2";
    };

    return (
      <div
        ref={ref}
        style={{
          width: "794px",
          padding: "40px",
          backgroundColor: "#ffffff",
          fontFamily: "Arial, sans-serif",
          color: "#1f2937",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid #3b82f6", paddingBottom: "20px" }}>
          <img src={logoRecrutamente} alt="RecrutaMente" style={{ height: "50px" }} />
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Relatório de Candidatura</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
              {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Candidate Info */}
        <div style={{ marginBottom: "25px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
          <h2 style={{ margin: "0 0 15px 0", fontSize: "22px", color: "#1e3a8a" }}>{application.full_name}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
            <p style={{ margin: 0 }}><strong>Email:</strong> {application.email}</p>
            <p style={{ margin: 0 }}><strong>Telefone:</strong> {application.phone}</p>
            <p style={{ margin: 0 }}><strong>Localização:</strong> {application.city}, {application.state}</p>
            <p style={{ margin: 0 }}><strong>Escolaridade:</strong> {application.education_level}</p>
            {application.salary_expectation && (
              <p style={{ margin: 0 }}><strong>Pretensão:</strong> {application.salary_expectation}</p>
            )}
            {application.availability && (
              <p style={{ margin: 0 }}><strong>Disponibilidade:</strong> {application.availability}</p>
            )}
          </div>
        </div>

        {/* Job Info */}
        <div style={{ marginBottom: "25px", padding: "15px", backgroundColor: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#1e3a8a" }}>Vaga: {job.title}</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>
            {job.area} • {job.level || "Não especificado"} • {job.city}, {job.state}
          </p>
          <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
            Status: {statusLabels[application.status] || application.status}
          </p>
        </div>

        {/* Fit Cultural Analysis */}
        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color: "#1e3a8a", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
            Análise de Fit Cultural
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            {/* Radar Chart */}
            <div style={{ backgroundColor: "#f8fafc", borderRadius: "8px", padding: "15px" }}>
              <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#6b7280", textAlign: "center" }}>Perfil do Candidato</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#d1d5db" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "#374151", fontSize: 9 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div style={{ backgroundColor: "#f8fafc", borderRadius: "8px", padding: "15px" }}>
              <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#6b7280", textAlign: "center" }}>Compatibilidade por Área</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 8 }} />
                  <YAxis type="category" dataKey="category" tick={{ fill: "#374151", fontSize: 9 }} width={80} />
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
          <div style={{
            padding: "20px",
            backgroundColor: getScoreBgColor(overallScore),
            borderRadius: "8px",
            border: `2px solid ${getScoreColor(overallScore)}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Score Geral de Compatibilidade</p>
              <p style={{ margin: 0, fontSize: "36px", fontWeight: "bold", color: getScoreColor(overallScore) }}>
                {overallScore}%
              </p>
            </div>
            <div style={{ textAlign: "right", maxWidth: "60%" }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                {recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Experience */}
        {application.experience && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#1e3a8a" }}>Experiência Profissional</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#4b5563", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
              {application.experience}
            </p>
          </div>
        )}

        {/* Custom Answers */}
        {application.custom_answers && Object.keys(application.custom_answers).length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#1e3a8a", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
              Respostas do Formulário
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {Object.entries(application.custom_answers).map(([questionId, answer]) => (
                <div key={questionId} style={{ fontSize: "12px", padding: "8px", backgroundColor: "#f9fafb", borderRadius: "4px" }}>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "11px" }}>{getQuestionLabel(questionId)}</p>
                  <p style={{ margin: "3px 0 0 0", color: "#1f2937", fontWeight: "500" }}>{answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {application.expectations && (
          <div style={{ marginBottom: "15px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#374151" }}>Expectativas para o Cargo</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#4b5563", whiteSpace: "pre-wrap" }}>{application.expectations}</p>
          </div>
        )}

        {application.additional_info && (
          <div style={{ marginBottom: "15px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#374151" }}>Informações Adicionais</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#4b5563", whiteSpace: "pre-wrap" }}>{application.additional_info}</p>
          </div>
        )}

        {/* Links */}
        {(application.linkedin_url || application.portfolio_url) && (
          <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "6px" }}>
            <p style={{ margin: 0, fontSize: "12px" }}>
              {application.linkedin_url && <span style={{ marginRight: "20px" }}><strong>LinkedIn:</strong> {application.linkedin_url}</span>}
              {application.portfolio_url && <span><strong>Portfólio:</strong> {application.portfolio_url}</span>}
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "30px", paddingTop: "15px", borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "10px", color: "#9ca3af" }}>
            Relatório gerado automaticamente pela plataforma RecrutaMente • {new Date().toLocaleString("pt-BR")}
          </p>
          <p style={{ margin: "5px 0 0 0", fontSize: "10px", color: "#9ca3af" }}>
            Este documento é confidencial e destinado exclusivamente para uso interno.
          </p>
        </div>
      </div>
    );
  }
);

CandidatoPDFReport.displayName = "CandidatoPDFReport";

export default CandidatoPDFReport;
