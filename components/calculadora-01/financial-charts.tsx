"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { TrendingUp, AlertTriangle, Target, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FinancialChartsProps {
  custosFixos: number
  custosVariaveis: number
  margemLucro: number
  receitaLiquida: number
  impostos: number
}

interface ChartData {
  name: string
  value: number
  color: string
}

const COLORS = {
  markupAtual: "#8b5cf6",
  markupIdeal: "#10b981",
  gao: "#f59e0b",
  receita: "#8b5cf6",
  breakeven: "#ef4444",
  margemSeguranca: "#10b981",
  custosFixos: "#ef4444",
  custosVariaveis: "#f59e0b",
  margemLucro: "#10b981",
  impostos: "#6b7280",
}

export function FinancialCharts({
  custosFixos,
  custosVariaveis,
  margemLucro,
  receitaLiquida,
  impostos,
}: FinancialChartsProps) {
  // Define formatarMoeda locally
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
  }

  // Cálculo do Markup
  const calcularMarkup = () => {
    const custoTotal = custosFixos + custosVariaveis
    if (custoTotal <= 0 || receitaLiquida <= 0) return 0
    return receitaLiquida / custoTotal
  }

  // Cálculo do GAO (Grau de Alavancagem Operacional)
  const calcularGAO = () => {
    const margemContribuicao = receitaLiquida - custosVariaveis
    const lucroOperacional = receitaLiquida - (custosVariaveis + custosFixos)
    if (lucroOperacional <= 0 || margemContribuicao <= 0) return 0
    return margemContribuicao / lucroOperacional
  }

  // Cálculo do Break-even
  const calcularBreakeven = () => {
    const margemContribuicaoUnitaria = receitaLiquida > 0 ? (receitaLiquida - custosVariaveis) / receitaLiquida : 0
    if (margemContribuicaoUnitaria <= 0) return 0
    return custosFixos / margemContribuicaoUnitaria
  }

  const markup = calcularMarkup()
  const gao = calcularGAO()
  const breakeven = calcularBreakeven()

  // Dados para os gráficos
  const markupData: ChartData[] = [
    { name: "Markup Atual", value: markup, color: COLORS.markupAtual },
    { name: "Markup Ideal", value: 2.5, color: COLORS.markupIdeal },
  ]

  const gaoData: ChartData[] = [
    {
      name: "GAO Atual",
      value: gao,
      color: gao > 2 ? COLORS.custosFixos : gao > 1.5 ? COLORS.gao : COLORS.margemSeguranca,
    },
  ]

  // Generate range data for line chart with dynamic margin
  const generateBreakevenData = () => {
    const maxRevenue = receitaLiquida * 1.5 // Extend to 1.5x current revenue for trend
    const steps = 5
    const data = []
    for (let i = 0; i <= steps; i++) {
      const revenue = (maxRevenue / steps) * i
      data.push({
        revenueLevel: i,
        receitaAtual: revenue <= receitaLiquida ? revenue : receitaLiquida, // Cap at current revenue
        pontoEquilibrio: breakeven, // Constant break-even point
        margemSeguranca: Math.max(0, revenue - breakeven), // Dynamic safety margin based on revenue
      })
    }
    return data
  }

  const breakevenData = generateBreakevenData()

  const composicaoCustos: ChartData[] = [
    { name: "Custos Fixos", value: custosFixos, color: COLORS.custosFixos },
    { name: "Custos Variáveis", value: custosVariaveis, color: COLORS.custosVariaveis },
    { name: "Margem de Lucro", value: (receitaLiquida * margemLucro) / 100, color: COLORS.margemLucro },
    { name: "Impostos", value: impostos, color: COLORS.impostos },
  ]

  const getGaoStatus = (gao: number) => {
    if (gao > 2) return { status: "Alto Risco", variant: "destructive", icon: AlertTriangle }
    if (gao > 1.5) return { status: "Moderado", variant: "secondary", icon: TrendingUp }
    return { status: "Baixo Risco", variant: "default", icon: Target }
  }

  const gaoStatus = getGaoStatus(gao)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Markup Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análise de Markup
          </CardTitle>
          <CardDescription>Markup atual vs. ideal para sustentabilidade do negócio</CardDescription>
        </CardHeader>
        <CardContent>
          {markup === 0 ? (
            <p className="text-center text-muted-foreground">Dados insuficientes para exibir o gráfico</p>
          ) : (
            <ChartContainer
              config={{
                markupAtual: { label: "Markup Atual", color: COLORS.markupAtual },
                markupIdeal: { label: "Markup Ideal", color: COLORS.markupIdeal },
              }}
              className="min-h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%" aspect={2}>
                <BarChart data={markupData} aria-label="Gráfico de Markup">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent formatter={formatarMoeda} />} />
                  <Bar dataKey="value" name="Markup Atual" fill={COLORS.markupAtual} barSize={100} />
                  <Bar dataKey="value" name="Markup Ideal" fill={COLORS.markupIdeal} barSize={100} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Markup Atual:</span>
              <Badge variant={markup > 2 ? "default" : "destructive"}>{markup.toFixed(2)}x</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {markup < 2 ? "⚠️ Markup baixo - considere aumentar preços" : "✅ Markup adequado"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* GAO Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <gaoStatus.icon className="h-5 w-5" />
            Grau de Alavancagem Operacional (GAO)
          </CardTitle>
          <CardDescription>Sensibilidade do lucro às variações de receita</CardDescription>
        </CardHeader>
        <CardContent>
          {gao === 0 ? (
            <p className="text-center text-muted-foreground">Dados insuficientes para exibir o gráfico</p>
          ) : (
            <ChartContainer
              config={{
                gao: { label: "GAO", color: gaoData[0].color },
              }}
              className="min-h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%" aspect={2}>
                <BarChart data={gaoData} aria-label="Gráfico de GAO">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value) => value.toFixed(2)} />} />
                  <Bar dataKey="value" fill={gaoData[0].color} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">GAO Atual:</span>
              <Badge variant={gaoStatus.variant}>{`${gao.toFixed(2)} - ${gaoStatus.status}`}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {gao > 2
                ? "⚠️ Alto risco - pequenas quedas na receita causam grandes perdas"
                : gao > 1.5
                ? "⚡ Moderado - boa alavancagem com risco controlado"
                : "🛡️ Baixo risco - operação mais estável"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Break-even Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Análise de Break-even
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    <strong>Análise de Break-even:</strong><br />
                    - <span style={{ color: COLORS.receita }}>■</span> <strong>Receita Atual:</strong> O valor total de receita gerada.<br />
                    - <span style={{ color: COLORS.breakeven }}>■</span> <strong>Ponto de Equilíbrio:</strong> O valor mínimo de receita necessário para cobrir todos os custos (fixos + variáveis).<br />
                    - <span style={{ color: COLORS.margemSeguranca }}>■</span> <strong>Margem de Segurança:</strong> A diferença entre a receita atual e o ponto de equilíbrio, indicando a margem de segurança financeira.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Ponto de equilíbrio e margem de segurança</CardDescription>
        </CardHeader>
        <CardContent>
          {breakeven === 0 && receitaLiquida === 0 ? (
            <p className="text-center text-muted-foreground">Dados insuficientes para exibir o gráfico</p>
          ) : (
            <ChartContainer
              config={{
                receita: { label: "Receita", color: COLORS.receita },
                breakeven: { label: "Break-even", color: COLORS.breakeven },
                margem: { label: "Margem de Segurança", color: COLORS.margemSeguranca },
              }}
              className="min-h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%" aspect={1.5}>
                <LineChart data={breakevenData} aria-label="Gráfico de Break-even">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="revenueLevel"
                    type="number"
                    domain={[0, 5]}
                    tickFormatter={(value) => `${(receitaLiquida * value * 0.3).toFixed(0)}`}
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis tickFormatter={formatarMoeda} stroke="#666" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent formatter={formatarMoeda} />} />
                  <Line
                    type="monotone"
                    dataKey="receitaAtual"
                    name="Receita Atual"
                    stroke={COLORS.receita}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pontoEquilibrio"
                    name="Ponto de Equilíbrio"
                    stroke={COLORS.breakeven}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="margemSeguranca"
                    name="Margem de Segurança"
                    stroke={COLORS.margemSeguranca}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
          <div className="mt-4 space-y-2">
            {/* Legend */}
            <div className="flex justify-around text-sm">
              <span>
                <span className="inline-block w-3 h-3 mr-1" style={{ backgroundColor: COLORS.receita }}></span>
                Receita Atual
              </span>
              <span>
                <span className="inline-block w-3 h-3 mr-1" style={{ backgroundColor: COLORS.breakeven }}></span>
                Ponto de Equilíbrio
              </span>
              <span>
                <span className="inline-block w-3 h-3 mr-1" style={{ backgroundColor: COLORS.margemSeguranca }}></span>
                Margem de Segurança
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Break-even:</span>
              <span className="text-sm font-medium">{formatarMoeda(breakeven)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Margem de Segurança:</span>
              <Badge variant={receitaLiquida > breakeven ? "default" : "destructive"}>
                {formatarMoeda(Math.max(0, receitaLiquida - breakeven))}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Composição de Custos */}
      <Card>
        <CardHeader>
          <CardTitle>Composição de Custos</CardTitle>
          <CardDescription>Distribuição dos custos e margem de lucro</CardDescription>
        </CardHeader>
        <CardContent>
          {composicaoCustos.every((item) => item.value === 0) ? (
            <p className="text-center text-muted-foreground">Dados insuficientes para exibir o gráfico</p>
          ) : (
            <ChartContainer
              config={composicaoCustos.reduce(
                (acc, item) => ({
                  ...acc,
                  [item.name]: { label: item.name, color: item.color },
                }),
                {},
              )}
              className="min-h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%" aspect={1}>
                <PieChart aria-label="Gráfico de Composição de Custos">
                  <Pie
                    data={composicaoCustos}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${formatarMoeda(value)}`}
                    labelLine={true}
                  >
                    {composicaoCustos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent formatter={formatarMoeda} />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}