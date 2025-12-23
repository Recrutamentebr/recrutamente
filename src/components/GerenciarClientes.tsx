import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Users, Mail, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  email: string;
  created_at: string;
}

interface GerenciarClientesProps {
  companyId: string;
}

const clientSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const GerenciarClientes = ({ companyId }: GerenciarClientesProps) => {
  const { toast } = useToast();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchClients();
  }, [companyId]);

  const fetchClients = async () => {
    try {
      // Get client_company_access for this company
      const { data: accessData, error } = await supabase
        .from("client_company_access")
        .select("client_user_id, created_at")
        .eq("company_id", companyId);

      if (error) throw error;

      if (!accessData || accessData.length === 0) {
        setClients([]);
        setLoading(false);
        return;
      }

      // We can't directly query auth.users, so we'll store email info differently
      // For now, we'll use the client_user_id as identifier
      // In a real app, you might want to store client info in a separate table
      const clientsList: Client[] = accessData.map(access => ({
        id: access.client_user_id,
        email: "Cliente", // Placeholder - will be fetched differently
        created_at: access.created_at,
      }));

      setClients(clientsList);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
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

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = clientSchema.safeParse(formData);
    if (!result.success) {
      const errors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") errors.email = err.message;
        if (err.path[0] === "password") errors.password = err.message;
      });
      setFormErrors(errors);
      return;
    }

    setCreating(true);

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Não autenticado");

      // Create the client user via Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/cliente/login`,
          data: {
            user_type: "client",
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!signUpData.user) {
        throw new Error("Erro ao criar usuário");
      }

      // Add client_company_access
      const { error: accessError } = await supabase
        .from("client_company_access")
        .insert({
          client_user_id: signUpData.user.id,
          company_id: companyId,
          created_by: currentUser.id,
        });

      if (accessError) throw accessError;

      toast({
        title: "Cliente criado!",
        description: `Credenciais enviadas para ${formData.email}`,
      });

      setFormData({ email: "", password: "" });
      setDialogOpen(false);
      fetchClients();
    } catch (error: any) {
      console.error("Error creating client:", error);
      let message = "Não foi possível criar o cliente.";
      if (error.message?.includes("already registered")) {
        message = "Este e-mail já está cadastrado.";
      }
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Tem certeza que deseja remover o acesso deste cliente?")) return;

    try {
      const { error } = await supabase
        .from("client_company_access")
        .delete()
        .eq("client_user_id", clientId)
        .eq("company_id", companyId);

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
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
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

              <div className="space-y-2">
                <Label htmlFor="client-password">Senha</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="client-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha para o cliente"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={creating}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-destructive">{formErrors.password}</p>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                O cliente receberá um e-mail de confirmação e poderá acessar o portal em{" "}
                <strong>/cliente/login</strong>
              </p>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={creating}>
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

      {clients.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Cliente</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-mono text-sm">{client.id.slice(0, 8)}...</TableCell>
                  <TableCell>{formatDate(client.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 size={16} />
                      Remover Acesso
                    </Button>
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
    </div>
  );
};

export default GerenciarClientes;
