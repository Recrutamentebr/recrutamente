import { Link } from "react-router-dom";
import { ArrowRight, Users, Briefcase, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-light rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-32 lg:py-40 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-primary-foreground space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-full border border-primary-foreground/20">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">Consultoria Especializada em RH</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Conectamos talentos qualificados às{" "}
              <span className="text-sky-light">oportunidades certas</span>
            </h1>

            <p className="text-lg sm:text-xl text-primary-foreground/85 max-w-xl leading-relaxed">
              Recrutamento estratégico e gestão inteligente de banco de talentos para acelerar suas contratações com precisão e eficiência.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/empresas">
                  <Briefcase size={20} />
                  Sou Empresa
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/vagas">
                  <Users size={20} />
                  Sou Candidato
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/20">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-sky-light">500+</div>
                <div className="text-sm text-primary-foreground/70">Talentos Cadastrados</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-sky-light">150+</div>
                <div className="text-sm text-primary-foreground/70">Empresas Atendidas</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-sky-light">95%</div>
                <div className="text-sm text-primary-foreground/70">Satisfação</div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="hidden lg:flex justify-center items-center animate-fade-in-right" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Main Card */}
              <div className="bg-card/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-accent-gradient rounded-2xl flex items-center justify-center">
                    <Users className="text-primary-foreground" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Banco de Talentos</h3>
                    <p className="text-muted-foreground text-sm">Gestão inteligente</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "Desenvolvedor Full Stack", status: "5 candidatos", color: "bg-accent" },
                    { name: "Analista de RH", status: "3 candidatos", color: "bg-sky" },
                    { name: "Gerente Comercial", status: "8 candidatos", color: "bg-accent" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="font-medium text-foreground text-sm">{item.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-accent-gradient text-primary-foreground px-6 py-3 rounded-2xl shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} />
                  <span className="font-semibold">Vagas Abertas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
