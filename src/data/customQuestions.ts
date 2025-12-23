export interface CustomQuestion {
  id: string;
  label: string;
  type: "select";
  options: string[];
}

export interface CustomQuestionSection {
  id: string;
  title: string;
  questions: CustomQuestion[];
}

export const customQuestionsSections: CustomQuestionSection[] = [
  {
    id: "dados_profissionais",
    title: "🔹 1. Dados Profissionais",
    questions: [
      {
        id: "nivel_vaga",
        label: "Qual nível da vaga para a qual está se candidatando?",
        type: "select",
        options: [
          "Estágio",
          "Trainee",
          "Operacional",
          "Administrativo",
          "Técnico",
          "Analista",
          "Supervisor",
          "Coordenador",
          "Gerente",
          "Diretor",
          "CEO / Alta Liderança"
        ]
      },
      {
        id: "area_atuacao",
        label: "Área principal de atuação desejada:",
        type: "select",
        options: [
          "Administrativo",
          "Financeiro / Contábil",
          "Gestão / Estratégia",
          "Tecnologia da Informação (TI)",
          "Comercial / Vendas",
          "Operacional",
          "RH",
          "Outra área"
        ]
      }
    ]
  },
  {
    id: "formacao_academica",
    title: "🔹 2. Formação Acadêmica",
    questions: [
      {
        id: "escolaridade",
        label: "Nível de escolaridade:",
        type: "select",
        options: [
          "Ensino Médio",
          "Técnico",
          "Superior em andamento",
          "Superior completo",
          "Pós-graduação / MBA",
          "Mestrado / Doutorado"
        ]
      },
      {
        id: "area_formacao",
        label: "Área de formação (se aplicável):",
        type: "select",
        options: [
          "Administração",
          "Contabilidade",
          "Economia",
          "Engenharia",
          "Tecnologia da Informação",
          "Gestão Empresarial",
          "Outra"
        ]
      }
    ]
  },
  {
    id: "conhecimentos_tecnicos",
    title: "🔹 3. Conhecimentos Técnicos Gerais",
    questions: [
      {
        id: "pacote_office",
        label: "Conhecimento no Pacote Office (Word, Excel, PowerPoint):",
        type: "select",
        options: ["Nenhum", "Básico", "Intermediário", "Avançado"]
      },
      {
        id: "nivel_excel",
        label: "Nível de Excel:",
        type: "select",
        options: [
          "Básico (fórmulas simples)",
          "Intermediário (PROCV/XLOOKUP, tabelas dinâmicas)",
          "Avançado (Power BI, VBA, Power Query)"
        ]
      },
      {
        id: "analise_dados",
        label: "Conhecimento em análise de dados e indicadores (KPIs):",
        type: "select",
        options: ["Nenhum", "Básico", "Intermediário", "Avançado"]
      }
    ]
  },
  {
    id: "financeiro_administrativo",
    title: "🔹 4. Financeiro / Administrativo",
    questions: [
      {
        id: "financas_corporativas",
        label: "Conhecimento em Finanças Corporativas:",
        type: "select",
        options: ["Nenhum", "Básico", "Intermediário", "Avançado"]
      },
      {
        id: "contabilidade",
        label: "Conhecimento em Contabilidade e demonstrativos financeiros:",
        type: "select",
        options: ["Nenhum", "Básico", "Intermediário", "Avançado"]
      },
      {
        id: "orcamento_fluxo",
        label: "Experiência com orçamento, fluxo de caixa ou DRE:",
        type: "select",
        options: ["Não possuo", "Básica", "Intermediária", "Avançada"]
      }
    ]
  },
  {
    id: "tecnologia_informacao",
    title: "🔹 5. Tecnologia da Informação (TI)",
    questions: [
      {
        id: "conhecimento_ti",
        label: "Nível de conhecimento em TI / Sistemas:",
        type: "select",
        options: ["Nenhum", "Básico", "Intermediário", "Avançado"]
      },
      {
        id: "experiencia_erp",
        label: "Experiência com sistemas ERP (SAP, TOTVS, Oracle, etc.):",
        type: "select",
        options: ["Nenhuma", "Básica", "Intermediária", "Avançada"]
      },
      {
        id: "automacao_bi",
        label: "Conhecimento em automação, programação ou BI:",
        type: "select",
        options: ["Nenhum", "Básico", "Intermediário", "Avançado"]
      }
    ]
  },
  {
    id: "experiencia_profissional",
    title: "🔹 6. Experiência Profissional",
    questions: [
      {
        id: "tempo_experiencia",
        label: "Tempo total de experiência profissional:",
        type: "select",
        options: [
          "Sem experiência",
          "Até 1 ano",
          "1 a 3 anos",
          "3 a 5 anos",
          "Mais de 5 anos"
        ]
      },
      {
        id: "experiencia_area",
        label: "Experiência na área da vaga:",
        type: "select",
        options: ["Nenhuma", "Básica", "Intermediária", "Avançada"]
      }
    ]
  },
  {
    id: "lideranca_gestao",
    title: "🔹 7. Liderança e Gestão",
    questions: [
      {
        id: "lideranca_equipes",
        label: "Possui experiência com liderança de equipes?",
        type: "select",
        options: [
          "Não",
          "Sim, equipes pequenas",
          "Sim, equipes médias",
          "Sim, equipes grandes"
        ]
      },
      {
        id: "tomada_decisao",
        label: "Nível de responsabilidade por tomada de decisão:",
        type: "select",
        options: ["Nenhuma", "Operacional", "Tática", "Estratégica"]
      },
      {
        id: "planejamento_estrategico",
        label: "Experiência com planejamento estratégico ou gestão de metas:",
        type: "select",
        options: ["Nenhuma", "Básica", "Intermediária", "Avançada"]
      },
      {
        id: "gestao_orcamento",
        label: "Experiência com gestão de orçamento ou resultados:",
        type: "select",
        options: ["Nenhuma", "Básica", "Intermediária", "Avançada"]
      }
    ]
  },
  {
    id: "competencias_comportamentais",
    title: "🔹 8. Competências Comportamentais",
    questions: [
      {
        id: "trabalho_equipe",
        label: "Capacidade de trabalhar em equipe:",
        type: "select",
        options: ["Básica", "Boa", "Muito boa", "Excelente"]
      },
      {
        id: "lideranca_influencia",
        label: "Capacidade de liderança e influência:",
        type: "select",
        options: ["Nenhuma", "Básica", "Intermediária", "Avançada"]
      },
      {
        id: "organizacao_tempo",
        label: "Organização, disciplina e gestão do tempo:",
        type: "select",
        options: ["Básica", "Intermediária", "Avançada"]
      },
      {
        id: "comunicacao",
        label: "Comunicação verbal e escrita:",
        type: "select",
        options: ["Básica", "Intermediária", "Avançada"]
      }
    ]
  },
  {
    id: "idiomas",
    title: "🔹 9. Idiomas",
    questions: [
      {
        id: "ingles",
        label: "Conhecimento em inglês:",
        type: "select",
        options: ["Nenhum", "Básico", "Intermediário", "Avançado / Fluente"]
      },
      {
        id: "outros_idiomas",
        label: "Outros idiomas:",
        type: "select",
        options: ["Nenhum", "Básico", "Intermediário", "Avançado"]
      }
    ]
  },
  {
    id: "disponibilidade",
    title: "🔹 10. Disponibilidade",
    questions: [
      {
        id: "disponibilidade_inicio",
        label: "Disponibilidade para início:",
        type: "select",
        options: ["Imediata", "Até 15 dias", "Até 30 dias", "Acima de 30 dias"]
      },
      {
        id: "disponibilidade_horario",
        label: "Disponibilidade de horário:",
        type: "select",
        options: ["Horário comercial", "Flexível", "Turnos / Escala"]
      }
    ]
  },
  {
    id: "pretensao_interesse",
    title: "🔹 11. Pretensão e Interesse",
    questions: [
      {
        id: "pretensao_salarial",
        label: "Pretensão salarial:",
        type: "select",
        options: [
          "Até R$ 2.000",
          "R$ 2.000 a R$ 4.000",
          "R$ 4.000 a R$ 6.000",
          "R$ 6.000 a R$ 10.000",
          "R$ 10.000 a R$ 15.000",
          "R$ 15.000 a R$ 25.000",
          "Acima de R$ 25.000",
          "A combinar"
        ]
      },
      {
        id: "ultima_remuneracao",
        label: "Qual sua última remuneração?",
        type: "select",
        options: [
          "Até R$ 2.000",
          "R$ 2.000 a R$ 4.000",
          "R$ 4.000 a R$ 6.000",
          "R$ 6.000 a R$ 10.000",
          "R$ 10.000 a R$ 15.000",
          "R$ 15.000 a R$ 25.000",
          "Acima de R$ 25.000",
          "Prefiro não informar"
        ]
      },
      {
        id: "modalidade_trabalho",
        label: "Disponibilidade para trabalho remoto ou híbrido:",
        type: "select",
        options: ["Presencial", "Híbrido", "Remoto"]
      }
    ]
  },
  {
    id: "autopercepcao_fit",
    title: "🔹 12. Autopercepção e Fit",
    questions: [
      {
        id: "aderencia_vaga",
        label: "Como você avalia seu nível de aderência à vaga?",
        type: "select",
        options: ["Baixo", "Médio", "Alto", "Muito alto"]
      },
      {
        id: "interesse_crescimento",
        label: "Interesse em crescimento e desenvolvimento na empresa:",
        type: "select",
        options: ["Baixo", "Médio", "Alto", "Muito alto"]
      }
    ]
  },
  {
    id: "cultura_valores",
    title: "🔹 13. Cultura e Valores",
    questions: [
      {
        id: "estilo_trabalho",
        label: "Qual seu estilo de trabalho preferido?",
        type: "select",
        options: [
          "Trabalho individual com autonomia",
          "Trabalho em equipe com colaboração constante",
          "Misto - autonomia com pontos de colaboração",
          "Liderança de projetos/equipes"
        ]
      },
      {
        id: "ambiente_preferido",
        label: "Que tipo de ambiente de trabalho você prefere?",
        type: "select",
        options: [
          "Ambiente estruturado com processos definidos",
          "Ambiente dinâmico com mudanças frequentes",
          "Startup/ambiente inovador com riscos",
          "Ambiente tradicional e estável"
        ]
      },
      {
        id: "motivacao_principal",
        label: "O que mais te motiva no trabalho?",
        type: "select",
        options: [
          "Crescimento de carreira e promoções",
          "Remuneração e benefícios",
          "Aprendizado e novos desafios",
          "Propósito e impacto social",
          "Equilíbrio vida pessoal/profissional"
        ]
      },
      {
        id: "pressao_prazos",
        label: "Como você lida com pressão e prazos apertados?",
        type: "select",
        options: [
          "Muito bem - me motiva a produzir mais",
          "Bem - consigo me organizar e entregar",
          "Razoavelmente - preciso de suporte",
          "Com dificuldade - prefiro prazos confortáveis"
        ]
      },
      {
        id: "feedback_preferencia",
        label: "Como você prefere receber feedback?",
        type: "select",
        options: [
          "Direto e objetivo, mesmo se for crítico",
          "Construtivo e com sugestões de melhoria",
          "Em conversas periódicas (1:1)",
          "Por escrito para refletir depois"
        ]
      },
      {
        id: "conflitos",
        label: "Como você geralmente resolve conflitos no trabalho?",
        type: "select",
        options: [
          "Diálogo direto com a pessoa envolvida",
          "Mediação com gestor ou RH",
          "Evito conflitos e busco consenso",
          "Análise racional focada na solução"
        ]
      },
      {
        id: "mudancas",
        label: "Como você reage a mudanças inesperadas?",
        type: "select",
        options: [
          "Me adapto rapidamente sem problemas",
          "Preciso de um tempo para ajustar",
          "Prefiro mudanças planejadas",
          "Tenho dificuldade com mudanças"
        ]
      },
      {
        id: "etica_dilema",
        label: "Diante de um dilema ético no trabalho, você:",
        type: "select",
        options: [
          "Reporta imediatamente à liderança",
          "Busca orientação antes de agir",
          "Tenta resolver discretamente",
          "Avalia as consequências antes de decidir"
        ]
      }
    ]
  }
];

// Helper function to get all questions flat
export const getAllQuestions = (): CustomQuestion[] => {
  return customQuestionsSections.flatMap(section => section.questions);
};

// Helper function to get question by ID
export const getQuestionById = (id: string): CustomQuestion | undefined => {
  return getAllQuestions().find(q => q.id === id);
};

// Helper function to get question label by ID
export const getQuestionLabel = (id: string): string => {
  const question = getQuestionById(id);
  return question?.label || id;
};
