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
  gaoThreshold: "#ef4444",
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
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
  }

  const calcularMarkup = () => {
    const custoTotal = custosFixos + custosVariaveis
    if (custoTotal <= 0 || receitaLiquida <= 0) return 0
    return receitaLiquida / custoTotal
  }

  const calcularGAO = () => {
    const margemContribuicao = receitaLiquida - custosVariaveis
    const lucroOperacional = receitaLiquida - (custosVariaveis + custosFixos)
    if (lucroOperacional <= 0 || margemContribuicao <= 0) return 0
    return margemContribuicao / lucroOperacional
  }

  const calcularBreakeven = () => {
    const margemContribuicaoUnitaria = receitaLiquida > 0 ? (receitaLiquida - custosVariaveis) / receitaLiquida : 0
    if (margemContribuicaoUnitaria <= 0) return 0
    return custosFixos / margemContribuicaoUnitaria
  }

  const markup = calcularMarkup()
  const gao = calcularGAO()
  const breakeven = calcularBreakeven()

  const markupData: ChartData[] = [
    { name: "Markup Atual", value: markup, color: COLORS.markupAtual },
    { name: "Markup Ideal", value: 2.5, color: COLORS.markupIdeal },
  ]

  const generateGAOData = () => {
    const maxRevenue = receitaLiquida * 1.5
    const steps = 5
    const data = []
    for (let i = 0; i <= steps; i++) {
      const revenue = (maxRevenue / steps) * i
      const margemContribuicao = revenue - custosVariaveis
      const lucroOperacional = revenue - (custosVariaveis + custosFixos)
      data.push({
        revenueLevel: i,
        gaoAtual: lucroOperacional > 0 && margemContribuicao > 0 ? margemContribuicao / lucroOperacional : 0,
        gaoThreshold: 1.5,
      })
    }
    return data
  }

  const generateBreakevenData = () => {
    const maxRevenue = receitaLiquida * 1.5
    const steps = 5
    const data = []
    for (let i = 0; i <= steps; i++) {
      const revenue = (maxRevenue / steps) * i
      data.push({
        revenueLevel: i,
        receitaAtual: revenue <= receitaLiquida ? revenue : receitaLiquida,
        pontoEquilibrio: breakeven,
        margemSeguranca: Math.max(0, revenue - breakeven),
      })
    }
    return data
  }

  const gaoData = generateGAOData()
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      {/* Markup Chart */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análise de Markup
          </CardTitle>
          <CardDescription>Markup atual vs. ideal para sustentabilidade do negócio</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {markup === 0 ? (
            <p className="text-center text-muted-foreground">Dados insuficientes para exibir o gráfico</p>
          ) : (
            <ChartContainer
              config={{
                markupAtual: { label: "Markup Atual", color: COLORS.markupAtual },
                markupIdeal: { label: "Markup Ideal", color: COLORS.markupIdeal },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
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
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <gaoStatus.icon className="h-5 w-5" />
            Grau de Alavancagem Operacional (GAO)
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    <strong>Grau de Alavancagem Operacional:</strong><br />
                    - <span style={{ color: COLORS.gao }}>■</span> <strong>GAO Atual:</strong> Sensibilidade do lucro às variações de receita.<br />
                    - <span style={{ color: COLORS.gaoThreshold }}>■</span> <strong>Limite de Risco:</strong> Threshold de 1.5 indicando risco moderado.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Sensibilidade do lucro às variações de receita</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          {gao === 0 ? (
            <p className="text-center text-muted-foreground">Dados insuficientes para exibir o gráfico</p>
          ) : (
            <ChartContainer
              config={{
                gao: { label: "GAO", color: COLORS.gao },
                gaoThreshold: { label: "Limite de Risco", color: COLORS.gaoThreshold },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gaoData} aria-label="Gráfico de GAO">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="revenueLevel"
                    type="number"
                    domain={[0, 5]}
                    tickFormatter={(value) => `${(receitaLiquida * value * 0.3).toFixed(0)}`}
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis stroke="#666" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value) => value.toFixed(2)} />} />
                  <Line
                    type="monotone"
                    dataKey="gaoAtual"
                    name="GAO Atual"
                    stroke={COLORS.gao}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gaoThreshold"
                    name="Limite de Risco"
                    stroke={COLORS.gaoThreshold}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
          <div className="mt-4 space-y-2">
            <div className="flex justify-around text-sm">
              <span>
                <span className="inline-block w-3 h-3 mr-1" style={{ backgroundColor: COLORS.gao }}></span>
                GAO Atual
              </span>
              <span>
                <span className="inline-block w-3 h-3 mr-1" style={{ backgroundColor: COLORS.gaoThreshold }}></span>
                Limite de Risco
              </span>
            </div>
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
      <Card className="overflow-hidden">
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
        <CardContent className="h-[350px]">
          {breakeven === 0 && receitaLiquida === 0 ? (
            <p className="text-center text-muted-foreground">Dados insuficientes para exibir o gráfico</p>
          ) : (
            <ChartContainer
              config={{
                receita: { label: "Receita", color: COLORS.receita },
                breakeven: { label: "Break-even", color: COLORS.breakeven },
                margem: { label: "Margem de Segurança", color: COLORS.margemSeguranca },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
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
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Composição de Custos</CardTitle>
          <CardDescription>Distribuição dos custos e margem de lucro</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]"> {/* Aumentei a altura e removi aspect-square */}
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
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}> {/* Adicionei margens */}
                  <Pie
                    data={composicaoCustos}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}  // Aumentei o innerRadius
                    outerRadius={80}  // Diminuí o outerRadius para deixar espaço para os rótulos
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`} // Mostra porcentagem para economizar espaço
                    labelLine={false} // Remove as linhas dos rótulos para evitar overflow
                  >
                    {composicaoCustos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent formatter={formatarMoeda} />} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}