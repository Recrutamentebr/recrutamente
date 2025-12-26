import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Plus, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Eye, 
  Edit, 
  Trash2,
  ChevronRight,
  Loader2,
  Building2,
  UserPlus,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GerenciarClientes from "@/components/GerenciarClientes";
import TodasCandidaturas from "@/components/TodasCandidaturas";

interface Job {
  id: string;
  title: string;
  area: string;
  city: string;
  state: string;
  type: string;
  level: string;
  is_active: boolean;
  created_at: string;
  applications_count?: number;
}

const DashboardPage = () => {
  const { user, company, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [activeTab, setActiveTab] = useState<"jobs" | "applications" | "profile" | "clients">("jobs");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (company) {
      fetchJobs();
    }
  }, [company]);

  const fetchJobs = async () => {
    if (!company) return;
    
    try {
      const { data: jobsData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", company.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get application counts
      const jobsWithCounts = await Promise.all(
        (jobsData || []).map(async (job) => {
          const { count } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("job_id", job.id);
          
          return { ...job, applications_count: count || 0 };
        })
      );

      setJobs(jobsWithCounts);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vagas.",
        variant: "destructive",
      });
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Tem certeza que deseja arquivar esta vaga? As candidaturas serão preservadas.")) return;

    try {
      const { error } = await supabase
        .from("jobs")
        .update({ is_deleted: true, is_active: false })
        .eq("id", jobId);

      if (error) throw error;

      setJobs(jobs.filter((j) => j.id !== jobId));
      toast({
        title: "Vaga arquivada",
        description: "A vaga foi arquivada e as candidaturas foram preservadas.",
      });
    } catch (error) {
      console.error("Error archiving job:", error);
      toast({
        title: "Erro",
        description: "Não foi possível arquivar a vaga.",
        variant: "destructive",
      });
    }
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ is_active: !currentStatus })
        .eq("id", jobId);

      if (error) throw error;

      setJobs(jobs.map((j) => 
        j.id === jobId ? { ...j, is_active: !currentStatus } : j
      ));
      
      toast({
        title: currentStatus ? "Vaga desativada" : "Vaga ativada",
        description: currentStatus 
          ? "A vaga não está mais visível para candidatos."
          : "A vaga agora está visível para candidatos.",
      });
    } catch (error) {
      console.error("Error toggling job status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da vaga.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !company) {
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
                  Olá, {company.company_name}!
                </h1>
                <p className="text-primary-foreground/80">
                  Gerencie suas vagas e visualize candidaturas
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
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Vagas Ativas</p>
                    <p className="text-2xl font-bold text-foreground">
                      {jobs.filter((j) => j.is_active).length}
                    </p>
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
                    <p className="text-2xl font-bold text-foreground">
                      {jobs.reduce((acc, j) => acc + (j.applications_count || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <Building2 className="text-foreground" size={24} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total de Vagas</p>
                    <p className="text-2xl font-bold text-foreground">{jobs.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                variant={activeTab === "jobs" ? "default" : "outline"}
                onClick={() => setActiveTab("jobs")}
              >
                <Briefcase size={18} />
                Minhas Vagas
              </Button>
              <Button
                variant={activeTab === "applications" ? "default" : "outline"}
                onClick={() => setActiveTab("applications")}
              >
                <Users size={18} />
                Todas Candidaturas
              </Button>
              <Button
                variant={activeTab === "clients" ? "default" : "outline"}
                onClick={() => setActiveTab("clients")}
              >
                <UserPlus size={18} />
                Gerenciar Clientes
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "outline"}
                onClick={() => setActiveTab("profile")}
              >
                <Settings size={18} />
                Meu Perfil
              </Button>
            </div>

            {/* Jobs Tab */}
            {activeTab === "jobs" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-foreground">Suas Vagas</h2>
                  <Button asChild>
                    <Link to="/dashboard/nova-vaga">
                      <Plus size={18} />
                      Nova Vaga
                    </Link>
                  </Button>
                </div>

                {loadingJobs ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-accent" size={32} />
                  </div>
                ) : jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-card rounded-2xl p-6 border border-border shadow-card"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  job.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {job.is_active ? "Ativa" : "Inativa"}
                              </span>
                              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                                {job.type}
                              </span>
                              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                                {job.level}
                              </span>
                            </div>
                            <h3 className="font-bold text-foreground text-lg">
                              {job.title}
                              <span className="ml-2 text-sm font-medium text-accent">
                                ({job.applications_count} candidatura{job.applications_count !== 1 ? "s" : ""})
                              </span>
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {job.area} • {job.city}, {job.state}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/dashboard/vagas/${job.id}/candidaturas`}>
                                <Eye size={16} />
                                Ver Candidaturas
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/dashboard/vagas/${job.id}/editar`}>
                                <Edit size={16} />
                                Editar
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleJobStatus(job.id, job.is_active)}
                            >
                              {job.is_active ? "Desativar" : "Ativar"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteJob(job.id)}
                              title="Arquivar vaga"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-card rounded-2xl border border-border">
                    <Briefcase className="mx-auto text-muted-foreground mb-4" size={48} />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Nenhuma vaga cadastrada
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Crie sua primeira vaga para começar a receber candidaturas.
                    </p>
                    <Button asChild>
                      <Link to="/dashboard/nova-vaga">
                        <Plus size={18} />
                        Criar Primeira Vaga
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <TodasCandidaturas companyId={company.id} />
            )}

            {/* Clients Tab */}
            {activeTab === "clients" && (
              <GerenciarClientes companyId={company.id} />
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-card rounded-2xl p-8 border border-border shadow-card max-w-2xl">
                <h2 className="text-xl font-bold text-foreground mb-6">Dados da Empresa</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Nome da Empresa</label>
                    <p className="text-foreground font-medium">{company.company_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">E-mail de Contato</label>
                    <p className="text-foreground">{company.contact_email}</p>
                  </div>
                  {company.contact_phone && (
                    <div>
                      <label className="text-sm text-muted-foreground">Telefone</label>
                      <p className="text-foreground">{company.contact_phone}</p>
                    </div>
                  )}
                  {company.cnpj && (
                    <div>
                      <label className="text-sm text-muted-foreground">CNPJ</label>
                      <p className="text-foreground">{company.cnpj}</p>
                    </div>
                  )}
                  {company.website && (
                    <div>
                      <label className="text-sm text-muted-foreground">Website</label>
                      <p className="text-foreground">{company.website}</p>
                    </div>
                  )}
                  {company.description && (
                    <div>
                      <label className="text-sm text-muted-foreground">Descrição</label>
                      <p className="text-foreground">{company.description}</p>
                    </div>
                  )}
                </div>
                <Button className="mt-6" asChild>
                  <Link to="/dashboard/perfil">
                    <Edit size={18} />
                    Editar Perfil
                  </Link>
                </Button>
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

export default DashboardPage;
