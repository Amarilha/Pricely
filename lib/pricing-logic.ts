/**
 * Tipos de Empresa
 */
type CompanyType = 'mei' | 'me';

/**
 * Estrutura de custos
 */
interface Cost {
  id: string;
  nome: string;
  valor: number;
}

/**
 * Parâmetros para cálculo de preço
 */
interface PricingParams {
  tipoEmpresa: CompanyType;
  custosFixos: Cost[];
  custosVariaveis: Cost[];
  impostoPercentual: number;
  faturamentoBrutoAnual?: number;
  remuneracaoDesejada: number;
  valorHora?: number;
  diasUteisPorMes: number;
  horasProdutivasPorDia: number;
  horasEstimadasProjeto: number;
  unidadeTempo: 'horas' | 'dias' | 'semanas';
  tipoServico: string;
  modoCalculo: 'completo' | 'realista';
  margemLucro?: number; // Apenas para modo realista com margem fixa
}

/**
 * Resultado do cálculo de preço
 */
interface PricingResult {
  valorProjeto: number;
  valorPorHora: number;
  custoFixoProporcional: number;
  custoVariavelTotal: number;
  valorImpostos: number;
  valorProLabore: number;
  margemLucro?: number;
  markup?: number;
  breakEvenUnidades?: number;
  breakEvenValor?: number;
  distribuicaoCustos: {
    custosFixos: number;
    custosVariaveis: number;
    remuneracao: number;
    proLabore: number;
    impostos: number;
  };
}

/**
 * Calcula o valor do projeto com base no modo completo
 */
function calcularModoCompleto(params: PricingParams): PricingResult {
  // Converter horas estimadas conforme unidade de tempo
  const horasTotais = converterParaHoras(
    params.horasEstimadasProjeto,
    params.unidadeTempo,
    params.horasProdutivasPorDia
  );

  // Calcular horas mensais totais trabalhadas
  const horasMensaisTotais = params.diasUteisPorMes * params.horasProdutivasPorDia;

  // Calcular valor por hora (se não foi informado diretamente)
  const valorPorHora = params.valorHora 
    ? params.valorHora 
    : params.remuneracaoDesejada / horasMensaisTotais;

  // Somar custos fixos
  const totalCustosFixos = params.custosFixos.reduce((sum, custo) => sum + custo.valor, 0);

  // Somar custos variáveis
  const totalCustosVariaveis = params.custosVariaveis.reduce((sum, custo) => sum + custo.valor, 0);

  // Calcular impostos
  let valorImpostos = 0;
  if (params.tipoEmpresa === 'mei') {
    valorImpostos = 70.60; // Valor fixo para MEI
  } else {
    // Para ME, pega o maior valor entre o mínimo (181.14) ou o percentual do faturamento
    const impostoMinimo = 181.14;
    const impostoCalculado = (params.faturamentoBrutoAnual || 0) * (params.impostoPercentual / 100) / 12;
    valorImpostos = Math.max(impostoMinimo, impostoCalculado);
  }

  // Calcular pró-labore (28% da remuneração para MEI, não aplicável para ME)
  const valorProLabore = params.tipoEmpresa === 'mei' 
    ? valorPorHora * horasTotais * 0.28 
    : 0;

  // Calcular custo fixo proporcional ao projeto
  const custoFixoProporcional = (totalCustosFixos / horasMensaisTotais) * horasTotais;

  // Calcular valor total do projeto
  const valorProjeto = (valorPorHora * horasTotais) + 
                       totalCustosVariaveis + 
                       custoFixoProporcional + 
                       valorImpostos + 
                       valorProLabore;

  // Calcular markup e break-even (opcional)
  const custoTotal = totalCustosVariaveis + custoFixoProporcional;
  const markup = valorProjeto / custoTotal;
  const margemContribuicao = (valorProjeto - custoTotal) / valorProjeto;
  const breakEvenValor = totalCustosFixos / margemContribuicao;

  return {
    valorProjeto,
    valorPorHora,
    custoFixoProporcional,
    custoVariavelTotal: totalCustosVariaveis,
    valorImpostos,
    valorProLabore,
    margemLucro: margemContribuicao * 100,
    markup,
    breakEvenValor,
    distribuicaoCustos: {
      custosFixos: custoFixoProporcional,
      custosVariaveis: totalCustosVariaveis,
      remuneracao: valorPorHora * horasTotais,
      proLabore: valorProLabore,
      impostos: valorImpostos
    }
  };
}

/**
 * Calcula o valor do projeto com base no modo realista
 */
function calcularModoRealista(params: PricingParams): PricingResult {
  // Converter horas estimadas conforme unidade de tempo
  const horasTotais = converterParaHoras(
    params.horasEstimadasProjeto,
    params.unidadeTempo,
    params.horasProdutivasPorDia
  );

  // Calcular valor por hora mínimo (se não foi informado diretamente)
  const valorPorHora = params.valorHora 
    ? params.valorHora 
    : params.remuneracaoDesejada / (params.diasUteisPorMes * params.horasProdutivasPorDia);

  // Aplicar margem fixa se especificada
  const valorHoraFinal = params.margemLucro
    ? valorPorHora * (1 + (params.margemLucro / 100))
    : valorPorHora;

  // Calcular impostos
  let valorImpostos = 0;
  if (params.tipoEmpresa === 'mei') {
    valorImpostos = 70.60; // Valor fixo para MEI
  } else {
    const impostoMinimo = 181.14;
    const impostoCalculado = (params.faturamentoBrutoAnual || 0) * (params.impostoPercentual / 100) / 12;
    valorImpostos = Math.max(impostoMinimo, impostoCalculado);
  }

  // Calcular pró-labore (28% da remuneração para MEI, não aplicável para ME)
  const valorProLabore = params.tipoEmpresa === 'mei' 
    ? valorHoraFinal * horasTotais * 0.28 
    : 0;

  // Calcular valor total do projeto (modo simplificado)
  const valorProjeto = (valorHoraFinal * horasTotais) + valorImpostos + valorProLabore;

  return {
    valorProjeto,
    valorPorHora: valorHoraFinal,
    custoFixoProporcional: 0, // Não considerado no modo realista
    custoVariavelTotal: 0,    // Não considerado no modo realista básico
    valorImpostos,
    valorProLabore,
    distribuicaoCustos: {
      custosFixos: 0,
      custosVariaveis: 0,
      remuneracao: valorHoraFinal * horasTotais,
      proLabore: valorProLabore,
      impostos: valorImpostos
    }
  };
}

/**
 * Função principal para calcular o preço do projeto
 */
export function calcularPrecoProjeto(params: PricingParams): PricingResult {
  if (params.modoCalculo === 'completo') {
    return calcularModoCompleto(params);
  } else {
    return calcularModoRealista(params);
  }
}

/**
 * Converte unidades de tempo para horas
 */
function converterParaHoras(
  quantidade: number,
  unidade: 'horas' | 'dias' | 'semanas',
  horasPorDia: number
): number {
  switch (unidade) {
    case 'horas':
      return quantidade;
    case 'dias':
      return quantidade * horasPorDia;
    case 'semanas':
      return quantidade * horasPorDia * 5; // Assumindo 5 dias úteis por semana
    default:
      return quantidade;
  }
}

/**
 * Formata valores monetários para exibição
 */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Calcula o markup com base na margem de lucro desejada
 */
export function calcularMarkup(margemLucroPercentual: number): number {
  return 1 / (1 - (margemLucroPercentual / 100));
}

/**
 * Calcula o ponto de equilíbrio
 */
export function calcularBreakEven(
  custosFixosTotais: number,
  precoVendaUnitario: number,
  custoVariavelUnitario: number
): { unidades: number; valor: number } {
  const margemContribuicaoUnitario = precoVendaUnitario - custoVariavelUnitario;
  const unidades = custosFixosTotais / margemContribuicaoUnitario;
  const valor = custosFixosTotais / (margemContribuicaoUnitario / precoVendaUnitario);

  return {
    unidades,
    valor
  };
}