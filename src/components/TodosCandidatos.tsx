import { useState, useEffect } from "react";
import { Download, Loader2, Search, Users, Eye, Mail, Phone, FileText, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

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
  job_id: string;
  job_title: string;
}

interface Job {
  id: string;
  title: string;
}

interface TodosCandidatosProps {
  companyId: string;
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  reviewing: "Em Análise",
  interviewed: "Entrevistado",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewing: "bg-blue-100 text-blue-700",
  interviewed: "bg-purple-100 text-purple-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const TodosCandidatos = ({ companyId }: TodosCandidatosProps) => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const fetchData = async () => {
    try {
      // Fetch all jobs for this company
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("id, title")
        .eq("company_id", companyId);

      if (jobsError) throw jobsError;

      setJobs(jobsData || []);

      if (!jobsData || jobsData.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // Fetch all applications for these jobs
      const jobIds = jobsData.map((j) => j.id);
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select("*")
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });

      if (applicationsError) throw applicationsError;

      // Map job titles to applications
      const jobTitleMap = new Map(jobsData.map((j) => [j.id, j.title]));
      const applicationsWithJobTitles = (applicationsData || []).map((app) => ({
        ...app,
        job_title: jobTitleMap.get(app.job_id) || "Vaga não encontrada",
        custom_answers: app.custom_answers as Record<string, string> | null,
      }));

      setApplications(applicationsWithJobTitles);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os candidatos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.job_id === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 7;

    filteredApplications.forEach((app, index) => {
      if (index > 0) doc.addPage();

      let y = margin;

      // Header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(app.full_name, margin, y);
      y += 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Vaga: ${app.job_title}`, margin, y);
      y += lineHeight;
      doc.text(`Status: ${statusLabels[app.status] || app.status}`, margin, y);
      y += lineHeight * 2;

      // Separator
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += lineHeight;

      // Contact info
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("Contato", margin, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");
      doc.text(`Email: ${app.email}`, margin, y);
      y += lineHeight;
      doc.text(`Telefone: ${app.phone}`, margin, y);
      y += lineHeight;
      doc.text(`Localização: ${app.city}, ${app.state}`, margin, y);
      y += lineHeight * 2;

      // Education
      doc.setFont("helvetica", "bold");
      doc.text("Formação", margin, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");
      doc.text(`Escolaridade: ${app.education_level}`, margin, y);
      y += lineHeight * 2;

      // Experience
      doc.setFont("helvetica", "bold");
      doc.text("Experiência", margin, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");
      const experienceLines = doc.splitTextToSize(app.experience || "Não informado", pageWidth - margin * 2);
      doc.text(experienceLines, margin, y);
      y += experienceLines.length * lineHeight + lineHeight;

      // Additional info
      if (app.salary_expectation || app.availability) {
        doc.setFont("helvetica", "bold");
        doc.text("Informações Adicionais", margin, y);
        y += lineHeight;
        doc.setFont("helvetica", "normal");
        if (app.salary_expectation) {
          doc.text(`Pretensão Salarial: ${app.salary_expectation}`, margin, y);
          y += lineHeight;
        }
        if (app.availability) {
          doc.text(`Disponibilidade: ${app.availability}`, margin, y);
          y += lineHeight;
        }
        y += lineHeight;
      }

      // Expectations
      if (app.expectations) {
        doc.setFont("helvetica", "bold");
        doc.text("Expectativas", margin, y);
        y += lineHeight;
        doc.setFont("helvetica", "normal");
        const expectLines = doc.splitTextToSize(app.expectations, pageWidth - margin * 2);
        doc.text(expectLines, margin, y);
        y += expectLines.length * lineHeight + lineHeight;
      }

      // Links
      if (app.linkedin_url || app.portfolio_url) {
        doc.setFont("helvetica", "bold");
        doc.text("Links", margin, y);
        y += lineHeight;
        doc.setFont("helvetica", "normal");
        if (app.linkedin_url) {
          doc.text(`LinkedIn: ${app.linkedin_url}`, margin, y);
          y += lineHeight;
        }
        if (app.portfolio_url) {
          doc.text(`Portfólio: ${app.portfolio_url}`, margin, y);
          y += lineHeight;
        }
        y += lineHeight;
      }

      // Additional notes
      if (app.additional_info) {
        doc.setFont("helvetica", "bold");
        doc.text("Observações", margin, y);
        y += lineHeight;
        doc.setFont("helvetica", "normal");
        const notesLines = doc.splitTextToSize(app.additional_info, pageWidth - margin * 2);
        doc.text(notesLines, margin, y);
        y += notesLines.length * lineHeight + lineHeight;
      }

      // Footer
      doc.setTextColor(150);
      doc.setFontSize(10);
      doc.text(
        `Candidatura recebida em ${new Date(app.created_at).toLocaleDateString("pt-BR")}`,
        margin,
        doc.internal.pageSize.getHeight() - 15
      );
    });

    doc.save(`candidatos_${new Date().toISOString().split("T")[0]}.pdf`);

    toast({
      title: "PDF exportado!",
      description: `${filteredApplications.length} candidato(s) exportado(s) com sucesso.`,
    });
  };

  const downloadAllResumes = async () => {
    const applicationsWithResume = filteredApplications.filter((app) => app.resume_url);

    if (applicationsWithResume.length === 0) {
      toast({
        title: "Nenhum currículo",
        description: "Nenhum candidato possui currículo anexado.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Baixando currículos...",
      description: `Iniciando download de ${applicationsWithResume.length} currículo(s).`,
    });

    for (const app of applicationsWithResume) {
      try {
        const { data, error } = await supabase.storage
          .from("resumes")
          .download(app.resume_url!);

        if (error) {
          console.error(`Erro ao baixar currículo de ${app.full_name}:`, error);
          continue;
        }

        // Get file extension from original path
        const extension = app.resume_url!.split(".").pop() || "pdf";
        const fileName = `curriculo_${app.full_name.replace(/\s+/g, "_")}.${extension}`;

        // Download file
        const url = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(`Erro ao processar currículo de ${app.full_name}:`, error);
      }
    }

    toast({
      title: "Currículos baixados!",
      description: `${applicationsWithResume.length} currículo(s) baixado(s).`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Todos os Candidatos</h2>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} disabled={filteredApplications.length === 0}>
            <FileText size={18} />
            Exportar PDF ({filteredApplications.length})
          </Button>
          <Button 
            onClick={downloadAllResumes} 
            variant="outline"
            disabled={filteredApplications.filter(a => a.resume_url).length === 0}
          >
            <Paperclip size={18} />
            Baixar Currículos ({filteredApplications.filter(a => a.resume_url).length})
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar por nome, email ou vaga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="reviewing">Em Análise</SelectItem>
            <SelectItem value="interviewed">Entrevistado</SelectItem>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="rejected">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por vaga" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Vagas</SelectItem>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredApplications.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.full_name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{app.job_title}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[app.status]}`}>
                        {statusLabels[app.status] || app.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(app.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedApplication(app)}
                      >
                        <Eye size={16} />
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <Users className="mx-auto text-muted-foreground mb-4" size={48} />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum candidato encontrado
          </h3>
          <p className="text-muted-foreground">
            {applications.length === 0
              ? "Ainda não há candidaturas nas suas vagas."
              : "Tente ajustar os filtros de busca."}
          </p>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Candidato</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedApplication.full_name}
                  </h3>
                  <p className="text-muted-foreground">
                    Vaga: {selectedApplication.job_title}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[selectedApplication.status]}`}>
                  {statusLabels[selectedApplication.status]}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <span>{selectedApplication.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{selectedApplication.phone}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-muted-foreground">Localização</label>
                  <p className="text-foreground">{selectedApplication.city}, {selectedApplication.state}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Escolaridade</label>
                  <p className="text-foreground">{selectedApplication.education_level}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-muted-foreground">Experiência</label>
                  <p className="text-foreground whitespace-pre-wrap">{selectedApplication.experience}</p>
                </div>
                {selectedApplication.salary_expectation && (
                  <div>
                    <label className="text-sm text-muted-foreground">Pretensão Salarial</label>
                    <p className="text-foreground">{selectedApplication.salary_expectation}</p>
                  </div>
                )}
                {selectedApplication.availability && (
                  <div>
                    <label className="text-sm text-muted-foreground">Disponibilidade</label>
                    <p className="text-foreground">{selectedApplication.availability}</p>
                  </div>
                )}
                {selectedApplication.expectations && (
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground">Expectativas</label>
                    <p className="text-foreground whitespace-pre-wrap">{selectedApplication.expectations}</p>
                  </div>
                )}
                {selectedApplication.linkedin_url && (
                  <div>
                    <label className="text-sm text-muted-foreground">LinkedIn</label>
                    <a
                      href={selectedApplication.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline block"
                    >
                      Ver Perfil
                    </a>
                  </div>
                )}
                {selectedApplication.portfolio_url && (
                  <div>
                    <label className="text-sm text-muted-foreground">Portfólio</label>
                    <a
                      href={selectedApplication.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline block"
                    >
                      Ver Portfólio
                    </a>
                  </div>
                )}
                {selectedApplication.additional_info && (
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground">Informações Adicionais</label>
                    <p className="text-foreground whitespace-pre-wrap">{selectedApplication.additional_info}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border text-sm text-muted-foreground">
                Candidatura recebida em {new Date(selectedApplication.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodosCandidatos;
