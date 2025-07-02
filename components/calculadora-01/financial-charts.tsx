"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, AlertTriangle, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FinancialChartsProps {
  custosFixos: number
  custosVariaveis: number
  margemLucro: number // em %
  receitaLiquida: number
  impostos: number
}

export function FinancialCharts({
  custosFixos,
  custosVariaveis,
  margemLucro,
  receitaLiquida,
  impostos,
}: FinancialChartsProps) {
  const custoTotal = custosFixos + custosVariaveis

  const calcularMarkup = () => {
    if (custoTotal === 0) return 0
    return receitaLiquida / custoTotal
  }

  const calcularGAO = () => {
    const margemContribuicao = receitaLiquida - custosVariaveis
    const lucroOperacional = receitaLiquida - custoTotal
    if (lucroOperacional === 0) return 0
    return margemContribuicao / lucroOperacional
  }

  const calcularBreakeven = () => {
    if (receitaLiquida === 0) return 0
    const margemContribuicaoPercentual =
      (receitaLiquida - custosVariaveis) / receitaLiquida
    if (margemContribuicaoPercentual === 0) return 0
    return custosFixos / margemContribuicaoPercentual
  }

  const markup = calcularMarkup()
  const gao = calcularGAO()
  const breakeven = calcularBreakeven()

  const markupData = [
    { name: "Markup Atual", value: markup, color: "#8b5cf6" },
    { name: "Markup Ideal", value: 2.5, color: "#10b981" },
  ]

  const gaoData = [
    {
      name: "GAO Atual",
      value: gao,
      color: gao > 2 ? "#ef4444" : gao > 1.5 ? "#f59e0b" : "#10b981",
    },
  ]

  const breakevenData = [
    { name: "Receita Atual", value: receitaLiquida, fill: "#8b5cf6" },
    { name: "Ponto de Equilíbrio", value: breakeven, fill: "#ef4444" },
    {
      name: "Margem Segurança",
      value: Math.max(0, receitaLiquida - breakeven),
      fill: "#10b981",
    },
  ]

  const composicaoCustos = [
    { name: "Custos Fixos", value: custosFixos, fill: "#ef4444" },
    { name: "Custos Variáveis", value: custosVariaveis, fill: "#f59e0b" },
    {
      name: "Margem Lucro",
      value: (receitaLiquida * margemLucro) / 100,
      fill: "#10b981",
    },
    { name: "Impostos", value: impostos, fill: "#6b7280" },
  ]

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })

  const getGaoStatus = (gao: number) => {
    if (gao > 2)
      return { status: "Alto Risco", color: "destructive", icon: AlertTriangle }
    if (gao > 1.5)
      return { status: "Moderado", color: "secondary", icon: TrendingUp }
    return { status: "Baixo Risco", color: "default", icon: Target }
  }

  const gaoStatus = getGaoStatus(gao)
  const GaoIcon = gaoStatus.icon

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Markup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análise de Markup
          </CardTitle>
          <CardDescription>
            Markup atual vs. ideal para sustentabilidade do negócio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              markup: { label: "Markup", color: "hsl(var(--chart-1))" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={markupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" barSize={40}>
                  {markupData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Markup Atual:</span>
              <Badge variant={markup > 2 ? "default" : "destructive"}>
                {markup.toFixed(2)}x
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {markup < 2
                ? "⚠️ Markup baixo - considere aumentar preços"
                : "✅ Markup adequado"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* GAO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GaoIcon className="h-5 w-5" />
            Grau de Alavancagem Operacional (GAO)
          </CardTitle>
          <CardDescription>
            Sensibilidade do lucro às variações de receita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              gao: { label: "GAO", color: "hsl(var(--chart-2))" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gaoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, Math.max(3, gao + 1)]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" barSize={40}>
                  <Cell fill={gaoData[0].color} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">GAO Atual:</span>
              <Badge variant={gaoStatus.color as any}>
                {gao.toFixed(2)} - {gaoStatus.status}
              </Badge>
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

      {/* Break-even */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Análise de Break-even
          </CardTitle>
          <CardDescription>Ponto de equilíbrio e margem de segurança</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              receita: { label: "Receita", color: "hsl(var(--chart-1))" },
              breakeven: { label: "Break-even", color: "hsl(var(--chart-3))" },
              margem: { label: "Margem", color: "hsl(var(--chart-2))" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakevenData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatarMoeda(Number(value))} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatarMoeda(Number(value))}
                    />
                  }
                />
                <Bar dataKey="value" barSize={40}>
                  {breakevenData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Break-even:</span>
              <span className="text-sm font-medium">
                {formatarMoeda(breakeven)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Margem Segurança:
              </span>
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
          <CardDescription>
            Distribuição dos custos e margem de lucro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              custos: { label: "Custos", color: "hsl(var(--chart-4))" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={composicaoCustos}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  labelLine={false}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {composicaoCustos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatarMoeda(Number(value))}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
