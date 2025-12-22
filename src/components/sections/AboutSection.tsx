import { Target, Users, TrendingUp, Award } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Foco Estratégico",
    description: "Processos seletivos alinhados às necessidades reais do seu negócio."
  },
  {
    icon: Users,
    title: "Gestão de Talentos",
    description: "Banco de talentos organizado e sempre atualizado para agilizar contratações."
  },
  {
    icon: TrendingUp,
    title: "Resultados Mensuráveis",
    description: "Indicadores claros de performance e qualidade nas contratações."
  },
  {
    icon: Award,
    title: "Excelência",
    description: "Compromisso com a qualidade e satisfação de clientes e candidatos."
  }
];

export function AboutSection() {
  return (
    <section id="quem-somos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Quem Somos</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 leading-tight">
                Consultoria especializada em <span className="text-accent">conectar pessoas</span> e oportunidades
              </h2>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              A <strong className="text-foreground">RecrutaMente</strong> é uma consultoria de Recursos Humanos focada em Recrutamento e Seleção estratégico e gestão inteligente de banco de talentos.
            </p>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Nosso compromisso é entregar candidatos qualificados com agilidade, utilizando metodologias modernas de triagem técnica e comportamental. Acreditamos que pessoas são o maior ativo de qualquer organização.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-foreground">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Recrutamento Humanizado</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Processos Ágeis</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Orientação a Resultados</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-gradient transition-all duration-300">
                  <feature.icon className="text-accent group-hover:text-primary-foreground transition-colors" size={28} />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
