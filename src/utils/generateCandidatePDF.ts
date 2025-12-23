import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import logoRecrutamente from "@/assets/logo-recrutamente.png";

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  education_level: string;
  experience: string;
  salary_expectation: string | null;
  availability: string | null;
  expectations: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  additional_info: string | null;
  resume_url: string | null;
  status: string;
  created_at: string;
  custom_answers: Record<string, string> | null;
}

interface Job {
  id: string;
  title: string;
  area: string;
  city: string;
  state: string;
  level?: string;
}

// Score mapping for analysis
const scoreMapping: Record<string, number> = {
  "Nenhum": 0, "Básico": 25, "Intermediário": 50, "Avançado": 75, "Avançado / Fluente": 100,
  "Nenhuma": 0, "Básica": 25, "Intermediária": 50, "Avançada": 75,
  "Boa": 50, "Muito boa": 75, "Excelente": 100,
  "Não": 0, "Sim, equipes pequenas": 33, "Sim, equipes médias": 66, "Sim, equipes grandes": 100,
  "Operacional": 33, "Tática": 66, "Estratégica": 100,
  "Sem experiência": 0, "Até 1 ano": 25, "1 a 3 anos": 50, "3 a 5 anos": 75, "Mais de 5 anos": 100,
  "Imediata": 100, "Até 15 dias": 75, "Até 30 dias": 50, "Acima de 30 dias": 25,
  "Baixo": 25, "Médio": 50, "Alto": 75, "Muito alto": 100,
  "Básico (fórmulas simples)": 25, "Intermediário (PROCV/XLOOKUP, tabelas dinâmicas)": 50,
  "Avançado (Power BI, VBA, Power Query)": 100,
  // Cultura
  "Trabalho individual com autonomia": 75, "Trabalho em equipe com colaboração constante": 75,
  "Misto - autonomia com pontos de colaboração": 100, "Liderança de projetos/equipes": 100,
  "Ambiente estruturado com processos definidos": 75, "Ambiente dinâmico com mudanças frequentes": 75,
  "Startup/ambiente inovador com riscos": 75, "Ambiente tradicional e estável": 75,
  "Crescimento de carreira e promoções": 75, "Remuneração e benefícios": 75,
  "Aprendizado e novos desafios": 100, "Propósito e impacto social": 100, "Equilíbrio vida pessoal/profissional": 75,
  "Muito bem - me motiva a produzir mais": 100, "Bem - consigo me organizar e entregar": 75,
  "Razoavelmente - preciso de suporte": 50, "Com dificuldade - prefiro prazos confortáveis": 25,
  "Direto e objetivo, mesmo se for crítico": 100, "Construtivo e com sugestões de melhoria": 100,
  "Em conversas periódicas (1:1)": 75, "Por escrito para refletir depois": 75,
  "Diálogo direto com a pessoa envolvida": 100, "Mediação com gestor ou RH": 75,
  "Evito conflitos e busco consenso": 50, "Análise racional focada na solução": 100,
  "Me adapto rapidamente sem problemas": 100, "Preciso de um tempo para ajustar": 75,
  "Prefiro mudanças planejadas": 50, "Tenho dificuldade com mudanças": 25,
  "Reporta imediatamente à liderança": 100, "Busca orientação antes de agir": 100,
  "Tenta resolver discretamente": 50, "Avalia as consequências antes de decidir": 75,
};

const categoryQuestions: Record<string, string[]> = {
  "Técnico": ["pacote_office", "nivel_excel", "analise_dados", "conhecimento_ti", "experiencia_erp", "automacao_bi"],
  "Experiência": ["tempo_experiencia", "experiencia_area"],
  "Liderança": ["lideranca_equipes", "tomada_decisao", "planejamento_estrategico", "gestao_orcamento"],
  "Comportamental": ["trabalho_equipe", "lideranca_influencia", "organizacao_tempo", "comunicacao"],
  "Financeiro": ["financas_corporativas", "contabilidade", "orcamento_fluxo"],
  "Idiomas": ["ingles", "outros_idiomas"],
  "Cultura": ["estilo_trabalho", "ambiente_preferido", "motivacao_principal", "pressao_prazos", "feedback_preferencia", "conflitos", "mudancas", "etica_dilema"],
};

const getScore = (answer: string): number => {
  if (scoreMapping[answer] !== undefined) return scoreMapping[answer];
  const lowerAnswer = answer.toLowerCase();
  if (lowerAnswer.includes("avançad") || lowerAnswer.includes("fluente")) return 100;
  if (lowerAnswer.includes("intermediári")) return 50;
  if (lowerAnswer.includes("básic")) return 25;
  if (lowerAnswer.includes("nenhum") || lowerAnswer.includes("não")) return 0;
  return 50;
};

export const calculateAnalysisData = (customAnswers: Record<string, string> | null) => {
  if (!customAnswers || Object.keys(customAnswers).length === 0) {
    return {
      radarData: [],
      barData: [],
      overallScore: 0,
      recommendation: "Dados insuficientes para análise",
    };
  }

  const categoryScores: Array<{ category: string; score: number; fullMark: number }> = [];

  Object.entries(categoryQuestions).forEach(([category, questionIds]) => {
    const answeredQuestions = questionIds.filter(qId => customAnswers[qId]);
    if (answeredQuestions.length === 0) return;

    const totalScore = answeredQuestions.reduce((sum, qId) => {
      const answer = customAnswers[qId];
      return sum + getScore(answer);
    }, 0);

    const avgScore = Math.round(totalScore / answeredQuestions.length);
    categoryScores.push({ category, score: avgScore, fullMark: 100 });
  });

  const overall = categoryScores.length > 0
    ? Math.round(categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categoryScores.length)
    : 0;

  let rec = "";
  if (overall >= 80) rec = "Candidato altamente qualificado. Recomendado para entrevista imediata.";
  else if (overall >= 60) rec = "Candidato com bom potencial. Recomendado para próxima fase.";
  else if (overall >= 40) rec = "Candidato com perfil parcialmente aderente. Avaliar pontos específicos.";
  else rec = "Candidato com baixa aderência ao perfil da vaga.";

  return {
    radarData: categoryScores,
    barData: categoryScores.map(cat => ({
      ...cat,
      fill: cat.score >= 70 ? "#22c55e" : cat.score >= 40 ? "#3b82f6" : "#6b7280",
    })),
    overallScore: overall,
    recommendation: rec,
  };
};

export const generateCandidatePDF = async (
  reportElement: HTMLElement,
  application: Application,
  _job: Job
): Promise<void> => {
  try {
    // Create canvas from the report element
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Calculate dimensions for A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.95),
      "JPEG",
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    // Generate filename
    const sanitizedName = application.full_name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `relatorio_${sanitizedName}_${new Date().toISOString().split("T")[0]}.pdf`;

    // Download PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// Simplified PDF generation for the candidate report - with smart page breaks
export const generateSimplePDF = async (
  reportElement: HTMLElement,
  candidateName: string,
  resumeUrl?: string | null
): Promise<void> => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const topMargin = 5; // Small top margin
    const footerHeight = 10; // Space for footer
    const usableHeight = pageHeight - topMargin - footerHeight;

    // Get all sections marked with data-section attribute
    const sections = reportElement.querySelectorAll('[data-section]');
    const containerWidth = reportElement.offsetWidth || 794;

    // Function to add footer
    const addPageFooter = () => {
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.text('Documento Confidencial • www.recrutamente.site', imgWidth / 2, pageHeight - 5, { align: 'center' });
    };

    if (sections.length === 0) {
      // Fallback: render full element and split by pages
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
      });

      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const totalPages = Math.ceil(imgHeight / usableHeight);
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        // Calculate source and destination positions
        const srcY = page * (canvas.height / totalPages);
        const srcHeight = canvas.height / totalPages;
        
        // Create a temporary canvas for this page portion
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = srcHeight;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(canvas, 0, srcY, canvas.width, srcHeight, 0, 0, canvas.width, srcHeight);
          
          pdf.addImage(
            tempCanvas.toDataURL("image/jpeg", 0.95),
            "JPEG",
            0,
            topMargin,
            imgWidth,
            usableHeight
          );
        }
        
        addPageFooter();
      }
    } else {
      // Smart section-based rendering
      const sectionGroups: HTMLElement[][] = [[]];
      let currentPageHeight = 0;

      // Calculate heights and group sections
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        const sectionHeightPx = section.offsetHeight;
        const sectionHeightMm = (sectionHeightPx * imgWidth) / containerWidth;

        // Check if section fits on current page (with some buffer)
        if (currentPageHeight + sectionHeightMm > usableHeight - 5 && sectionGroups[sectionGroups.length - 1].length > 0) {
          sectionGroups.push([]);
          currentPageHeight = 0;
        }

        sectionGroups[sectionGroups.length - 1].push(section);
        currentPageHeight += sectionHeightMm;
      }

      const totalPages = sectionGroups.length;

      // Render each page
      for (let pageIndex = 0; pageIndex < sectionGroups.length; pageIndex++) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        // No header needed - the HTML already has the logo

        const pageGroup = sectionGroups[pageIndex];
        
        // Create a temporary container for this page's sections
        const tempContainer = document.createElement('div');
        tempContainer.style.width = `${containerWidth}px`;
        tempContainer.style.backgroundColor = '#FFFFFF';
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.padding = '20px 56px';
        tempContainer.style.fontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
        tempContainer.style.boxSizing = 'border-box';
        document.body.appendChild(tempContainer);

        // Clone sections for this page
        for (const section of pageGroup) {
          const clonedSection = section.cloneNode(true) as HTMLElement;
          // Remove page break styles from cloned elements since we handle it manually
          clonedSection.style.pageBreakInside = 'auto';
          clonedSection.style.breakInside = 'auto';
          tempContainer.appendChild(clonedSection);
        }

        // Render the container
        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          allowTaint: true,
        });

        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          0,
          topMargin,
          imgWidth,
          Math.min(imgHeight, usableHeight)
        );

        // Remove temporary container
        document.body.removeChild(tempContainer);
        
        addPageFooter();
      }
    }

    // Add clickable link for resume if URL exists (on first page)
    if (resumeUrl) {
      pdf.setPage(1);
      const linkX = 45;
      const linkY = 165;
      const linkWidth = 120;
      const linkHeight = 20;
      pdf.link(linkX, linkY, linkWidth, linkHeight, { url: resumeUrl });
    }

    const sanitizedName = candidateName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `candidato_${sanitizedName}_${new Date().toISOString().split("T")[0]}.pdf`;

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// Bulk PDF generation - creates a single PDF with multiple candidates (2 per page)
export const generateBulkPDF = async (
  reportElement: HTMLElement,
  candidateCount: number
): Promise<void> => {
  try {
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const headerHeight = 20; // Space for logo header
    const footerHeight = 8; // Space for footer
    const usableHeight = pageHeight - headerHeight - footerHeight;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF("p", "mm", "a4");
    const totalPages = Math.ceil(imgHeight / usableHeight);

    // Load logo image as base64
    const loadLogoAsBase64 = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            reject(new Error('Could not get canvas context'));
          }
        };
        img.onerror = reject;
        img.src = logoRecrutamente;
      });
    };

    let logoBase64: string | null = null;
    try {
      logoBase64 = await loadLogoAsBase64();
    } catch (e) {
      console.warn('Could not load logo:', e);
    }

    // Function to add header with logo
    const addPageHeader = (pageNum: number) => {
      pdf.setFillColor(30, 58, 138);
      pdf.rect(0, 0, imgWidth, 3, 'F');
      
      // Add logo image
      if (logoBase64) {
        pdf.addImage(logoBase64, 'PNG', 10, 5, 30, 10);
      } else {
        // Fallback to text
        pdf.setFontSize(12);
        pdf.setTextColor(30, 58, 138);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RecrutaMente', 10, 12);
      }
      
      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Relatório de Candidatos • Página ${pageNum} de ${totalPages}`, imgWidth - 10, 12, { align: 'right' });
      
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.3);
      pdf.line(10, 16, imgWidth - 10, 16);
    };

    // Function to add footer
    const addPageFooter = () => {
      pdf.setFontSize(7);
      pdf.setTextColor(156, 163, 175);
      pdf.text('Documento Confidencial • www.recrutamente.site', imgWidth / 2, pageHeight - 4, { align: 'center' });
    };
    
    let heightLeft = imgHeight;
    let srcY = 0;
    let pageNum = 1;
    
    while (heightLeft > 0) {
      if (pageNum > 1) {
        pdf.addPage();
      }
      
      addPageHeader(pageNum);
      
      // Calculate how much of the source image to use for this page
      const srcHeightRatio = Math.min(usableHeight / imgHeight, heightLeft / imgHeight);
      const srcHeight = canvas.height * (usableHeight / imgHeight);
      
      // Create temporary canvas for this portion
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = Math.min(srcHeight, canvas.height - (srcY * canvas.height / imgHeight));
      const ctx = tempCanvas.getContext('2d');
      
      if (ctx) {
        const sourceY = srcY * canvas.height / imgHeight;
        ctx.drawImage(
          canvas, 
          0, sourceY, 
          canvas.width, tempCanvas.height, 
          0, 0, 
          canvas.width, tempCanvas.height
        );
        
        const pageImgHeight = (tempCanvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(
          tempCanvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          0,
          headerHeight,
          imgWidth,
          Math.min(pageImgHeight, usableHeight)
        );
      }
      
      addPageFooter();
      
      srcY += usableHeight;
      heightLeft -= usableHeight;
      pageNum++;
    }

    const filename = `candidatos_${candidateCount}_${new Date().toISOString().split("T")[0]}.pdf`;

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating bulk PDF:", error);
    throw error;
  }
};

export default generateCandidatePDF;
