import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { jobs } from "@/data/jobs";
import { useToast } from "@/hooks/use-toast";

const escolaridade = [
  "Ensino Fundamental",
  "Ensino Médio",
  "Ensino Técnico",
  "Graduação",
  "Pós-Graduação",
  "Mestrado",
  "Doutorado",
];

const disponibilidade = [
  "Imediata",
  "15 dias",
  "30 dias",
  "45 dias",
  "60 dias ou mais",
];

const CandidaturaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const job = jobs.find((j) => j.id === id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Candidatura enviada!",
      description: "Sua candidatura foi registrada com sucesso. Entraremos em contato em breve.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center bg-secondary">
          <div className="bg-card rounded-3xl p-12 shadow-card border border-border max-w-lg mx-4 text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-accent" size={40} />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Candidatura Enviada!</h1>
            <p className="text-muted-foreground mb-8">
              Obrigado pelo interesse! Sua candidatura foi registrada em nosso banco de talentos. Nossa equipe analisará seu perfil e entrará em contato em breve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/vagas">Ver outras vagas</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Voltar para Home</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-hero-gradient py-12">
          <div className="container mx-auto px-4">
            <Link
              to={job ? `/vagas/${job.id}` : "/vagas"}
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ChevronLeft size={18} />
              Voltar
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">
              Formulário de Candidatura
            </h1>
            {job && (
              <p className="text-lg text-primary-foreground/80">
                Vaga: <strong>{job.title}</strong>
              </p>
            )}
          </div>
        </section>

        {/* Form */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Info */}
                  <div>
                    <h2 className="font-bold text-xl text-foreground mb-6 pb-4 border-b border-border">
                      Dados Pessoais
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">
                          Nome Completo *
                        </label>
                        <Input
                          name="nome"
                          placeholder="Digite seu nome completo"
                          required
                          className="bg-background h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          E-mail *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="seu@email.com"
                          required
                          className="bg-background h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Telefone / WhatsApp *
                        </label>
                        <Input
                          name="telefone"
                          placeholder="(00) 00000-0000"
                          required
                          className="bg-background h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Cidade *
                        </label>
                        <Input
                          name="cidade"
                          placeholder="Sua cidade"
                          required
                          className="bg-background h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Estado *
                        </label>
                        <Input
                          name="estado"
                          placeholder="UF"
                          required
                          className="bg-background h-12"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div>
                    <h2 className="font-bold text-xl text-foreground mb-6 pb-4 border-b border-border">
                      Informações Profissionais
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">
                          Vaga de Interesse *
                        </label>
                        <Select defaultValue={job?.id} required>
                          <SelectTrigger className="bg-background h-12">
                            <SelectValue placeholder="Selecione uma vaga" />
                          </SelectTrigger>
                          <SelectContent>
                            {jobs.map((j) => (
                              <SelectItem key={j.id} value={j.id}>
                                {j.title} - {j.city}/{j.state}
                              </SelectItem>
                            ))}
                            <SelectItem value="banco-talentos">
                              Cadastro no Banco de Talentos (sem vaga específica)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Nível de Escolaridade *
                        </label>
                        <Select required>
                          <SelectTrigger className="bg-background h-12">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {escolaridade.map((e) => (
                              <SelectItem key={e} value={e}>
                                {e}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Pretensão Salarial
                        </label>
                        <Input
                          name="pretensao"
                          placeholder="Ex: R$ 5.000,00"
                          className="bg-background h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Disponibilidade para Início *
                        </label>
                        <Select required>
                          <SelectTrigger className="bg-background h-12">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {disponibilidade.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">
                          Experiência Profissional *
                        </label>
                        <Textarea
                          name="experiencia"
                          placeholder="Descreva brevemente sua experiência profissional..."
                          rows={4}
                          required
                          className="bg-background resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Questions */}
                  <div>
                    <h2 className="font-bold text-xl text-foreground mb-6 pb-4 border-b border-border">
                      Informações Adicionais
                    </h2>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Disponibilidade de horário
                        </label>
                        <Select>
                          <SelectTrigger className="bg-background h-12">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comercial">Horário comercial</SelectItem>
                            <SelectItem value="flexivel">Horário flexível</SelectItem>
                            <SelectItem value="turnos">Disponível para turnos</SelectItem>
                            <SelectItem value="noturno">Disponível para horário noturno</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Observações ou informações adicionais
                        </label>
                        <Textarea
                          name="observacoes"
                          placeholder="Informações que você considera relevantes..."
                          rows={3}
                          className="bg-background resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <h2 className="font-bold text-xl text-foreground mb-6 pb-4 border-b border-border">
                      Currículo
                    </h2>
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-foreground">
                        Envie seu currículo (PDF ou DOC - máx. 5MB) *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        />
                        <div className="flex items-center gap-4 p-4 bg-background rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors">
                          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Upload className="text-accent" size={24} />
                          </div>
                          <div className="flex-1">
                            {fileName ? (
                              <p className="text-foreground font-medium">{fileName}</p>
                            ) : (
                              <>
                                <p className="text-foreground font-medium">Clique para selecionar um arquivo</p>
                                <p className="text-muted-foreground text-sm">ou arraste e solte aqui</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-6 border-t border-border">
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando candidatura..." : "Enviar Candidatura"}
                    </Button>
                    <p className="text-muted-foreground text-xs text-center mt-4">
                      Ao enviar, você concorda em ter seus dados armazenados em nosso banco de talentos para futuras oportunidades.
                    </p>
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

export default CandidaturaPage;
