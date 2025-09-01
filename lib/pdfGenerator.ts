import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ServiceItem {
    id: string;
    quantidade: number;
    descricao: string;
    precoUnitario: number;
    totalItem: number;
}

interface FixedCost {
    id: string;
    descricao: string;
    valor: number;
}

interface VariableCost {
    id: string;
    categoria: string;
    descricao: string;
    valor: number;
    unidade: string;
    quantidade: number;
    observacoes: string;
    pessoas?: number;
    horas?: number;
    valorHora?: number;
}

interface Company {
    id_company: string;
    id_user: string;
    nome: string;
    cnpj: string;
    endereco_rua: string;
    endereco_numero: string;
    endereco_cidade: string;
    endereco_estado: string;
    endereco_cep: string;
    telefone: string;
    email: string;
    logoChar: string;
    created_at?: string;
    updated_at?: string;
}

interface Client {
    id_client: string;
    nome: string;
    cpf: string;
    cnpj: string;
    telefone: string;
    email: string;
    endereco_rua: string;
    endereco_numero: string;
    endereco_cidade: string;
    endereco_estado: string;
    endereco_cep: string;
    observacoes: string;
}

interface QuoteData {
    empresaSelecionada: string;
    empresa: Company;
    clienteSelecionado: string;
    cliente: Client;
    numeroOrdem: string;
    data: string;
    dataEntrega: string;
    descricaoServico: string;
    enderecoCobranca: string;
    localPrestacao: {
        nome: string;
        tipoDocumento: string;
        documento: string;
        endereco: {
            rua: string;
            numero: string;
            cidade: string;
            estado: string;
        };
    };
    horasTrabalhadasMes: number;
    custosFixos: FixedCost[];
    custosVariaveis: VariableCost[];
    margemLucro: number;
    impostos: number;
    totalHours: number;
    incluirSalarios: boolean;
    itens: ServiceItem[];
    formaPagamento: string;
    desconto: number;
    acrescimos: number;
    condicoesPersonalizadas: string;
}

// Função de formatação de moeda
const formatCurrency = (value: number) => {
    if (isNaN(value)) {
        return "R$ 0,00";
    }
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

// Função de formatação de data
const formatDate = (dateString: string) => {
    if (!dateString) {
        return "";
    }
    try {
        const date = new Date(dateString);
        // Adiciona um dia para corrigir o problema de fuso horário que pode causar a data errada
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString("pt-BR");
    } catch (error) {
        return dateString;
    }
};

export const generateQuotePDF = (quoteData: QuoteData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let yPosition = 20;

    // ---  Cálculos ---
    const calcularTotalCustosVariaveis = quoteData.custosVariaveis.reduce((total, custo) => total + (custo.valor || 0) * (custo.quantidade || 0), 0);
    const calcularSubtotalItens = quoteData.itens.reduce((total, item) => total + (item.totalItem || 0), 0);
    const calcularSubtotalGeral = calcularTotalCustosVariaveis + calcularSubtotalItens;
    const calcularLucro = calcularSubtotalGeral * (quoteData.margemLucro / 100);
    const calcularImpostos = (calcularSubtotalGeral + calcularLucro) * (quoteData.impostos / 100);
    const totalFinal = calcularSubtotalGeral + calcularLucro + calcularImpostos - quoteData.desconto + quoteData.acrescimos;


    // --- Cabeçalho ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(quoteData.empresa.nome || "Nome da Empresa", margin, yPosition);
    yPosition += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`CNPJ: ${quoteData.empresa.cnpj || "N/A"}`, margin, yPosition);
    yPosition += 5;
    doc.text(`${quoteData.empresa.endereco_rua || "Rua"}, ${quoteData.empresa.endereco_numero || "N/A"}`, margin, yPosition);
    yPosition += 5;
    doc.text(`${quoteData.empresa.endereco_cidade || "Cidade"}, ${quoteData.empresa.endereco_estado || "Estado"} - CEP: ${quoteData.empresa.endereco_cep || "N/A"}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Telefone: ${quoteData.empresa.telefone || "N/A"}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Email: ${quoteData.empresa.email || "N/A"}`, margin, yPosition);


    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("ORÇAMENTO", pageWidth - margin, 20, { align: "right" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Número: ${quoteData.numeroOrdem}`, pageWidth - margin, 28, { align: "right" });
    doc.text(`Data: ${formatDate(quoteData.data)}`, pageWidth - margin, 34, { align: "right" });

    yPosition = Math.max(yPosition, 40) + 10;

    // --- Informações do Cliente ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Cliente", margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(quoteData.cliente.nome || "Nome do Cliente", margin, yPosition);
    yPosition += 5;
    doc.text(`CPF/CNPJ: ${quoteData.cliente.cpf || quoteData.cliente.cnpj || "N/A"}`, margin, yPosition);
    yPosition += 5;
    doc.text(`${quoteData.cliente.endereco_rua || "Rua"}, ${quoteData.cliente.endereco_numero || "N/A"}`, margin, yPosition);
    yPosition += 5;
    doc.text(`${quoteData.cliente.endereco_cidade || "Cidade"}, ${quoteData.cliente.endereco_estado || "Estado"} - CEP: ${quoteData.cliente.endereco_cep || "N/A"}`, margin, yPosition);
    yPosition += 8;

    // --- Descrição do Serviço ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Descrição do Serviço", margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitDescription = doc.splitTextToSize(quoteData.descricaoServico || "Nenhuma descrição fornecida.", pageWidth - margin * 2);
    doc.text(splitDescription, margin, yPosition);
    yPosition += (splitDescription.length * 5) + 5;


    // --- Tabela de Itens e Custos ---
    const tableData = [
        ...quoteData.itens.map(item => [
            item.quantidade.toString(),
            item.descricao,
            formatCurrency(item.precoUnitario),
            formatCurrency(item.totalItem)
        ]),
        ...quoteData.custosVariaveis.map(custo => [
            `${custo.quantidade} ${custo.unidade}`,
            `${custo.descricao} (${custo.categoria})`,
            formatCurrency(custo.valor),
            formatCurrency(custo.valor * custo.quantidade)
        ])
    ];

    autoTable(doc, {
        startY: yPosition,
        head: [['Quantidade', 'Descrição', 'Preço Unit.', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [96, 7, 182] }, // Roxo
        didDrawPage: (data) => {
            yPosition = data.cursor?.y ? data.cursor.y + 10 : yPosition + 10;
        }
    });

    // --- Totais ---
    const finalY = (doc as any).lastAutoTable.finalY || yPosition;
    yPosition = finalY + 10;

    const totalsX = pageWidth / 2;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    doc.text("Subtotal:", totalsX, yPosition);
    doc.text(formatCurrency(calcularSubtotalGeral), pageWidth - margin, yPosition, { align: "right" });
    yPosition += 7;

    doc.text("Margem de Lucro:", totalsX, yPosition);
    doc.text(formatCurrency(calcularLucro), pageWidth - margin, yPosition, { align: "right" });
    yPosition += 7;

    doc.text("Impostos:", totalsX, yPosition);
    doc.text(formatCurrency(calcularImpostos), pageWidth - margin, yPosition, { align: "right" });
    yPosition += 7;

    if (quoteData.desconto > 0) {
        doc.text("Desconto:", totalsX, yPosition);
        doc.setTextColor(255, 0, 0); // Vermelho
        doc.text(`- ${formatCurrency(quoteData.desconto)}`, pageWidth - margin, yPosition, { align: "right" });
        doc.setTextColor(0, 0, 0);
        yPosition += 7;
    }

    if (quoteData.acrescimos > 0) {
        doc.text("Acréscimos:", totalsX, yPosition);
        doc.setTextColor(0, 128, 0); // Verde
        doc.text(`+ ${formatCurrency(quoteData.acrescimos)}`, pageWidth - margin, yPosition, { align: "right" });
        doc.setTextColor(0, 0, 0);
        yPosition += 7;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", totalsX, yPosition);
    doc.text(formatCurrency(totalFinal), pageWidth - margin, yPosition, { align: "right" });
    yPosition += 15;


    // --- Forma de Pagamento ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Forma de Pagamento", margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(quoteData.formaPagamento, margin, yPosition);
    if (quoteData.condicoesPersonalizadas) {
        yPosition += 5;
        doc.text(`Condições: ${quoteData.condicoesPersonalizadas}`, margin, yPosition);
    }
    yPosition += 15;

    // --- Rodapé ---
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Orçamento gerado por nexprice.com.br`, pageWidth / 2, pageHeight - 10, { align: "center" });

    // --- Salvar o PDF ---
    doc.save(`Orcamento_${quoteData.numeroOrdem}.pdf`);
};
