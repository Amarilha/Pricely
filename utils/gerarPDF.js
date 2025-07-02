import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const gerarPDF = (
  modoObra,
  labels,
  dadosCadastro,
  areaProjeto,
  descricaoProjeto,
  materiais,
  maoObraExecucao,
  maoObraInstalacao,
  itensServicos,
  acabamentoExtras,
  consumoDespesas,
  dadosFinais,
  observacoes,
  valorMateriais,
  valorMaoObraExec,
  valorMaoObraInst,
  valorItensServicos,
  valorAcabamentoExtras,
  valorConsumoDespesas,
  custoTotal,
  valorImposto,
  valorLucro,
  valorEngenharia, 
  precoFinal,
  pesoTotal,
  precoPorKg,
  precoPorUnidade,
  valorComissao
) => {
  // Inicializa o documento PDF
  const doc = new jsPDF();
  
  // Configurações de página
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 20;

  // Função auxiliar para adicionar texto
  const addText = (text, x, y, options = {}) => {
    doc.setFontSize(options.fontSize || 12);
    if (options.bold) doc.setFont("helvetica", "bold");
    else doc.setFont("helvetica", "normal");
    doc.text(text, x, y, options);
    return y + (options.lineHeight || (options.fontSize || 12) * 0.5) + 5;
  };

  // Função para verificar quebra de página
  const checkPageBreak = (currentY, requiredSpace = 20) => {
    if (currentY + requiredSpace > doc.internal.pageSize.height - margin) {
      doc.addPage();
      return margin;
    }
    return currentY;
  };

  // Formata valores monetários
  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Dados da empresa
  const empresa = {
    nome: "Sua Empresa",
    cnpj: "12.345.678/0001-99",
    endereco: {
      rua: "Rua Exemplo",
      numero: "123",
      cidade: "São Paulo",
      estado: "SP",
    },
    telefone: "(11) 1234-5678",
    logoChar: "LOGO",
  };

  // Dados gerais do orçamento
  const dadosGerais = {
    numeroOrdem: "001/2025",
    data: dadosCadastro.dataOrcamento || new Date().toLocaleDateString("pt-BR"),
    dataEntrega: new Date().toLocaleDateString("pt-BR"),
  };

  // Dados do cliente
  const cliente = {
    nome: dadosCadastro.cliente || "Nome do Cliente",
    cpf: dadosCadastro.cpf || "123.456.789-00",
    endereco: {
      rua: dadosCadastro.endereco?.split(",")[0] || "Rua do Cliente",
      numero: dadosCadastro.endereco?.split(",")[1] || "S/N",
      cidade: dadosCadastro.endereco?.split(",")[2] || "Cidade",
      estado: dadosCadastro.endereco?.split(",")[3] || "Estado",
    },
  };

  // Local de prestação de serviço
  const localPrestacao = {
    nome: dadosCadastro.responsavel || cliente.nome,
    tipoDocumento: "CPF",
    documento: cliente.cpf,
    endereco: cliente.endereco,
  };

  // Endereço de cobrança
  const cobranca = {
    endereco: dadosCadastro.endereco || "Endereço de Cobrança",
  };

  // Forma de pagamento
  const formaPagamento = dadosCadastro.formaPagamento || "A combinar";

  // Combina todos os itens em um único array
  const itens = [
    ...materiais.map((item) => ({
      quantidade: modoObra ? item.qtBarras : item.quantKg,
      descricao: `${item.descricao} (${modoObra ? "Peso: " + item.quantKg + " kg" : "Insumo"})`,
      precoUnitario: item.precoKg,
      totalItem: item.quantKg * item.precoKg,
    })),
    ...maoObraExecucao.map((item) => ({
      quantidade: item.pessoas * item.dias * item.hrsDia,
      descricao: `${item.descricao} (Mão de Obra - ${labels.maoObraExec})`,
      precoUnitario: item.precoHr,
      totalItem: item.pessoas * item.dias * item.hrsDia * item.precoHr,
    })),
    ...maoObraInstalacao.map((item) => ({
      quantidade: item.pessoas * item.dias * item.hrsDia,
      descricao: `${item.descricao} (Mão de Obra - ${labels.maoObraInst})`,
      precoUnitario: item.precoHr,
      totalItem: item.pessoas * item.dias * item.hrsDia * item.precoHr,
    })),
    ...itensServicos.map((item) => ({
      quantidade: item.qt,
      descricao: `${item.descricao} (${item.unid})`,
      precoUnitario: item.precoUnit,
      totalItem: item.qt * item.precoUnit,
    })),
    ...acabamentoExtras.map((item) => ({
      quantidade: item.quant,
      descricao: `${item.descricao} (${item.unid})`,
      precoUnitario: item.precoKg,
      totalItem: item.quant * item.precoKg,
    })),
    ...consumoDespesas.map((item) => ({
      quantidade: item.qt,
      descricao: `${item.descricao} (${item.unid})`,
      precoUnitario: item.preco,
      totalItem: item.qt * item.preco,
    })),
  ];

  // Totais do orçamento
  const totais = {
    subtotal: custoTotal,
    desconto: dadosFinais.desconto || 0,
    acrescimos: valorEngenharia + valorComissao + (dadosFinais.consultoria || 0) + valorImposto,
    totalFinal: precoFinal,
  };

  // ========== CONSTRUÇÃO DO PDF ========== //

  // Cabeçalho com informações da empresa
  yPosition = addText(empresa.logoChar, margin, yPosition, { fontSize: 16, bold: true });
  yPosition = addText(empresa.nome, margin, yPosition, { fontSize: 14, bold: true });
  yPosition = addText(`CNPJ ${empresa.cnpj}`, margin, yPosition);
  yPosition = addText(
    `${empresa.endereco.rua}, ${empresa.endereco.numero}`,
    margin,
    yPosition
  );
  yPosition = addText(
    `${empresa.endereco.cidade}, ${empresa.endereco.estado}`,
    margin,
    yPosition
  );
  yPosition = addText(`Telefone ${empresa.telefone}`, margin, yPosition);
  yPosition = checkPageBreak(yPosition);

  // Título do documento
  yPosition = addText(
    "ORDEM DE SERVIÇO",
    pageWidth / 2,
    yPosition,
    { align: "center", fontSize: 16, bold: true }
  );
  yPosition = addText(
    `Ordem nº: ${dadosGerais.numeroOrdem}`,
    margin,
    yPosition
  );
  yPosition = addText(`Data: ${dadosGerais.data}`, margin, yPosition);
  yPosition = checkPageBreak(yPosition);

  // Seção do Cliente
  yPosition = addText("Cliente", margin, yPosition, { fontSize: 14, bold: true });
  yPosition = addText(`Nome: ${cliente.nome}`, margin, yPosition);
  yPosition = addText(`CPF: ${cliente.cpf}`, margin, yPosition);
  yPosition = addText(
    `Endereço: ${cliente.endereco.rua}, ${cliente.endereco.numero} - ${cliente.endereco.cidade}, ${cliente.endereco.estado}`,
    margin,
    yPosition
  );
  yPosition = checkPageBreak(yPosition);

  // Endereço de cobrança
  yPosition = addText(
    "Endereço de cobrança",
    margin,
    yPosition,
    { fontSize: 14, bold: true }
  );
  yPosition = addText(cobranca.endereco, margin, yPosition);
  yPosition = checkPageBreak(yPosition);

  // Descrição do serviço
  yPosition = addText(
    "Descrição do serviço",
    margin,
    yPosition,
    { fontSize: 14, bold: true }
  );
  const descLines = doc.splitTextToSize(descricaoProjeto || "Sem descrição", pageWidth - 2 * margin);
  descLines.forEach((line) => {
    yPosition = addText(line, margin, yPosition, { fontSize: 12 });
    yPosition = checkPageBreak(yPosition);
  });

  // Local de prestação
  yPosition = addText(
    "Local de prestação",
    margin,
    yPosition,
    { fontSize: 14, bold: true }
  );
  yPosition = addText(`Nome: ${localPrestacao.nome}`, margin, yPosition);
  yPosition = addText(
    `${localPrestacao.tipoDocumento}: ${localPrestacao.documento}`,
    margin,
    yPosition
  );
  yPosition = addText(
    `Endereço: ${localPrestacao.endereco.rua}, ${localPrestacao.endereco.numero} - ${localPrestacao.endereco.cidade}, ${localPrestacao.endereco.estado}`,
    margin,
    yPosition
  );
  yPosition = checkPageBreak(yPosition);

  // Tabela de itens (USANDO AUTOTABLE CORRETAMENTE)
  yPosition = checkPageBreak(yPosition, 50);
  
  autoTable(doc, {
    startY: yPosition,
    head: [["Quantidade", "Produto/Serviço", "Preço Unitário", "Total"]],
    body: itens.map((item) => [
      item.quantidade,
      item.descricao,
      `R$ ${formatCurrency(item.precoUnitario)}`,
      `R$ ${formatCurrency(item.totalItem)}`,
    ]),
    theme: "grid",
    headStyles: { 
      fillColor: [61, 101, 155], 
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    bodyStyles: { 
      textColor: [0, 0, 0],
      cellPadding: 3
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 25, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' },
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak'
    },
    didDrawPage: (data) => {
      // Atualiza a posição Y após desenhar a tabela
      yPosition = data.cursor.y + 10;
    }
  });

  // Forma de pagamento
  yPosition = addText(
    "Forma de pagamento",
    margin,
    yPosition,
    { fontSize: 14, bold: true }
  );
  yPosition = addText(formaPagamento, margin, yPosition);
  yPosition = checkPageBreak(yPosition);

  // Totais
  yPosition = addText("Subtotal", margin, yPosition);
  yPosition = addText(
    `R$ ${formatCurrency(totais.subtotal)}`,
    pageWidth - margin,
    yPosition - 10,
    { align: "right" }
  );
  yPosition = addText("Desconto", margin, yPosition);
  yPosition = addText(
    `R$ ${formatCurrency(totais.desconto)}`,
    pageWidth - margin,
    yPosition - 10,
    { align: "right" }
  );
  yPosition = addText("Acréscimos", margin, yPosition);
  yPosition = addText(
    `R$ ${formatCurrency(totais.acrescimos)}`,
    pageWidth - margin,
    yPosition - 10,
    { align: "right" }
  );
  yPosition = addText("TOTAL", margin, yPosition, { fontSize: 14, bold: true });
  yPosition = addText(
    `R$ ${formatCurrency(totais.totalFinal)}`,
    pageWidth - margin,
    yPosition - 10,
    { align: "right", fontSize: 14, bold: true }
  );
  yPosition = checkPageBreak(yPosition);

  // Confirmação
  yPosition = addText(
    "Confirmo que o serviço foi prestado de acordo com o combinado.",
    margin,
    yPosition,
    { fontSize: 12, bold: true }
  );
  yPosition = checkPageBreak(yPosition);

  // Assinaturas
  yPosition = addText("Assinatura do Cliente", margin, yPosition);
  yPosition = addText("_____________________________", margin, yPosition);
  yPosition = addText(
    `Data de entrega: ${dadosGerais.dataEntrega}`,
    margin,
    yPosition
  );
  yPosition = addText("Assinatura do Técnico", margin, yPosition);
  yPosition = addText("_____________________________", margin, yPosition);
  yPosition = checkPageBreak(yPosition);

  // Rodapé
  yPosition = addText(
    "QuantoSobra.com.br",
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );

  // Salva o PDF
  doc.save(`${modoObra ? "Orçamento_Obra" : "Orçamento_Serviço"}_${dadosGerais.numeroOrdem}.pdf`);
};