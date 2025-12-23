import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Download, Mail, Phone, MapPin, Briefcase, Loader2, FileText, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getQuestionLabel } from "@/data/customQuestions";

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
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  reviewing: "Em Análise",
  approved: "Aprovado",
  rejected: "Rejeitado",
  hired: "Contratado",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewing: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-purple-100 text-purple-700",
};

const VagaCandidaturasPage = () => {
  const { id } = useParams();
  const { user, company } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (!user || !company) {
      navigate("/auth");
      return;
    }
    fetchData();
  }, [id, user, company]);

  const fetchData = async () => {
    if (!id || !company) return;

    try {
      // Fetch job
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .eq("company_id", company.id)
        .maybeSingle();

      if (jobError) throw jobError;
      if (!jobData) {
        navigate("/dashboard");
        return;
      }

      setJob(jobData);

      // Fetch applications
      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("job_id", id)
        .order("created_at", { ascending: false });

      if (appError) throw appError;
      
      const appsWithCustomAnswers = (appData || []).map(app => ({
        ...app,
        custom_answers: app.custom_answers as Record<string, string> | null
      }));
      
      setApplications(appsWithCustomAnswers);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as candidaturas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (error) throw error;

      setApplications(apps =>
        apps.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(prev => prev ? { ...prev, status: newStatus } : null);
      }

      toast({
        title: "Status atualizado",
        description: `Candidatura marcada como "${statusLabels[newStatus]}".`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", applicationId);

      if (error) throw error;

      setApplications(apps => apps.filter(app => app.id !== applicationId));

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(null);
      }

      toast({
        title: "Candidatura excluída",
        description: "A candidatura foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a candidatura.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadResume = async (resumeUrl: string, candidateName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("resumes")
        .download(resumeUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `curriculo_${candidateName.replace(/\s+/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar o currículo.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20">
        <section className="bg-hero-gradient py-12">
          <div className="container mx-auto px-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ChevronLeft size={18} />
              Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
              Candidaturas
            </h1>
            {job && (
              <p className="text-lg text-primary-foreground/80">
                {job.title} • {job.city}, {job.state}
              </p>
            )}
          </div>
        </section>

        <section className="py-8 bg-secondary min-h-[60vh]">
          <div className="container mx-auto px-4">
            {applications.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-1 space-y-4">
                  <h2 className="font-bold text-foreground mb-4">
                    {applications.length} candidatura{applications.length !== 1 ? "s" : ""}
                  </h2>
                  {applications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApplication(app)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedApplication?.id === app.id
                          ? "bg-accent/10 border-accent"
                          : "bg-card border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-foreground">{app.full_name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[app.status]}`}>
                          {statusLabels[app.status]}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">{app.email}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {new Date(app.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Details */}
                <div className="lg:col-span-2">
                  {selectedApplication ? (
                    <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {selectedApplication.full_name}
                          </h2>
                          <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1">
                              <Mail size={14} />
                              {selectedApplication.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={14} />
                              {selectedApplication.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {selectedApplication.city}, {selectedApplication.state}
                            </span>
                          </div>
                        </div>
                        <Select
                          value={selectedApplication.status}
                          onValueChange={(v) => handleStatusChange(selectedApplication.id, v)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="text-sm text-muted-foreground">Escolaridade</label>
                          <p className="text-foreground">{selectedApplication.education_level}</p>
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
                      </div>

                      <div className="mb-6">
                        <label className="text-sm text-muted-foreground">Experiência</label>
                        <p className="text-foreground whitespace-pre-wrap mt-1">
                          {selectedApplication.experience}
                        </p>
                      </div>

                      {selectedApplication.expectations && (
                        <div className="mb-6">
                          <label className="text-sm text-muted-foreground">Expectativas para o Cargo</label>
                          <p className="text-foreground whitespace-pre-wrap mt-1">
                            {selectedApplication.expectations}
                          </p>
                        </div>
                      )}

                      {selectedApplication.additional_info && (
                        <div className="mb-6">
                          <label className="text-sm text-muted-foreground">Informações Adicionais</label>
                          <p className="text-foreground whitespace-pre-wrap mt-1">
                            {selectedApplication.additional_info}
                          </p>
                        </div>
                      )}

                      {/* Custom Answers */}
                      {selectedApplication.custom_answers && Object.keys(selectedApplication.custom_answers).length > 0 && (
                        <div className="mb-6 p-4 bg-secondary/50 rounded-xl">
                          <h3 className="font-medium text-foreground mb-4">Respostas Personalizadas</h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {Object.entries(selectedApplication.custom_answers).map(([questionId, answer]) => (
                              <div key={questionId}>
                                <label className="text-sm text-muted-foreground">
                                  {getQuestionLabel(questionId)}
                                </label>
                                <p className="text-foreground">{answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                        {selectedApplication.resume_url && (
                          <Button
                            variant="outline"
                            onClick={() => handleDownloadResume(
                              selectedApplication.resume_url!,
                              selectedApplication.full_name
                            )}
                          >
                            <Download size={16} />
                            Baixar Currículo
                          </Button>
                        )}
                        {selectedApplication.linkedin_url && (
                          <Button variant="outline" asChild>
                            <a href={selectedApplication.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={16} />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                        {selectedApplication.portfolio_url && (
                          <Button variant="outline" asChild>
                            <a href={selectedApplication.portfolio_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={16} />
                              Portfólio
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" asChild>
                          <a href={`mailto:${selectedApplication.email}`}>
                            <Mail size={16} />
                            Enviar E-mail
                          </a>
                        </Button>
                        <Button variant="outline" asChild>
                          <a
                            href={`https://wa.me/55${selectedApplication.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Phone size={16} />
                            WhatsApp
                          </a>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                              <Trash2 size={16} />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir candidatura?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. A candidatura de {selectedApplication.full_name} será permanentemente removida.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteApplication(selectedApplication.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl p-12 border border-border text-center">
                      <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
                      <p className="text-muted-foreground">
                        Selecione uma candidatura para ver os detalhes
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Briefcase className="mx-auto text-muted-foreground mb-4" size={48} />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhuma candidatura ainda
                </h3>
                <p className="text-muted-foreground">
                  Quando candidatos se aplicarem para esta vaga, você verá aqui.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default VagaCandidaturasPage;
