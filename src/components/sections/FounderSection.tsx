import { MapPin, Award, Linkedin } from "lucide-react";
import founderPhoto from "@/assets/founder-photo.jpeg";
export const FounderSection = () => {
  return <section id="quem-somos" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-4">
            Quem Somos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Conheça Nossa História
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Uma trajetória de mais de 15 anos construindo resultados sólidos e parcerias duradouras.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Photo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 sm:w-80 rounded-3xl overflow-hidden shadow-2xl bg-muted">
                <img src={founderPhoto} alt="Fundador da Recrutamente" className="w-full h-auto" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-2xl -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-2xl -z-10"></div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Award className="text-accent" size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-foreground">Denys Lira</h3>
                  <a 
                    href="https://www.linkedin.com/in/denyslira" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 transition-colors"
                    aria-label="LinkedIn de Denys Lira"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
                <p className="text-muted-foreground text-sm">Fundador</p>
              </div>
            </div>

            <p className="text-foreground leading-relaxed">Fundador, com mais de 15 anos de experiência profissional nas áreas de jurídico consultivo, gestão de carteira de clientes, consultoria em gestão financeira estratégica, valuation, M&A (Fusões e Aquisições) e gestão de pessoas.<span className="font-semibold text-accent">15 anos de experiência profissional</span> nas áreas de jurídico consultivo, gestão de carteira de clientes, consultoria em gestão financeira estratégica, valuation, M&A (Fusões e Aquisições) e gestão de pessoas.
            </p>

            <p className="text-foreground leading-relaxed">
              Profissional orientado a resultados, com atuação em empresas de grande porte e relevância nacional e internacional, como <span className="font-semibold">Thomson Reuters, Ortobom, Grupo Infinity, Grupo Ser Educacional, Câmara Ítalo-Brasileira de Comércio e Indústria, Grow, Fiplan e Orizon Valorização de Resíduos</span>, liderando projetos, estruturando equipes e desenvolvendo soluções estratégicas voltadas ao crescimento sustentável.
            </p>

            <p className="text-foreground leading-relaxed">
              Em 2025, iniciei uma nova fase ao empreender na área de consultoria e serviços. Atualmente, sou proprietário de um escritório com foco em <span className="font-semibold text-accent">soluções estratégicas para empresas, profissionais e empreendedores</span>.
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Localização</p>
                <p className="text-foreground font-medium">Paulista/PE - Região Metropolitana do Recife</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              {["Jurídico Consultivo", "Gestão Financeira", "M&A", "Gestão de Pessoas", "Valuation"].map(skill => <span key={skill} className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-full">
                  {skill}
                </span>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};