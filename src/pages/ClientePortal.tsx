import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Loader2, 
  Briefcase, 
  Users,
  Eye,
  Download,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Clock,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Job {
  id: string;
  title: string;
  area: string;
  city: string;
  state: string;
  type: string;
  level: string;
  company_id: string;
}

interface Application {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  education_level: string;
  experience: string;
  salary_expectation?: string;
  availability?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  additional_info?: string;
  status: string;
  resume_url?: string;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  reviewing: "Em Análise",
  interview: "Entrevista",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewing: "bg-blue-100 text-blue-700",
  interview: "bg-purple-100 text-purple-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const ClientePortalPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/cliente/login");
        return;
      }

      // Verify client role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleData?.role !== "client") {
        await supabase.auth.signOut();
        navigate("/cliente/login");
        return;
      }

      // Fetch job access for this client (specific jobs, not all from company)
      const { data: jobAccessData } = await supabase
        .from("client_job_access")
        .select("job_id")
        .eq("client_user_id", session.user.id);

      if (!jobAccessData || jobAccessData.length === 0) {
        setLoading(false);
        return;
      }

      const jobIds = jobAccessData.map(a => a.job_id);

      // Fetch jobs that the client has access to
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .in("id", jobIds)
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);

      // Fetch applications for those jobs
      if (jobsData && jobsData.length > 0) {
        const { data: appsData } = await supabase
          .from("applications")
          .select("*")
          .in("job_id", jobIds)
          .order("created_at", { ascending: false });

        setApplications(appsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/cliente/login");
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleDownloadResume = async (resumeUrl: string, candidateName: string) => {
    try {
      const fileName = resumeUrl.split("/").pop();
      if (!fileName) return;

      const { data, error } = await supabase.storage
        .from("resumes")
        .download(fileName);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `curriculo-${candidateName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  const getJobApplications = (jobId: string) => {
    return applications.filter(a => a.job_id === jobId);
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
      <main className="flex-1 pt-20 bg-secondary">
        {/* Header */}
        <section className="bg-hero-gradient py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                  Portal do Cliente
                </h1>
                <p className="text-primary-foreground/80">
                  Visualize as candidaturas das vagas disponíveis
                </p>
              </div>
              <Button variant="secondary" onClick={handleSignOut}>
                <LogOut size={18} />
                Sair
              </Button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Stats */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Vagas Disponíveis</p>
                    <p className="text-2xl font-bold text-foreground">{jobs.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Users className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total de Candidaturas</p>
                    <p className="text-2xl font-bold text-foreground">{applications.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            {jobs.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Vagas e Candidaturas</h2>
                
                {jobs.map((job) => {
                  const jobApps = getJobApplications(job.id);
                  const isSelected = selectedJob?.id === job.id;
                  
                  return (
                    <div key={job.id} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                      <div 
                        className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedJob(isSelected ? null : job)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                                {job.type}
                              </span>
                              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                                {job.level}
                              </span>
                            </div>
                            <h3 className="font-bold text-foreground text-lg">{job.title}</h3>
                            <p className="text-muted-foreground text-sm">
                              {job.area} • {job.city}, {job.state}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-accent">{jobApps.length}</p>
                              <p className="text-xs text-muted-foreground">candidaturas</p>
                            </div>
                            <Eye className={`text-muted-foreground transition-transform ${isSelected ? 'rotate-180' : ''}`} size={20} />
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="border-t border-border">
                          {jobApps.length > 0 ? (
                            <div className="divide-y divide-border">
                              {jobApps.map((app) => (
                                <div key={app.id} className="p-4 hover:bg-muted/30 transition-colors">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-foreground">{app.full_name}</h4>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[app.status]}`}>
                                          {statusLabels[app.status]}
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{app.email}</p>
                                      <p className="text-sm text-muted-foreground">{app.city}, {app.state}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" onClick={() => handleViewApplication(app)}>
                                        <Eye size={16} />
                                        Ver Detalhes
                                      </Button>
                                      {app.resume_url && (
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => handleDownloadResume(app.resume_url!, app.full_name)}
                                        >
                                          <Download size={16} />
                                          Currículo
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 text-center">
                              <Users className="mx-auto text-muted-foreground mb-2" size={32} />
                              <p className="text-muted-foreground">Nenhuma candidatura para esta vaga.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Briefcase className="mx-auto text-muted-foreground mb-4" size={48} />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhuma vaga disponível
                </h3>
                <p className="text-muted-foreground">
                  Você ainda não tem acesso a nenhuma vaga. Entre em contato com o administrador.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />

      {/* Application Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Candidato</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">
                    {selectedApplication.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedApplication.full_name}</h3>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusColors[selectedApplication.status]}`}>
                    {statusLabels[selectedApplication.status]}
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-muted-foreground" size={18} />
                  <span className="text-foreground">{selectedApplication.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-muted-foreground" size={18} />
                  <span className="text-foreground">{selectedApplication.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-muted-foreground" size={18} />
                  <span className="text-foreground">{selectedApplication.city}, {selectedApplication.state}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="text-muted-foreground" size={18} />
                  <span className="text-foreground">{selectedApplication.education_level}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-muted-foreground" size={18} />
                  <span className="text-foreground">{selectedApplication.experience}</span>
                </div>
              </div>

              {selectedApplication.salary_expectation && (
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Pretensão Salarial</h4>
                  <p className="text-muted-foreground">{selectedApplication.salary_expectation}</p>
                </div>
              )}

              {selectedApplication.availability && (
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Disponibilidade</h4>
                  <p className="text-muted-foreground">{selectedApplication.availability}</p>
                </div>
              )}

              {selectedApplication.additional_info && (
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Informações Adicionais</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedApplication.additional_info}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-border">
                {selectedApplication.linkedin_url && (
                  <Button variant="outline" asChild>
                    <a href={selectedApplication.linkedin_url} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </Button>
                )}
                {selectedApplication.portfolio_url && (
                  <Button variant="outline" asChild>
                    <a href={selectedApplication.portfolio_url} target="_blank" rel="noopener noreferrer">
                      Portfólio
                    </a>
                  </Button>
                )}
                {selectedApplication.resume_url && (
                  <Button onClick={() => handleDownloadResume(selectedApplication.resume_url!, selectedApplication.full_name)}>
                    <Download size={18} />
                    Baixar Currículo
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientePortalPage;
