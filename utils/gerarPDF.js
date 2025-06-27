import jsPDF from "jspdf";
import "jspdf-autotable";

// Função auxiliar para garantir texto seguro
const safeText = (text) => {
  if (text === undefined || text === null) return "";
  if (typeof text === 'number') return text.toLocaleString('pt-BR');
  if (typeof text !== 'string') return JSON.stringify(text);
  return text;
};

// Função para formatar moeda com tratamento de erros
const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const gerarPDF = (
  modoObra,
  labels = {},
  dadosCadastro = {},
  areaProjeto = "",
  descricaoProjeto = "",
  materiais = [],
  maoObraExecucao = [],
  maoObraInstalacao = [],
  itensServicos = [],
  acabamentoExtras = [],
  consumoDespesas = [],
  dadosFinais = {},
  observacoes = "",
  valorMateriais = 0,
  valorMaoObraExec = 0,
  valorMaoObraInst = 0,
  valorEngenharia = 0,
  valorItensServicos = 0,
  valorAcabamentoExtras = 0,
  valorConsumoDespesas = 0,
  custoTotal = 0,
  valorImposto = 0,
  valorLucro = 0,
  precoFinal = 0,
  pesoTotal = 0,
  precoPorKg = 0,
  precoPorUnidade = 0
) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    let yPosition = margin;

    // Função protegida para adicionar texto
    const addText = (text, x, y, options = {}) => {
      try {
        const textToAdd = safeText(text);
        const fontSize = Number(options.fontSize) || 10;
        const bold = Boolean(options.bold);
        const textColor = Array.isArray(options.textColor) ? options.textColor : [0, 0, 0];
        const align = ['left', 'center', 'right'].includes(options.align) ? options.align : 'left';
        const maxWidth = Number(options.maxWidth) || pageWidth - 2 * margin;
        const lineHeight = Number(options.lineHeight) || fontSize * 0.4;

        doc.setFontSize(fontSize);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setTextColor(...textColor);

        if (options.bgColor && Array.isArray(options.bgColor)) {
          doc.setFillColor(...options.bgColor);
          doc.rect(x - 2, y - 3, maxWidth, lineHeight, "F");
        }

        const textLines = doc.splitTextToSize(textToAdd, maxWidth);
        let currentY = y;
        
        textLines.forEach(line => {
          doc.text(line, x, currentY, { align });
          currentY += lineHeight;
        });

        return currentY + (Number(options.extraSpacing) || 1);
      } catch (error) {
        console.error("Erro em addText:", error);
        return y + 10;
      }
    };

    // Função para desenhar caixas
    const drawBox = (x, y, width, height, headerText) => {
      try {
        // Cabeçalho da caixa
        doc.setFillColor(147, 51, 234);
        doc.rect(x, y, width, 6, "F");
        addText(headerText, x + 2, y + 4, { 
          fontSize: 10, 
          bold: true, 
          textColor: [255, 255, 255] 
        });
        
        // Borda da caixa
        doc.setDrawColor(209, 213, 219);
        doc.rect(x, y, width, height);
        
        return y + 6;
      } catch (error) {
        console.error("Erro em drawBox:", error);
        return y;
      }
    };

    // Verificar quebra de página
    const checkPageBreak = (currentY, requiredSpace = 20) => {
      if (currentY + requiredSpace > doc.internal.pageSize.height - margin) {
        doc.addPage();
        return margin;
      }
      return currentY;
    };

    // Dados da empresa (com fallbacks)
    const empresa = {
      nome: safeText(dadosCadastro.empresaNome || "Sua Empresa"),
      cnpj: safeText(dadosCadastro.empresaCnpj || "00.000.000/0000-00"),
      endereco: {
        rua: safeText(dadosCadastro.empresaEnderecoRua || "Rua Exemplo"),
        numero: safeText(dadosCadastro.empresaEnderecoNumero || "123"),
        cidade: safeText(dadosCadastro.empresaEnderecoCidade || "São Paulo"),
        estado: safeText(dadosCadastro.empresaEnderecoEstado || "SP"),
      },
      telefone: safeText(dadosCadastro.empresaTelefone || "(11) 1234-5678"),
      logoChar: safeText(dadosCadastro.empresaLogoChar || "LOGO"),
    };

    // Dados gerais do documento
    const dadosGerais = {
      numeroOrdem: safeText(dadosCadastro.numeroOrdem || `001/${new Date().getFullYear()}`),
      data: safeText(dadosCadastro.dataOrcamento || new Date().toLocaleDateString('pt-BR')),
      dataEntrega: safeText(dadosCadastro.dataEntrega || new Date().toLocaleDateString('pt-BR')),
    };

    // Dados do cliente
    const enderecoCliente = (dadosCadastro.endereco || "Rua do Cliente,S/N,Cidade,Estado").split(',');
    const cliente = {
      nome: safeText(dadosCadastro.cliente || "Nome do Cliente"),
      cpf: safeText(dadosCadastro.cpf || "000.000.000-00"),
      endereco: {
        rua: safeText(enderecoCliente[0]?.trim() || "Rua do Cliente"),
        numero: safeText(enderecoCliente[1]?.trim() || "S/N"),
        cidade: safeText(enderecoCliente[2]?.trim() || "Cidade"),
        estado: safeText(enderecoCliente[3]?.trim() || "Estado"),
      },
    };

    // Construção dos itens do orçamento
    const buildItens = () => {
      const itens = [];
      
      // Materiais
      (materiais || []).forEach(item => {
        itens.push({
          quantidade: modoObra ? item.qtBarras : item.quantKg,
          descricao: `${safeText(item.descricao)} (${modoObra ? "Peso: " + (item.quantKg || 0) + " kg" : "Insumo"})`,
          precoUnitario: item.precoKg || 0,
          totalItem: (item.quantKg || 0) * (item.precoKg || 0),
        });
      });

      // Mão de obra - execução
      (maoObraExecucao || []).forEach(item => {
        itens.push({
          quantidade: (item.pessoas || 0) * (item.dias || 0) * (item.hrsDia || 0),
          descricao: `${safeText(item.descricao)} (Mão de Obra - ${safeText(labels.maoObraExec) || "Execução"})`,
          precoUnitario: item.precoHr || 0,
          totalItem: (item.pessoas || 0) * (item.dias || 0) * (item.hrsDia || 0) * (item.precoHr || 0),
        });
      });

      // Adicione os outros tipos de itens (maoObraInstalacao, itensServicos, etc.) seguindo o mesmo padrão

      // Garante pelo menos 4 linhas
      while (itens.length < 4) {
        itens.push({
          quantidade: "",
          descricao: "",
          precoUnitario: 0,
          totalItem: 0
        });
      }

      return itens;
    };

    const itens = buildItens();

    // Cabeçalho do documento
    yPosition = checkPageBreak(yPosition, 40);
    
    // Logo e informações da empresa
    doc.setFillColor(147, 51, 234);
    doc.rect(margin, yPosition, 20, 10, "F");
    addText(empresa.logoChar, margin + 5, yPosition + 7, {
      fontSize: 12,
      textColor: [255, 255, 255],
      bold: true
    });

    let companyX = margin + 25;
    yPosition = addText(empresa.nome, companyX, yPosition, {
      fontSize: 12,
      bold: true,
      textColor: [31, 41, 55]
    });

    // Adicione aqui o restante do conteúdo do PDF seguindo o mesmo padrão de validação

    // Finalização do documento
    doc.save(`${modoObra ? "Orçamento_Obra" : "Orçamento_Serviço"}_${dadosGerais.numeroOrdem.replace(/\//g, '-')}.pdf`);

  } catch (error) {
    console.error("Erro crítico ao gerar PDF:", error);
    
    // Fallback: cria um PDF simples com mensagem de erro
    const errorDoc = new jsPDF();
    errorDoc.text("Erro ao gerar o PDF completo", 10, 10);
    errorDoc.text("Detalhes: " + error.message, 10, 20);
    errorDoc.save("Orcamento_Erro.pdf");
    
    throw new Error("Falha ao gerar PDF: " + error.message);
  }
};