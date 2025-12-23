import { forwardRef } from "react";
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
}

interface Job {
  id: string;
  title: string;
  area: string;
  city: string;
  state: string;
  level: string;
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
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
              paddingBottom: "24px",
              borderBottom: "2px solid #E5E7EB",
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
            style={{
              textAlign: "center",
              marginBottom: "36px",
              padding: "36px 32px",
              background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
              borderRadius: "16px",
              boxShadow: "0 10px 40px -10px rgba(30, 58, 138, 0.4)",
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
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
              marginBottom: "32px",
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
            style={{
              textAlign: "center",
              marginBottom: "32px",
              padding: "28px",
              background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
              borderRadius: "12px",
              border: "1px solid #A7F3D0",
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
          <div style={{ marginBottom: "32px" }}>
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
          {(application.expectations || application.additional_info) && (
            <div style={{ marginBottom: "32px" }}>
              {application.expectations && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "28px",
                    backgroundColor: "#F8FAFC",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    marginBottom: "16px",
                  }}
                >
                  <p style={{ fontSize: "11px", color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700" }}>
                    🎯 Expectativas
                  </p>
                  <p style={{ fontSize: "14px", color: "#334155", margin: "14px 0 0 0", lineHeight: "1.7" }}>
                    {application.expectations}
                  </p>
                </div>
              )}
              {application.additional_info && (
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
              )}
            </div>
          )}

          {/* Links Section - Centered */}
          {(application.linkedin_url || application.portfolio_url) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: application.linkedin_url && application.portfolio_url ? "1fr 1fr" : "1fr",
                gap: "16px",
                marginBottom: "32px",
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

          {/* Application Date - Centered */}
          <div
            style={{
              textAlign: "center",
              padding: "18px",
              backgroundColor: "#F1F5F9",
              borderRadius: "10px",
              marginBottom: "28px",
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
            style={{
              textAlign: "center",
              paddingTop: "24px",
              borderTop: "2px solid #E5E7EB",
            }}
          >
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, fontWeight: "600" }}>
              RecrutaMente
            </p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "6px 0 0 0" }}>
              Documento Confidencial • Uso Exclusivo para Processo Seletivo
            </p>
            <p style={{ fontSize: "10px", color: "#D1D5DB", margin: "8px 0 0 0" }}>
              www.recrutamente.com.br
            </p>
          </div>
        </div>
      </div>
    );
  }
);

CandidatoPDFSimples.displayName = "CandidatoPDFSimples";

export default CandidatoPDFSimples;
