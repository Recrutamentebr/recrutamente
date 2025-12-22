import { UserSearch, Database, ClipboardCheck, Building2 } from "lucide-react";

const services = [
  {
    icon: UserSearch,
    title: "Recrutamento e Seleção Estratégico",
    description: "Processos seletivos personalizados para encontrar os candidatos ideais para cada posição, utilizando as melhores práticas de mercado.",
    features: ["Hunting de talentos", "Entrevistas por competências", "Análise de fit cultural"]
  },
  {
    icon: Database,
    title: "Gestão de Banco de Talentos",
    description: "Organização e manutenção de banco de candidatos qualificados, prontos para serem acionados quando surgir uma oportunidade.",
    features: ["Cadastro organizado", "Filtros inteligentes", "Atualização contínua"]
  },
  {
    icon: ClipboardCheck,
    title: "Triagem Técnica e Comportamental",
    description: "Avaliação completa dos candidatos através de testes técnicos, dinâmicas e análises comportamentais.",
    features: ["Testes de habilidades", "Avaliação de perfil", "Dinâmicas de grupo"]
  },
  {
    icon: Building2,
    title: "Consultoria em RH para Empresas",
    description: "Suporte estratégico para estruturação e otimização dos processos de recursos humanos da sua empresa.",
    features: ["Diagnóstico organizacional", "Plano de cargos", "Políticas de RH"]
  }
];

export function ServicesSection() {
  return (
    <section id="servicos" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Nossos Serviços</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Soluções completas em <span className="text-accent">gestão de pessoas</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Oferecemos um portfólio completo de serviços para atender todas as suas demandas de recrutamento e gestão de talentos.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="bg-card rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group hover:-translate-y-1"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-accent-gradient rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="text-primary-foreground" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-xl mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
