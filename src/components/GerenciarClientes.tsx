import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Users, Mail, Settings, Briefcase, Check, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";

interface Client {
  id: string;
  client_user_id: string | null;
  email: string;
  created_at: string;
  job_ids: string[];
  password_set: boolean;
}

interface Job {
  id: string;
  title: string;
  area: string;
  city: string;
  state: string;
}

interface GerenciarClientesProps {
  companyId: string;
}

const clientSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const GerenciarClientes = ({ companyId }: GerenciarClientesProps) => {
  const { toast } = useToast();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formErrors, setFormErrors] = useState<{ email?: string }>({});
  const [formData, setFormData] = useState({
    email: "",
  });
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [savingJobs, setSavingJobs] = useState(false);

  useEffect(() => {
    fetchData();

    // Subscribe to realtime updates for client status changes
    const channel = supabase
      .channel('client-status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'client_company_access',
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          // Update the client in the list when their status changes
          setClients((prevClients) =>
            prevClients.map((client) =>
              client.id === payload.new.id
                ? {
                    ...client,
                    password_set: payload.new.password_set,
                    client_user_id: payload.new.client_user_id,
                  }
                : client
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId]);

  const fetchData = async () => {
    try {
      // Fetch jobs for this company
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("id, title, area, city, state")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);

      // Get client_company_access for this company
      const { data: accessData, error } = await supabase
        .from("client_company_access")
        .select("id, client_user_id, client_email, created_at, password_set, pending_job_ids")
        .eq("company_id", companyId);

      if (error) throw error;

      if (!accessData || accessData.length === 0) {
        setClients([]);
        setLoading(false);
        return;
      }

      // Fetch job access for each client
      const clientsList: Client[] = await Promise.all(
        accessData.map(async (access) => {
          let jobIds: string[] = [];
          
          if (access.password_set && access.client_user_id) {
            // User activated - get from client_job_access
            const { data: jobAccess } = await supabase
              .from("client_job_access")
              .select("job_id")
              .eq("client_user_id", access.client_user_id);
            jobIds = jobAccess?.map(j => j.job_id) || [];
          } else {
            // Pending invitation - get from pending_job_ids
            jobIds = (access.pending_job_ids as string[]) || [];
          }

          return {
            id: access.id,
            client_user_id: access.client_user_id,
            email: access.client_email || "Email não registrado",
            created_at: access.created_at,
            job_ids: jobIds,
            password_set: access.password_set,
          };
        })
      );

      setClients(clientsList);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleJobToggle = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = clientSchema.safeParse(formData);
    if (!result.success) {
      const errors: { email?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") errors.email = err.message;
      });
      setFormErrors(errors);
      return;
    }

    if (selectedJobs.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos uma vaga para o cliente.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Não autenticado");

      // Check if email already exists
      const { data: existingAccess } = await supabase
        .from("client_company_access")
        .select("id")
        .eq("client_email", formData.email)
        .eq("company_id", companyId)
        .single();

      if (existingAccess) {
        toast({
          title: "Atenção",
          description: "Este e-mail já está cadastrado para esta empresa.",
          variant: "destructive",
        });
        setCreating(false);
        return;
      }

      // Create invitation with pending job IDs
      const { data: accessData, error: accessError } = await supabase
        .from("client_company_access")
        .insert({
          company_id: companyId,
          created_by: currentUser.id,
          client_email: formData.email,
          password_set: false,
          pending_job_ids: selectedJobs,
        })
        .select()
        .single();

      if (accessError) throw accessError;

      toast({
        title: "Convite criado!",
        description: `O cliente ${formData.email} pode acessar e criar sua senha.`,
      });

      setFormData({ email: "" });
      setSelectedJobs([]);
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o convite.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setSelectedJobs(client.job_ids);
    setEditDialogOpen(true);
  };

  const handleSaveClientJobs = async () => {
    if (!selectedClient) return;

    setSavingJobs(true);

    try {
      if (selectedClient.password_set && selectedClient.client_user_id) {
        // Client is active - update client_job_access
        await supabase
          .from("client_job_access")
          .delete()
          .eq("client_user_id", selectedClient.client_user_id);

        if (selectedJobs.length > 0) {
          const jobAccessInserts = selectedJobs.map(jobId => ({
            client_user_id: selectedClient.client_user_id!,
            job_id: jobId,
          }));

          const { error } = await supabase
            .from("client_job_access")
            .insert(jobAccessInserts);

          if (error) throw error;
        }
      } else {
        // Client is pending - update pending_job_ids
        const { error } = await supabase
          .from("client_company_access")
          .update({ pending_job_ids: selectedJobs })
          .eq("id", selectedClient.id);

        if (error) throw error;
      }

      toast({
        title: "Vagas atualizadas!",
        description: "As permissões do cliente foram atualizadas.",
      });

      setEditDialogOpen(false);
      setSelectedClient(null);
      fetchData();
    } catch (error) {
      console.error("Error updating client jobs:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as vagas.",
        variant: "destructive",
      });
    } finally {
      setSavingJobs(false);
    }
  };

  const handleDeleteClient = async (clientId: string, clientUserId?: string) => {
    if (!confirm("Tem certeza que deseja remover o acesso deste cliente?")) return;

    try {
      // Delete job access first (if user was created)
      if (clientUserId) {
        await supabase
          .from("client_job_access")
          .delete()
          .eq("client_user_id", clientUserId);
      }

      // Delete company access by id
      const { error } = await supabase
        .from("client_company_access")
        .delete()
        .eq("id", clientId);

      if (error) throw error;

      setClients(clients.filter(c => c.id !== clientId));
      toast({
        title: "Acesso removido",
        description: "O cliente não tem mais acesso às candidaturas.",
      });
    } catch (error) {
      console.error("Error deleting client access:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o acesso.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getJobNames = (jobIds: string[]) => {
    return jobIds
      .map(id => jobs.find(j => j.id === id)?.title)
      .filter(Boolean)
      .join(", ");
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
        <div>
          <h2 className="text-xl font-bold text-foreground">Gerenciar Clientes</h2>
          <p className="text-muted-foreground text-sm">
            Crie acessos para que seus clientes visualizem as candidaturas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setLoading(true); fetchData(); }}>
            <RefreshCw size={18} />
            Atualizar
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} />
                Novo Cliente
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-email">E-mail do Cliente</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="client-email"
                    name="email"
                    type="email"
                    placeholder="cliente@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={creating}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-destructive">{formErrors.email}</p>
                )}
              </div>

              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <Clock className="inline-block mr-1" size={14} />
                  O cliente receberá um convite e criará sua própria senha no primeiro acesso.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Vagas que o cliente pode visualizar</Label>
                {jobs.length > 0 ? (
                  <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 border-b border-border last:border-b-0"
                      >
                        <Checkbox
                          id={`job-${job.id}`}
                          checked={selectedJobs.includes(job.id)}
                          onCheckedChange={() => handleJobToggle(job.id)}
                        />
                        <label htmlFor={`job-${job.id}`} className="flex-1 cursor-pointer">
                          <p className="font-medium text-foreground text-sm">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.area} • {job.city}, {job.state}</p>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma vaga cadastrada.</p>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                O cliente poderá acessar o portal em <strong>/cliente/login</strong>
              </p>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={creating || jobs.length === 0}>
                  {creating ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Criando...
                    </>
                  ) : (
                    "Criar Cliente"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {clients.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Vagas</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.email}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {client.job_ids.length > 0 
                        ? `${client.job_ids.length} vaga${client.job_ids.length > 1 ? 's' : ''}`
                        : "Nenhuma vaga"}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(client.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClient(client)}
                      >
                        <Settings size={16} />
                        Vagas
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <Users className="mx-auto text-muted-foreground mb-4" size={48} />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum cliente cadastrado
          </h3>
          <p className="text-muted-foreground mb-6">
            Crie seu primeiro cliente para dar acesso às candidaturas.
          </p>
        </div>
      )}

      {/* Edit Client Jobs Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Vagas do Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cliente: <strong>{selectedClient?.email}</strong>
            </p>
            
            <div className="space-y-2">
              <Label>Vagas que o cliente pode visualizar</Label>
              {jobs.length > 0 ? (
                <div className="border border-border rounded-lg max-h-64 overflow-y-auto">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 border-b border-border last:border-b-0"
                    >
                      <Checkbox
                        id={`edit-job-${job.id}`}
                        checked={selectedJobs.includes(job.id)}
                        onCheckedChange={() => handleJobToggle(job.id)}
                      />
                      <label htmlFor={`edit-job-${job.id}`} className="flex-1 cursor-pointer">
                        <p className="font-medium text-foreground text-sm">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.area} • {job.city}, {job.state}</p>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma vaga cadastrada.</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveClientJobs} disabled={savingJobs}>
                {savingJobs ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarClientes;
