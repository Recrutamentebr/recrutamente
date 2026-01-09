import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const types = ["CLT", "PJ", "Temporário", "Estágio", "Trainee", "Part-time", "A Combinar"];
const levels = ["Júnior", "Pleno", "Sênior", "Especialista", "Gerente", "Diretor"];

const ClienteEditarVagaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    type: "",
    level: "",
    salary_range: "",
  });

  useEffect(() => {
    checkAccessAndFetchJob();
  }, [id]);

  const checkAccessAndFetchJob = async () => {
    if (!id) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/cliente/login");
        return;
      }

      // Check if client has edit access
      const { data: accessData } = await supabase
        .from("client_job_access")
        .select("can_edit")
        .eq("client_user_id", session.user.id)
        .eq("job_id", id)
        .single();

      if (!accessData?.can_edit) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para editar esta vaga.",
          variant: "destructive",
        });
        navigate("/cliente");
        return;
      }

      setCanEdit(true);

      // Fetch job data
      const { data: jobData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !jobData) {
        navigate("/cliente");
        return;
      }

      setFormData({
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements || "",
        responsibilities: jobData.responsibilities || "",
        benefits: jobData.benefits || "",
        type: jobData.type || "",
        level: jobData.level,
        salary_range: jobData.salary_range || "",
      });
    } catch (error) {
      console.error("Error:", error);
      navigate("/cliente");
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements || null,
          responsibilities: formData.responsibilities || null,
          benefits: formData.benefits || null,
          type: formData.type || null,
          level: formData.level,
          salary_range: formData.salary_range || null,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Vaga atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
      navigate("/cliente");
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a vaga.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
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
              to="/cliente"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ChevronLeft size={18} />
              Voltar ao Portal
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
              Editar Vaga
            </h1>
          </div>
        </section>

        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Título da Vaga</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="h-12 bg-background"
                        required
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Tipo de Contrato</label>
                        <Select value={formData.type} onValueChange={(v) => handleChange("type", v)}>
                          <SelectTrigger className="h-12 bg-background">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Nível</label>
                        <Select value={formData.level} onValueChange={(v) => handleChange("level", v)}>
                          <SelectTrigger className="h-12 bg-background">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {levels.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Faixa Salarial</label>
                      <Input
                        value={formData.salary_range}
                        onChange={(e) => handleChange("salary_range", e.target.value)}
                        placeholder="Ex: R$ 5.000 - R$ 8.000"
                        className="h-12 bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Descrição</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        rows={4}
                        className="bg-background resize-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Requisitos</label>
                      <Textarea
                        value={formData.requirements}
                        onChange={(e) => handleChange("requirements", e.target.value)}
                        rows={4}
                        className="bg-background resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Responsabilidades</label>
                      <Textarea
                        value={formData.responsibilities}
                        onChange={(e) => handleChange("responsibilities", e.target.value)}
                        rows={4}
                        className="bg-background resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Benefícios</label>
                      <Textarea
                        value={formData.benefits}
                        onChange={(e) => handleChange("benefits", e.target.value)}
                        rows={3}
                        className="bg-background resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-border">
                    <Button type="button" variant="outline" onClick={() => navigate("/cliente")}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={18} />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Alterações"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ClienteEditarVagaPage;
