export interface Job {
  id: string;
  title: string;
  area: string;
  city: string;
  state: string;
  type: "CLT" | "PJ" | "Temporário";
  level: "Júnior" | "Pleno" | "Sênior";
  description: string;
  requirements: string[];
  benefits: string[];
  responsibilities: string[];
  createdAt: string;
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Analista de Recursos Humanos",
    area: "Recursos Humanos",
    city: "Recife",
    state: "PE",
    type: "CLT",
    level: "Pleno",
    description: "Buscamos um profissional dinâmico para atuar na área de Recursos Humanos, com foco em recrutamento e seleção, desenvolvimento organizacional e gestão de pessoas.",
    requirements: [
      "Graduação em Psicologia, Administração ou áreas afins",
      "Experiência mínima de 3 anos na área de RH",
      "Conhecimento em técnicas de recrutamento e seleção",
      "Excel intermediário/avançado"
    ],
    benefits: [
      "Vale Alimentação",
      "Plano de Saúde",
      "Vale Transporte",
      "Gympass"
    ],
    responsibilities: [
      "Conduzir processos seletivos completos",
      "Desenvolver e aplicar programas de treinamento",
      "Acompanhar indicadores de RH",
      "Apoiar gestores nas demandas de pessoas"
    ],
    createdAt: "2024-12-20"
  },
  {
    id: "2",
    title: "Desenvolvedor Full Stack",
    area: "Tecnologia",
    city: "São Paulo",
    state: "SP",
    type: "PJ",
    level: "Sênior",
    description: "Procuramos desenvolvedor experiente para atuar em projetos desafiadores, utilizando tecnologias modernas e metodologias ágeis.",
    requirements: [
      "Experiência com React, Node.js e TypeScript",
      "Conhecimento em bancos de dados SQL e NoSQL",
      "Experiência com metodologias ágeis",
      "Inglês intermediário"
    ],
    benefits: [
      "Trabalho 100% remoto",
      "Horário flexível",
      "Auxílio home office",
      "Cursos e certificações"
    ],
    responsibilities: [
      "Desenvolver aplicações web escaláveis",
      "Participar de code reviews",
      "Colaborar com equipe de produto",
      "Documentar soluções técnicas"
    ],
    createdAt: "2024-12-18"
  },
  {
    id: "3",
    title: "Assistente Administrativo",
    area: "Administrativo",
    city: "Olinda",
    state: "PE",
    type: "CLT",
    level: "Júnior",
    description: "Oportunidade para profissional organizado e proativo para atuar na área administrativa, dando suporte às operações diárias da empresa.",
    requirements: [
      "Ensino médio completo",
      "Conhecimento em pacote Office",
      "Boa comunicação verbal e escrita",
      "Organização e proatividade"
    ],
    benefits: [
      "Vale Alimentação",
      "Vale Transporte",
      "Seguro de vida",
      "Oportunidade de crescimento"
    ],
    responsibilities: [
      "Organizar documentos e arquivos",
      "Atender telefonemas e e-mails",
      "Apoiar nas rotinas administrativas",
      "Controlar agenda e compromissos"
    ],
    createdAt: "2024-12-15"
  },
  {
    id: "4",
    title: "Gerente Comercial",
    area: "Vendas",
    city: "Recife",
    state: "PE",
    type: "CLT",
    level: "Sênior",
    description: "Liderança de equipe comercial para expansão de mercado e desenvolvimento de novos negócios na região Nordeste.",
    requirements: [
      "Graduação em Administração, Marketing ou áreas afins",
      "Experiência mínima de 5 anos em gestão comercial",
      "Habilidade em negociação e liderança",
      "CNH categoria B"
    ],
    benefits: [
      "Salário + comissão",
      "Veículo da empresa",
      "Plano de Saúde e Odontológico",
      "Bônus por resultados"
    ],
    responsibilities: [
      "Liderar equipe de vendas",
      "Desenvolver estratégias comerciais",
      "Prospectar novos clientes",
      "Acompanhar metas e resultados"
    ],
    createdAt: "2024-12-12"
  },
  {
    id: "5",
    title: "Designer Gráfico",
    area: "Marketing",
    city: "João Pessoa",
    state: "PB",
    type: "Temporário",
    level: "Pleno",
    description: "Criação de materiais visuais para campanhas de marketing digital e impressos, com foco em identidade visual e branding.",
    requirements: [
      "Formação em Design Gráfico ou áreas afins",
      "Domínio de Adobe Creative Suite",
      "Portfólio com trabalhos anteriores",
      "Criatividade e senso estético"
    ],
    benefits: [
      "Vale Alimentação",
      "Possibilidade de efetivação",
      "Ambiente criativo",
      "Horário flexível"
    ],
    responsibilities: [
      "Criar peças para redes sociais",
      "Desenvolver materiais impressos",
      "Manter identidade visual da marca",
      "Colaborar com equipe de marketing"
    ],
    createdAt: "2024-12-10"
  }
];

export const areas = [...new Set(jobs.map(job => job.area))];
export const cities = [...new Set(jobs.map(job => job.city))];
export const states = [...new Set(jobs.map(job => job.state))];
export const types: Job["type"][] = ["CLT", "PJ", "Temporário"];
export const levels: Job["level"][] = ["Júnior", "Pleno", "Sênior"];
