import { useState, useEffect } from "react";
import { 
  Loader2, 
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Edit,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  job_id: string;
  job?: {
    id: string;
    title: string;
    area: string;
    city: string;
    state: string;
    level: string;
  };
}

interface Job {
  id: string;
  title: string;
  area: string;
  city: string;
  state: string;
  level: string;
}

interface TodasCandidaturasProps {
  companyId: string;
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

export const TodasCandidaturas = ({ companyId }: TodasCandidaturasProps) => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const fetchData = async () => {
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("id, title, area, city, state, level")
        .eq("company_id", companyId);

      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      if (!jobsData || jobsData.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const jobIds = jobsData.map(j => j.id);
      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select("*")
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });

      if (appsError) throw appsError;

      const appsWithJobs = (appsData || []).map(app => ({
        ...app,
        job: jobsData.find(j => j.id === app.job_id),
      }));

      setApplications(appsWithJobs);
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

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", applicationId);

      if (error) throw error;

      setApplications(applications.filter((a) => a.id !== applicationId));
      toast({
        title: "Candidatura excluída",
        description: "A candidatura foi excluída com sucesso.",
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

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (error) throw error;

      setApplications(
        applications.map((a) =>
          a.id === applicationId ? { ...a, status: newStatus } : a
        )
      );
      toast({
        title: "Status atualizado",
        description: "O status da candidatura foi atualizado.",
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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = selectedJob === "all" || app.job_id === selectedJob;
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
    return matchesSearch && matchesJob && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Todas as Candidaturas</h2>
        <span className="text-muted-foreground text-sm">
          {filteredApplications.length} candidatura{filteredApplications.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por vaga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as vagas</SelectItem>
              {jobs.map(job => (
                <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="grid gap-4">
          {filteredApplications.map(app => (
            <div
              key={app.id}
              className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-card transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[app.status]}`}>
                      {statusLabels[app.status]}
                    </span>
                    {app.job && (
                      <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                        {app.job.title}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-foreground text-lg">{app.full_name}</h3>
                  <div className="flex flex-wrap gap-4 mt-1 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {app.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} />
                      {app.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {app.city}, {app.state}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Candidatura em {new Date(app.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* View Details Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye size={16} />
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{app.full_name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">E-mail</p>
                            <p className="font-medium">{app.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Telefone</p>
                            <p className="font-medium">{app.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Localização</p>
                            <p className="font-medium">{app.city}, {app.state}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Escolaridade</p>
                            <p className="font-medium">{app.education_level}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Experiência</p>
                            <p className="font-medium">{app.experience}</p>
                          </div>
                          {app.salary_expectation && (
                            <div>
                              <p className="text-sm text-muted-foreground">Pretensão Salarial</p>
                              <p className="font-medium">{app.salary_expectation}</p>
                            </div>
                          )}
                          {app.availability && (
                            <div>
                              <p className="text-sm text-muted-foreground">Disponibilidade</p>
                              <p className="font-medium">{app.availability}</p>
                            </div>
                          )}
                        </div>
                        {app.linkedin_url && (
                          <div>
                            <p className="text-sm text-muted-foreground">LinkedIn</p>
                            <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                              {app.linkedin_url}
                            </a>
                          </div>
                        )}
                        {app.portfolio_url && (
                          <div>
                            <p className="text-sm text-muted-foreground">Portfólio</p>
                            <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                              {app.portfolio_url}
                            </a>
                          </div>
                        )}
                        {app.resume_url && (
                          <div>
                            <p className="text-sm text-muted-foreground">Currículo</p>
                            <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                              Ver Currículo
                            </a>
                          </div>
                        )}
                        {app.expectations && (
                          <div>
                            <p className="text-sm text-muted-foreground">Expectativas</p>
                            <p className="text-foreground">{app.expectations}</p>
                          </div>
                        )}
                        {app.additional_info && (
                          <div>
                            <p className="text-sm text-muted-foreground">Informações Adicionais</p>
                            <p className="text-foreground">{app.additional_info}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Status */}
                  <Select
                    value={app.status}
                    onValueChange={(value) => handleUpdateStatus(app.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <Edit size={16} className="mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir candidatura?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. A candidatura de {app.full_name} será permanentemente excluída.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteApplication(app.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <Users className="mx-auto text-muted-foreground mb-4" size={48} />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhuma candidatura encontrada
          </h3>
          <p className="text-muted-foreground">
            {applications.length === 0
              ? "Quando candidatos se aplicarem para suas vagas, você verá aqui."
              : "Nenhuma candidatura corresponde aos filtros selecionados."}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodasCandidaturas;
