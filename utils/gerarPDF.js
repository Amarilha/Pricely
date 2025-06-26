// utils/gerarPDF.js
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  precoFinal,
  pesoTotal,
  precoPorKg,
  precoPorUnidade
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 20;

  // Função auxiliar para adicionar texto
  const addText = (text, x, y, options) => {
    doc.text(text, x, y, options);
    return y + (options?.fontSize || 12) * 0.5 + 5;
  };

  // Função auxiliar para verificar quebra de página
  const checkPageBreak = (currentY, requiredSpace = 20) => {
    if (currentY + requiredSpace > doc.internal.pageSize.height - margin) {
      doc.addPage();
      return margin;
    }
    return currentY;
  };

  // Cabeçalho
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  yPosition = addText(labels.titulo, margin, yPosition, { fontSize: 20 });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  yPosition = addText(`Data: ${new Date().toLocaleDateString("pt-BR")}`, margin, yPosition);
  yPosition += 10;

  // Dados de Cadastro
  yPosition = checkPageBreak(yPosition, 60);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  yPosition = addText("DADOS DE CADASTRO", margin, yPosition, { fontSize: 14 });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  yPosition = addText(`Cliente: ${dadosCadastro.cliente}`, margin, yPosition);
  yPosition = addText(`${labels.projeto}: ${dadosCadastro.projeto}`, margin, yPosition);
  yPosition = addText(`${labels.endereco}: ${dadosCadastro.endereco}`, margin, yPosition);
  yPosition = addText(`Responsável: ${dadosCadastro.responsavel}`, margin, yPosition);
  if (areaProjeto > 0) {
    yPosition = addText(`${labels.area}: ${areaProjeto} ${labels.unidadeMedida}`, margin, yPosition);
  }
  if (descricaoProjeto) {
    yPosition = addText(`Descrição: ${descricaoProjeto}`, margin, yPosition);
  }
  yPosition += 10;

  // Materiais/Insumos
  if (materiais.some((item) => item.quantKg > 0)) {
    yPosition = checkPageBreak(yPosition, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    yPosition = addText(labels.materiais.toUpperCase(), margin, yPosition, { fontSize: 14 });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    materiais.forEach((item, index) => {
      if (item.quantKg > 0) {
        yPosition = checkPageBreak(yPosition, 15);
        yPosition = addText(`${index + 1}. ${item.descricao}`, margin, yPosition);
        yPosition = addText(
          `   Quantidade: ${item.quantKg} | Preço: R$ ${item.precoKg.toFixed(2)} | Total: R$ ${(
            item.quantKg * item.precoKg
          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          margin + 10,
          yPosition
        );
      }
    });

    doc.setFont("helvetica", "bold");
    yPosition = addText(
      `TOTAL ${labels.materiais}: R$ ${valorMateriais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      margin,
      yPosition
    );
    yPosition += 10;
  }

  // Mão de Obra Execução
  if (maoObraExecucao.some((item) => item.pessoas > 0)) {
    yPosition = checkPageBreak(yPosition, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    yPosition = addText(labels.maoObraExec.toUpperCase(), margin, yPosition, { fontSize: 14 });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    maoObraExecucao.forEach((item, index) => {
      if (item.pessoas > 0) {
        yPosition = checkPageBreak(yPosition, 15);
        yPosition = addText(`${index + 1}. ${item.descricao}`, margin, yPosition);
        yPosition = addText(
          `   ${item.pessoas} pessoas x ${item.dias} dias x ${item.hrsDia}h/dia x R$ ${item.precoHr}/h = R$ ${(
            item.pessoas * item.dias * item.hrsDia * item.precoHr
          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          margin + 10,
          yPosition
        );
      }
    });

    doc.setFont("helvetica", "bold");
    yPosition = addText(
      `TOTAL ${labels.maoObraExec}: R$ ${valorMaoObraExec.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      margin,
      yPosition
    );
    yPosition += 10;
  }

  // Mão de Obra Instalação
  if (maoObraInstalacao.some((item) => item.pessoas > 0)) {
    yPosition = checkPageBreak(yPosition, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    yPosition = addText(labels.maoObraInst.toUpperCase(), margin, yPosition, { fontSize: 14 });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    maoObraInstalacao.forEach((item, index) => {
      if (item.pessoas > 0) {
        yPosition = checkPageBreak(yPosition, 15);
        yPosition = addText(`${index + 1}. ${item.descricao}`, margin, yPosition);
        yPosition = addText(
          `   ${item.pessoas} pessoas x ${item.dias} dias x ${item.hrsDia}h/dia x R$ ${item.precoHr}/h = R$ ${(
            item.pessoas * item.dias * item.hrsDia * item.precoHr
          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          margin + 10,
          yPosition
        );
      }
    });

    doc.setFont("helvetica", "bold");
    yPosition = addText(
      `TOTAL ${labels.maoObraInst}: R$ ${valorMaoObraInst.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      margin,
      yPosition
    );
    yPosition += 10;
  }

  // Itens/Serviços
  if (itensServicos.some((item) => item.qt > 0)) {
    yPosition = checkPageBreak(yPosition, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    yPosition = addText(labels.itensServicos.toUpperCase(), margin, yPosition, { fontSize: 14 });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    itensServicos.forEach((item, index) => {
      if (item.qt > 0) {
        yPosition = checkPageBreak(yPosition, 15);
        yPosition = addText(`${index + 1}. ${item.descricao}`, margin, yPosition);
        yPosition = addText(
          `   ${item.qt} ${item.unid} x R$ ${item.precoUnit.toFixed(2)} = R$ ${(
            item.qt * item.precoUnit
          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          margin + 10,
          yPosition
        );
      }
    });

    doc.setFont("helvetica", "bold");
    yPosition = addText(
      `TOTAL ${labels.itensServicos}: R$ ${valorItensServicos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      margin,
      yPosition
    );
    yPosition += 10;
  }

  // Acabamento/Extras
  if (acabamentoExtras.some((item) => item.quant > 0)) {
    yPosition = checkPageBreak(yPosition, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    yPosition = addText(labels.acabamentoExtras.toUpperCase(), margin, yPosition, { fontSize: 14 });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    acabamentoExtras.forEach((item, index) => {
      if (item.quant > 0) {
        yPosition = checkPageBreak(yPosition, 15);
        yPosition = addText(`${index + 1}. ${item.descricao}`, margin, yPosition);
        yPosition = addText(
          `   ${item.quant} ${item.unid} x R$ ${item.precoKg.toFixed(2)} = R$ ${(
            item.quant * item.precoKg
          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          margin + 10,
          yPosition
        );
      }
    });

    doc.setFont("helvetica", "bold");
    yPosition = addText(
      `TOTAL ${labels.acabamentoExtras}: R$ ${valorAcabamentoExtras.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      margin,
      yPosition
    );
    yPosition += 10;
  }

  // Consumo/Despesas
  if (consumoDespesas.some((item) => item.qt > 0)) {
    yPosition = checkPageBreak(yPosition, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    yPosition = addText(labels.consumoDespesas.toUpperCase(), margin, yPosition, { fontSize: 14 });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    consumoDespesas.forEach((item, index) => {
      if (item.qt > 0) {
        yPosition = checkPageBreak(yPosition, 15);
        yPosition = addText(`${index + 1}. ${item.descricao}`, margin, yPosition);
        yPosition = addText(
          `   ${item.qt} ${item.unid} x R$ ${item.preco.toFixed(2)} = R$ ${(
            item.qt * item.preco
          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          margin + 10,
          yPosition
        );
      }
    });

    doc.setFont("helvetica", "bold");
    yPosition = addText(
      `TOTAL ${labels.consumoDespesas}: R$ ${valorConsumoDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      margin,
      yPosition
    );
    yPosition += 10;
  }

  // Resumo Final
  yPosition = checkPageBreak(yPosition, 120);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  yPosition = addText("RESUMO FINANCEIRO", margin, yPosition, { fontSize: 16 });
  yPosition += 5;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  yPosition = addText(
    `Custo Total dos Itens: R$ ${custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    margin,
    yPosition
  );

  if (dadosFinais.engenharia > 0) {
    yPosition = addText(
      `${modoObra ? "Engenharia" : "Planejamento"}: R$ ${dadosFinais.engenharia.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      margin,
      yPosition
    );
  }
  if (dadosFinais.comissao > 0) {
    yPosition = addText(
      `Comissão: R$ ${dadosFinais.comissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      margin,
      yPosition
    );
  }
  if (dadosFinais.consultoria > 0) {
    yPosition = addText(
      `Consultoria: R$ ${dadosFinais.consultoria.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      margin,
      yPosition
    );
  }
  if (dadosFinais.impostoPercentual > 0) {
    yPosition = addText(
      `Imposto (${dadosFinais.impostoPercentual}%): R$ ${valorImposto.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      margin,
      yPosition
    );
  }
  if (dadosFinais.margemLucro > 0) {
    yPosition = addText(
      `Lucro (${dadosFinais.margemLucro}%): R$ ${valorLucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      margin,
      yPosition
    );
  }

  yPosition += 10;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  yPosition = addText(
    `VALOR TOTAL: R$ ${precoFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    margin,
    yPosition,
    { fontSize: 18 }
  );

  // Métricas adicionais
  if (modoObra && pesoTotal > 0) {
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    yPosition = addText(
      `Peso Total: ${pesoTotal.toLocaleString()} kg (R$ ${precoPorKg.toFixed(2)}/kg)`,
      margin,
      yPosition
    );
  }

  if (areaProjeto > 0) {
    yPosition = addText(
      `${modoObra ? "Área" : "Quantidade"}: ${areaProjeto.toLocaleString()} ${labels.unidadeMedida} (R$ ${precoPorUnidade.toFixed(
        2
      )}/${labels.unidadeMedida})`,
      margin,
      yPosition
    );
  }

  // Observações
  if (observacoes) {
    yPosition = checkPageBreak(yPosition, 60);
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    yPosition = addText("OBSERVAÇÕES", margin, yPosition, { fontSize: 14 });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const observacoesLines = doc.splitTextToSize(observacoes, pageWidth - 2 * margin);
    observacoesLines.forEach((line) => {
      yPosition = checkPageBreak(yPosition, 15);
      yPosition = addText(line, margin, yPosition);
    });
  }

  // Rodapé
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, doc.internal.pageSize.height - 10, {
      align: "right",
    });
    doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, margin, doc.internal.pageSize.height - 10);
  }

  // Salvar o PDF
  const nomeArquivo = `Orcamento_Nexprice_${dadosCadastro.cliente || "cliente"}_${dadosCadastro.projeto || "projeto"}_${new Date()
    .toISOString()
    .split("T")[0]}.pdf`;
  doc.save(nomeArquivo);
};