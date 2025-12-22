import { Zap, Heart, Clock, Coins } from "lucide-react";

const differentials = [
  {
    icon: Zap,
    title: "Banco de Talentos Organizado e Filtrável",
    description: "Acesso rápido a candidatos qualificados através de filtros inteligentes por área, experiência e competências."
  },
  {
    icon: Clock,
    title: "Agilidade na Entrega",
    description: "Processos otimizados para entregar candidatos qualificados no menor tempo possível, sem perder qualidade."
  },
  {
    icon: Heart,
    title: "Processo Humanizado",
    description: "Recrutamento estratégico que valoriza as pessoas, garantindo uma experiência positiva para candidatos e empresas."
  },
  {
    icon: Coins,
    title: "Redução de Custos",
    description: "Otimização do tempo e recursos investidos em contratações, reduzindo turnover e custos operacionais."
  }
];

export function DifferentialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Diferenciais</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Por que escolher a <span className="text-accent">RecrutaMente</span>?
          </h2>
          <p className="text-muted-foreground text-lg">
            Nossa metodologia combina tecnologia, expertise e um olhar humanizado para entregar os melhores resultados.
          </p>
        </div>

        {/* Differentials */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentials.map((item, index) => (
            <div
              key={item.title}
              className="text-center group"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-gradient group-hover:scale-110 transition-all duration-300">
                <item.icon className="text-accent group-hover:text-primary-foreground transition-colors" size={36} />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
