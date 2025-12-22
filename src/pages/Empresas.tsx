import { Link } from "react-router-dom";
import { Building2, Users, Clock, Shield, CheckCircle, ArrowRight, MessageCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  {
    icon: Users,
    title: "Banco de Talentos Qualificados",
    description: "Acesso a candidatos pré-selecionados e alinhados ao perfil da sua empresa."
  },
  {
    icon: Clock,
    title: "Processos Ágeis",
    description: "Redução significativa no tempo de contratação, sem perder qualidade."
  },
  {
    icon: Shield,
    title: "Garantia de Assertividade",
    description: "Metodologia que garante maior aderência dos candidatos às vagas."
  },
  {
    icon: Building2,
    title: "Parceria Estratégica",
    description: "Acompanhamento dedicado e suporte durante todo o processo seletivo."
  }
];

const processSteps = [
  {
    step: "01",
    title: "Briefing",
    description: "Entendemos sua necessidade, cultura organizacional e perfil ideal do candidato."
  },
  {
    step: "02",
    title: "Hunting",
    description: "Buscamos no mercado e em nosso banco de talentos os candidatos mais aderentes."
  },
  {
    step: "03",
    title: "Triagem",
    description: "Avaliação técnica e comportamental dos candidatos selecionados."
  },
  {
    step: "04",
    title: "Apresentação",
    description: "Encaminhamos os candidatos finalistas com parecer completo."
  },
  {
    step: "05",
    title: "Acompanhamento",
    description: "Suporte durante a fase de entrevistas e negociação."
  }
];

const EmpresasPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Solicitação enviada!",
      description: "Nossa equipe entrará em contato em breve.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-hero-gradient py-20">
          <div className="container mx-auto px-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ChevronLeft size={18} />
              Voltar para Home
            </Link>
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Encontre os melhores talentos para sua empresa
              </h1>
              <p className="text-lg sm:text-xl text-primary-foreground/85 mb-8">
                Simplifique seu processo de contratação com nossa consultoria especializada em recrutamento e seleção estratégico.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="#solicitar">
                    Solicitar Profissionais
                    <ArrowRight size={18} />
                  </a>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <a
                    href="https://wa.me/5581981985374?text=Olá! Sou de uma empresa e gostaria de conhecer os serviços da RecrutaMente."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={18} />
                    Falar no WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Benefícios</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-6">
                Por que contratar com a <span className="text-accent">RecrutaMente</span>?
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-gradient transition-all duration-300">
                    <benefit.icon className="text-accent group-hover:text-primary-foreground transition-colors" size={28} />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Nosso Processo</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-6">
                Como funciona o <span className="text-accent">recrutamento</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Um processo estruturado para garantir as melhores contratações para sua empresa.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <div
                    key={step.step}
                    className="flex gap-6 bg-card rounded-2xl p-6 shadow-card border border-border"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-accent-gradient rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Request Form */}
        <section id="solicitar" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Info */}
              <div>
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Solicite Profissionais</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-6">
                  Conte-nos sobre sua <span className="text-accent">necessidade</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Preencha o formulário ao lado e nossa equipe entrará em contato para entender melhor sua demanda e apresentar a melhor solução.
                </p>

                <div className="space-y-4">
                  {[
                    "Análise personalizada da sua necessidade",
                    "Acesso ao nosso banco de talentos qualificados",
                    "Processo ágil e assertivo",
                    "Acompanhamento dedicado",
                    "Garantia de satisfação"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="text-accent flex-shrink-0" size={20} />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Nome *</label>
                      <Input name="nome" placeholder="Seu nome" required className="bg-background h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Empresa *</label>
                      <Input name="empresa" placeholder="Nome da empresa" required className="bg-background h-12" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">E-mail *</label>
                      <Input name="email" type="email" placeholder="seu@email.com" required className="bg-background h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Telefone *</label>
                      <Input name="telefone" placeholder="(00) 00000-0000" required className="bg-background h-12" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Cargo(s) que deseja contratar *</label>
                    <Input name="cargos" placeholder="Ex: Analista de RH, Desenvolvedor..." required className="bg-background h-12" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Quantidade de vagas</label>
                      <Input name="quantidade" type="number" placeholder="1" className="bg-background h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Urgência</label>
                      <Select>
                        <SelectTrigger className="bg-background h-12">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="imediata">Imediata</SelectItem>
                          <SelectItem value="15-dias">Até 15 dias</SelectItem>
                          <SelectItem value="30-dias">Até 30 dias</SelectItem>
                          <SelectItem value="planejamento">Em planejamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Descrição da necessidade *</label>
                    <Textarea
                      name="descricao"
                      placeholder="Descreva o perfil desejado, principais responsabilidades, requisitos..."
                      rows={4}
                      required
                      className="bg-background resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                  </Button>
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

export default EmpresasPage;
