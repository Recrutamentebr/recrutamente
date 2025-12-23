import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Briefcase, Clock, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  slug: string;
  title: string;
  description: string;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
  area: string;
  city: string;
  state: string;
  type: string;
  level: string;
  salary_range: string | null;
  created_at: string;
  external_form_url: string | null;
}

const VagaDetalhes = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [slug]);

  const fetchJob = async () => {
    if (!slug) return;

    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseTextToList = (text: string | null): string[] => {
    if (!text) return [];
    return text.split("\n").filter((line) => line.trim().length > 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <Loader2 className="animate-spin text-accent" size={48} />
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Vaga não encontrada</h1>
            <Button asChild>
              <Link to="/vagas">Ver todas as vagas</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const requirements = parseTextToList(job.requirements);
  const responsibilities = parseTextToList(job.responsibilities);
  const benefits = parseTextToList(job.benefits);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-hero-gradient py-16">
          <div className="container mx-auto px-4">
            <Link
              to="/vagas"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ChevronLeft size={18} />
              Voltar para vagas
            </Link>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-1.5 bg-primary-foreground/20 text-primary-foreground text-sm font-semibold rounded-full">
                {job.type}
              </span>
              <span className="px-4 py-1.5 bg-primary-foreground/20 text-primary-foreground text-sm font-semibold rounded-full">
                {job.level}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-primary-foreground/80">
              <span className="flex items-center gap-2">
                <Briefcase size={18} />
                {job.area}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={18} />
                {job.city}, {job.state}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} />
                Publicada em {new Date(job.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                  <h2 className="font-bold text-xl text-foreground mb-4">Descrição da Vaga</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </div>

                {/* Requirements */}
                {requirements.length > 0 && (
                  <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                    <h2 className="font-bold text-xl text-foreground mb-4">Requisitos</h2>
                    <ul className="space-y-3">
                      {requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <CheckCircle className="text-accent flex-shrink-0 mt-0.5" size={18} />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Responsibilities */}
                {responsibilities.length > 0 && (
                  <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                    <h2 className="font-bold text-xl text-foreground mb-4">Responsabilidades</h2>
                    <ul className="space-y-3">
                      {responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <CheckCircle className="text-accent flex-shrink-0 mt-0.5" size={18} />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {benefits.length > 0 && (
                  <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                    <h2 className="font-bold text-xl text-foreground mb-4">Benefícios</h2>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground">
                          <CheckCircle className="text-accent flex-shrink-0" size={18} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-8 shadow-card border border-border sticky top-28">
                  <h3 className="font-bold text-lg text-foreground mb-6">Interessado na vaga?</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Candidate-se agora e faça parte do nosso banco de talentos. Nossa equipe entrará em contato com você.
                  </p>
                  {job.external_form_url ? (
                    <Button size="lg" className="w-full mb-4" asChild>
                      <a href={job.external_form_url} target="_blank" rel="noopener noreferrer">
                        Candidatar-se
                      </a>
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full mb-4" onClick={() => navigate(`/candidatura/${job.slug}`)}>
                      Candidatar-se
                    </Button>
                  )}
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <a
                      href={`https://wa.me/5581981985374?text=Olá! Tenho interesse na vaga de ${encodeURIComponent(job.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Falar no WhatsApp
                    </a>
                  </Button>

                  <div className="mt-8 pt-8 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-4">Resumo da vaga</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Área</span>
                        <span className="text-foreground font-medium">{job.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo</span>
                        <span className="text-foreground font-medium">{job.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nível</span>
                        <span className="text-foreground font-medium">{job.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Local</span>
                        <span className="text-foreground font-medium">{job.city}, {job.state}</span>
                      </div>
                      {job.salary_range && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Salário</span>
                          <span className="text-foreground font-medium">{job.salary_range}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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

export default VagaDetalhes;
