import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Loader2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { customQuestionsSections } from "@/data/customQuestions";
import { CustomQuestionBuilder } from "@/components/CustomQuestionBuilder";
import { ScoredQuestion } from "@/types/customQuestions";
import { generateUniqueSlug } from "@/utils/slugify";

const areas = [
  "Tecnologia",
  "Administração",
  "Recursos Humanos",
  "Comercial",
  "Marketing",
  "Financeiro",
  "Operações",
  "Logística",
  "Engenharia",
  "Saúde",
  "Educação",
  "Jurídico",
];

const types = ["CLT", "PJ", "Temporário", "Estágio", "Trainee"];
const levels = ["Júnior", "Pleno", "Sênior", "Especialista", "Gerente", "Diretor"];

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const EditarVagaPage = () => {
  const { id } = useParams();
  const { company, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [originalTitle, setOriginalTitle] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [scoredQuestions, setScoredQuestions] = useState<ScoredQuestion[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    area: "",
    city: "",
    state: "",
    type: "",
    level: "",
    salary_range: "",
    is_active: true,
    form_type: "internal",
    external_form_url: "",
  });

  useEffect(() => {
    if (!user || !company) {
      navigate("/auth");
      return;
    }
    fetchJob();
  }, [id, user, company]);

  const fetchJob = async () => {
    if (!id || !company) return;

    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .eq("company_id", company.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate("/dashboard");
        return;
      }

      setOriginalTitle(data.title);
      setFormData({
        title: data.title,
        description: data.description,
        requirements: data.requirements || "",
        responsibilities: data.responsibilities || "",
        benefits: data.benefits || "",
        area: data.area,
        city: data.city,
        state: data.state,
        type: data.type,
        level: data.level,
        salary_range: data.salary_range || "",
        is_active: data.is_active,
        form_type: data.external_form_url ? "external" : "internal",
        external_form_url: data.external_form_url || "",
      });

      // Load custom questions (new format)
      const customQuestionsData = data.custom_questions as { predefinedQuestions?: string[]; scoredQuestions?: ScoredQuestion[] } | string[] | null;
      
      if (customQuestionsData) {
        if (Array.isArray(customQuestionsData)) {
          // Old format - just array of strings
          setSelectedQuestions(customQuestionsData);
        } else if (typeof customQuestionsData === 'object') {
          // New format
          if (customQuestionsData.predefinedQuestions) {
            setSelectedQuestions(customQuestionsData.predefinedQuestions);
          }
          if (customQuestionsData.scoredQuestions) {
            setScoredQuestions(customQuestionsData.scoredQuestions);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a vaga.",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleAllInSection = (sectionId: string) => {
    const section = customQuestionsSections.find((s) => s.id === sectionId);
    if (!section) return;

    const sectionQuestionIds = section.questions.map((q) => q.id);
    const allSelected = sectionQuestionIds.every((id) => selectedQuestions.includes(id));

    if (allSelected) {
      setSelectedQuestions((prev) => prev.filter((id) => !sectionQuestionIds.includes(id)));
    } else {
      setSelectedQuestions((prev) => [...new Set([...prev, ...sectionQuestionIds])]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.area || 
        !formData.city || !formData.state || !formData.type || !formData.level) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if title changed and regenerate slug
      let newSlug: string | undefined;
      if (formData.title !== originalTitle && company) {
        newSlug = await generateUniqueSlug(formData.title, company.id, id);
      }

      const updateData: any = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements || null,
        responsibilities: formData.responsibilities || null,
        benefits: formData.benefits || null,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        type: formData.type,
        level: formData.level,
        salary_range: formData.salary_range || null,
        is_active: formData.is_active,
        external_form_url: formData.form_type === "external" ? formData.external_form_url : null,
        custom_questions: {
          predefinedQuestions: selectedQuestions,
          scoredQuestions: scoredQuestions.filter(q => q.question && q.options.every(o => o.text)),
        },
      };

      if (newSlug) {
        updateData.slug = newSlug;
      }

      const { error } = await supabase
        .from("jobs")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Vaga atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a vaga. Tente novamente.",
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
              to="/dashboard"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ChevronLeft size={18} />
              Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
              Editar Vaga
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Atualize as informações da vaga
            </p>
          </div>
        </section>

        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Status */}
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div>
                      <p className="font-medium text-foreground">Status da Vaga</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.is_active ? "Visível para candidatos" : "Não visível para candidatos"}
                      </p>
                    </div>
                    <Select 
                      value={formData.is_active ? "active" : "inactive"} 
                      onValueChange={(v) => handleChange("is_active", v === "active")}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="inactive">Inativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Basic Info */}
                  <div>
                    <h2 className="font-bold text-xl text-foreground mb-6 pb-4 border-b border-border">
                      Informações Básicas
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">
                          Título da Vaga *
                        </label>
                        <Input
                          value={formData.title}
                          onChange={(e) => handleChange("title", e.target.value)}
                          placeholder="Ex: Desenvolvedor Full Stack"
                          className="h-12 bg-background"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Área *
                        </label>
                        <Select value={formData.area} onValueChange={(v) => handleChange("area", v)}>
                          <SelectTrigger className="h-12 bg-background">
                            <SelectValue placeholder="Selecione a área" />
                          </SelectTrigger>
                          <SelectContent>
                            {areas.map((area) => (
                              <SelectItem key={area} value={area}>{area}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Tipo de Contrato *
                        </label>
                        <Select value={formData.type} onValueChange={(v) => handleChange("type", v)}>
                          <SelectTrigger className="h-12 bg-background">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Nível *
                        </label>
                        <Select value={formData.level} onValueChange={(v) => handleChange("level", v)}>
                          <SelectTrigger className="h-12 bg-background">
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                          <SelectContent>
                            {levels.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Faixa Salarial
                        </label>
                        <Input
                          value={formData.salary_range}
                          onChange={(e) => handleChange("salary_range", e.target.value)}
                          placeholder="Ex: R$ 5.000 - R$ 8.000"
                          className="h-12 bg-background"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h2 className="font-bold text-xl text-foreground mb-6 pb-4 border-b border-border">
                      Localização
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Cidade *
                        </label>
                        <Input
                          value={formData.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          placeholder="Ex: Recife"
                          className="h-12 bg-background"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Estado *
                        </label>
                        <Select value={formData.state} onValueChange={(v) => handleChange("state", v)}>
                          <SelectTrigger className="h-12 bg-background">
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="font-bold text-xl text-foreground mb-6 pb-4 border-b border-border">
                      Detalhes da Vaga
                    </h2>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Descrição da Vaga *
                        </label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                          placeholder="Descreva a vaga, responsabilidades principais..."
                          rows={4}
                          className="bg-background resize-none"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Requisitos
                        </label>
                        <Textarea
                          value={formData.requirements}
                          onChange={(e) => handleChange("requirements", e.target.value)}
                          placeholder="Liste os requisitos técnicos e comportamentais..."
                          rows={4}
                          className="bg-background resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Responsabilidades
                        </label>
                        <Textarea
                          value={formData.responsibilities}
                          onChange={(e) => handleChange("responsibilities", e.target.value)}
                          placeholder="Detalhe as responsabilidades do cargo..."
                          rows={4}
                          className="bg-background resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Benefícios
                        </label>
                        <Textarea
                          value={formData.benefits}
                          onChange={(e) => handleChange("benefits", e.target.value)}
                          placeholder="Liste os benefícios oferecidos..."
                          rows={3}
                          className="bg-background resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Type */}
                  <div>
                    <h2 className="font-bold text-xl text-foreground mb-6 pb-4 border-b border-border">
                      Formulário de Candidatura
                    </h2>
                    <RadioGroup
                      value={formData.form_type}
                      onValueChange={(v) => handleChange("form_type", v)}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:border-accent/50 transition-colors">
                        <RadioGroupItem value="internal" id="internal" />
                        <Label htmlFor="internal" className="flex-1 cursor-pointer">
                          <span className="font-medium text-foreground">Formulário do Site</span>
                          <p className="text-sm text-muted-foreground">
                            Candidatos preenchem o formulário diretamente no site
                          </p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:border-accent/50 transition-colors">
                        <RadioGroupItem value="external" id="external" />
                        <Label htmlFor="external" className="flex-1 cursor-pointer">
                          <span className="font-medium text-foreground flex items-center gap-2">
                            Formulário Externo
                            <ExternalLink size={14} />
                          </span>
                          <p className="text-sm text-muted-foreground">
                            Redirecionar candidatos para um link externo (Google Forms, Typeform, etc.)
                          </p>
                        </Label>
                      </div>
                    </RadioGroup>

                    {formData.form_type === "external" && (
                      <div className="mt-4 space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Link do Formulário Externo *
                        </label>
                        <Input
                          value={formData.external_form_url}
                          onChange={(e) => handleChange("external_form_url", e.target.value)}
                          placeholder="https://forms.google.com/..."
                          className="h-12 bg-background"
                          type="url"
                        />
                      </div>
                    )}
                  </div>

                  {/* Custom Scored Questions */}
                  {formData.form_type === "internal" && (
                    <div>
                      <h2 className="font-bold text-xl text-foreground mb-6 pb-4 border-b border-border">
                        Perguntas Personalizadas da Vaga
                      </h2>
                      <CustomQuestionBuilder
                        questions={scoredQuestions}
                        onChange={setScoredQuestions}
                      />
                    </div>
                  )}

                  {/* Predefined Custom Questions */}
                  {formData.form_type === "internal" && (
                    <div>
                      <h2 className="font-bold text-xl text-foreground mb-4 pb-4 border-b border-border">
                        Perguntas do Banco de Perguntas
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Selecione perguntas adicionais do banco de perguntas pré-definidas.
                      </p>

                      {selectedQuestions.length > 0 && (
                        <div className="mb-6 p-4 bg-accent/10 rounded-xl">
                          <p className="text-sm font-medium text-foreground">
                            {selectedQuestions.length} pergunta{selectedQuestions.length !== 1 ? "s" : ""} selecionada{selectedQuestions.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        {customQuestionsSections.map((section) => {
                          const isExpanded = expandedSections.includes(section.id);
                          const sectionQuestionIds = section.questions.map((q) => q.id);
                          const selectedInSection = sectionQuestionIds.filter((id) =>
                            selectedQuestions.includes(id)
                          ).length;

                          return (
                            <div key={section.id} className="border border-border rounded-xl overflow-hidden">
                              <button
                                type="button"
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex items-center justify-between p-4 bg-secondary/50 hover:bg-secondary transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-foreground">{section.title}</span>
                                  {selectedInSection > 0 && (
                                    <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                                      {selectedInSection}/{section.questions.length}
                                    </span>
                                  )}
                                </div>
                                {isExpanded ? (
                                  <ChevronUp size={18} className="text-muted-foreground" />
                                ) : (
                                  <ChevronDown size={18} className="text-muted-foreground" />
                                )}
                              </button>

                              {isExpanded && (
                                <div className="p-4 space-y-3 bg-background">
                                  <button
                                    type="button"
                                    onClick={() => toggleAllInSection(section.id)}
                                    className="text-sm text-accent hover:underline"
                                  >
                                    {sectionQuestionIds.every((id) => selectedQuestions.includes(id))
                                      ? "Desmarcar todas"
                                      : "Selecionar todas"}
                                  </button>

                                  {section.questions.map((question) => (
                                    <div
                                      key={question.id}
                                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
                                    >
                                      <Checkbox
                                        id={`edit-${question.id}`}
                                        checked={selectedQuestions.includes(question.id)}
                                        onCheckedChange={() => toggleQuestion(question.id)}
                                      />
                                      <label
                                        htmlFor={`edit-${question.id}`}
                                        className="text-sm text-foreground cursor-pointer flex-1"
                                      >
                                        {question.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="pt-6 border-t border-border flex gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
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

export default EditarVagaPage;
