// Formação de preço do orçamento.
// margem = % de lucro sobre o PREÇO DE VENDA (sem impostos): preço = custo / (1 - margem).
export const MARGEM_MAXIMA = 95;

/** @param {{ custo: number, margem?: number, impostoPct?: number, impostoFixo?: number | null, desconto?: number, acrescimos?: number }} p */
export function calcularPreco({ custo, margem = 0, impostoPct = 0, impostoFixo = null, desconto = 0, acrescimos = 0 }) {
  const m = Math.min(Math.max(margem || 0, 0), MARGEM_MAXIMA) / 100;
  const precoSemImposto = custo / (1 - m);
  const lucro = precoSemImposto - custo;
  const impostos = impostoFixo ?? precoSemImposto * (impostoPct || 0) / 100;
  const total = precoSemImposto + impostos - (desconto || 0) + (acrescimos || 0);
  return { precoSemImposto, lucro, impostos, total };
}
