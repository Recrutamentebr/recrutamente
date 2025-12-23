import { forwardRef } from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Clock, DollarSign, ExternalLink, FileText, Linkedin, Globe } from "lucide-react";
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
  pending: { bg: "#fef3c7", text: "#92400e" },
  reviewing: { bg: "#dbeafe", text: "#1e40af" },
  approved: { bg: "#dcfce7", text: "#166534" },
  rejected: { bg: "#fee2e2", text: "#991b1b" },
  hired: { bg: "#f3e8ff", text: "#7c3aed" },
};

export const CandidatoPDFSimples = forwardRef<HTMLDivElement, CandidatoPDFSimplesProps>(
  ({ application, job }, ref) => {
    const statusStyle = statusColors[application.status] || statusColors.pending;
    const currentDate = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return (
      <div
        ref={ref}
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          backgroundColor: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#1f2937",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            paddingBottom: "16px",
            borderBottom: "3px solid #1e3a8a",
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
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#1e3a8a",
                margin: 0,
              }}
            >
              Relatório do Candidato
            </h1>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
              Gerado em {currentDate}
            </p>
          </div>
        </div>

        {/* Candidate Info Section */}
        <div
          style={{
            backgroundColor: "#eff6ff",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid #bfdbfe",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#1e3a8a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              {application.full_name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e3a8a", margin: 0 }}>
              {application.full_name}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={16} color="#3b82f6" />
              <span style={{ fontSize: "14px" }}>{application.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Phone size={16} color="#3b82f6" />
              <span style={{ fontSize: "14px" }}>{application.phone}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={16} color="#3b82f6" />
              <span style={{ fontSize: "14px" }}>
                {application.city}, {application.state}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={16} color="#3b82f6" />
              <span style={{ fontSize: "14px" }}>
                Candidatura: {new Date(application.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </div>

        {/* Job Applied Section */}
        <div
          style={{
            backgroundColor: "#dcfce7",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid #86efac",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#166534",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Briefcase size={18} color="#166534" />
            VAGA APLICADA
          </h3>
          <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#166534", margin: "0 0 8px 0" }}>
            {job.title}
          </h4>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <span
              style={{
                backgroundColor: "#bbf7d0",
                color: "#166534",
                padding: "4px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {job.area}
            </span>
            <span
              style={{
                backgroundColor: "#bbf7d0",
                color: "#166534",
                padding: "4px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {job.level}
            </span>
            <span
              style={{
                backgroundColor: "#bbf7d0",
                color: "#166534",
                padding: "4px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {job.city}, {job.state}
            </span>
          </div>
          <div
            style={{
              marginTop: "12px",
              display: "inline-block",
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Status: {statusLabels[application.status]}
          </div>
        </div>

        {/* Professional Info Section */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#475569",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <GraduationCap size={18} color="#475569" />
            INFORMAÇÕES PROFISSIONAIS
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 4px 0" }}>Escolaridade</p>
              <p style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>{application.education_level}</p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 4px 0" }}>Experiência</p>
              <p style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>{application.experience}</p>
            </div>
            {application.salary_expectation && (
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "4px" }}>
                  <DollarSign size={12} />
                  Pretensão Salarial
                </p>
                <p style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>{application.salary_expectation}</p>
              </div>
            )}
            {application.availability && (
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 4px 0" }}>Disponibilidade</p>
                <p style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>{application.availability}</p>
              </div>
            )}
          </div>
        </div>

        {/* Resume Download Section */}
        {application.resume_url && (
          <div
            style={{
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              border: "2px solid #f59e0b",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#92400e",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FileText size={18} color="#92400e" />
              CURRÍCULO DO CANDIDATO
            </h3>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #fbbf24",
              }}
            >
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#92400e", margin: 0 }}>
                  Clique para acessar o currículo
                </p>
                <p style={{ fontSize: "11px", color: "#b45309", margin: "4px 0 0 0", wordBreak: "break-all" }}>
                  {application.resume_url}
                </p>
              </div>
              <a
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ExternalLink size={16} />
                Baixar
              </a>
            </div>
          </div>
        )}

        {/* Expectations Section */}
        {application.expectations && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#475569",
                marginBottom: "12px",
              }}
            >
              EXPECTATIVAS
            </h3>
            <p style={{ fontSize: "14px", lineHeight: "1.6", margin: 0, color: "#334155" }}>
              {application.expectations}
            </p>
          </div>
        )}

        {/* Additional Info Section */}
        {application.additional_info && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#475569",
                marginBottom: "12px",
              }}
            >
              INFORMAÇÕES ADICIONAIS
            </h3>
            <p style={{ fontSize: "14px", lineHeight: "1.6", margin: 0, color: "#334155" }}>
              {application.additional_info}
            </p>
          </div>
        )}

        {/* Links Section */}
        {(application.linkedin_url || application.portfolio_url) && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#475569",
                marginBottom: "12px",
              }}
            >
              LINKS PROFISSIONAIS
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {application.linkedin_url && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Linkedin size={16} color="#0077b5" />
                  <a
                    href={application.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0077b5", fontSize: "13px", wordBreak: "break-all" }}
                  >
                    {application.linkedin_url}
                  </a>
                </div>
              )}
              {application.portfolio_url && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Globe size={16} color="#6366f1" />
                  <a
                    href={application.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#6366f1", fontSize: "13px", wordBreak: "break-all" }}
                  >
                    {application.portfolio_url}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "20px",
            borderTop: "2px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src={logoRecrutamente}
              alt="RecrutaMente"
              style={{ height: "24px", objectFit: "contain" }}
              crossOrigin="anonymous"
            />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>RecrutaMente</span>
          </div>
          <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>
            Documento confidencial • Gerado automaticamente
          </p>
        </div>
      </div>
    );
  }
);

CandidatoPDFSimples.displayName = "CandidatoPDFSimples";

export default CandidatoPDFSimples;
