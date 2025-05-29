"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Plus, Minus, Calculator, X, PieChart, BarChart2, HelpCircle } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

type CustoFixo = {
  id: string
  nome: string
  valor: string
}

type CustoVariavel = {
  id: string
  nome: string
  valor: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export function CalculadoraForm() {
  const [tipoEmpresa, setTipoEmpresa] = useState("mei")
  const [custosFixos, setCustosFixos] = useState<CustoFixo[]>([
    { id: "1", nome: "Aluguel", valor: "0,00" },
    { id: "2", nome: "Equipamentos", valor: "0,00" },
    { id: "3", nome: "Software", valor: "0,00" },
    { id: "4", nome: "Outros gastos fixos", valor: "0,00" },
  ])
  const [custosVariaveis, setCustosVariaveis] = useState<CustoVariavel[]>([
    { id: "1", nome: "Gasolina/transporte", valor: "0,00" },
    { id: "2", nome: "Materiais", valor: "0,00" },
    { id: "3", nome: "Outros gastos variáveis", valor: "0,00" },
  ])
  const [imposto, setImposto] = useState("0,00")
  const [valorHora, setValorHora] = useState(false)
  const [remuneracao, setRemuneracao] = useState("0,00")
  const [diasUteis, setDiasUteis] = useState("0")
  const [horasDia, setHorasDia] = useState("0")
  const [horasEstimadas, setHorasEstimadas] = useState("")
  const [faturamentoBruto, setFaturamentoBruto] = useState("0,00")
  const [tipoServico, setTipoServico] = useState("geral")
  const [unidadeTempo, setUnidadeTempo] = useState("horas")
  const [mostrarResumo, setMostrarResumo] = useState(false)
  const [valorCalculado, setValorCalculado] = useState("0,00")
  const [proLabore, setProLabore] = useState("0,00")
  const [chartData, setChartData] = useState<any[]>([])
  const [barChartData, setBarChartData] = useState<any[]>([])
  const [showPieChart, setShowPieChart] = useState(false)
  const [showBarChart, setShowBarChart] = useState(false)

  const formatarValorMonetario = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, "")
    if (!apenasNumeros) return "0,00"
    const numero = Number.parseInt(apenasNumeros, 10) / 100
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const adicionarCustoFixo = () => {
    setCustosFixos([...custosFixos, { id: Date.now().toString(), nome: "", valor: "0,00" }])
  }

  const removerCustoFixo = (id: string) => {
    setCustosFixos(custosFixos.filter((custo) => custo.id !== id))
  }

  const atualizarCustoFixo = (id: string, campo: "nome" | "valor", valor: string) => {
    if (campo === "valor") {
      valor = formatarValorMonetario(valor)
    }
    setCustosFixos(custosFixos.map((custo) => (custo.id === id ? { ...custo, [campo]: valor } : custo)))
  }

  const adicionarCustoVariavel = () => {
    setCustosVariaveis([...custosVariaveis, { id: Date.now().toString(), nome: "", valor: "0,00" }])
  }

  const removerCustoVariavel = (id: string) => {
    setCustosVariaveis(custosVariaveis.filter((custo) => custo.id !== id))
  }

  const atualizarCustoVariavel = (id: string, campo: "nome" | "valor", valor: string) => {
    if (campo === "valor") {
      valor = formatarValorMonetario(valor)
    }
    setCustosVariaveis(custosVariaveis.map((custo) => (custo.id === id ? { ...custo, [campo]: valor } : custo)))
  }

  const limparFormulario = () => {
    setCustosFixos([
      { id: "1", nome: "Aluguel", valor: "0,00" },
      { id: "2", nome: "Equipamentos", valor: "0,00" },
      { id: "3", nome: "Software", valor: "0,00" },
      { id: "4", nome: "Outros gastos fixos", valor: "0,00" },
    ])
    setCustosVariaveis([
      { id: "1", nome: "Gasolina/transporte", valor: "0,00" },
      { id: "2", nome: "Materiais", valor: "0,00" },
      { id: "3", nome: "Outros gastos variáveis", valor: "0,00" },
    ])
    setImposto("0,00")
    setValorHora(false)
    setRemuneracao("0,00")
    setDiasUteis("0")
    setHorasDia("0")
    setHorasEstimadas("")
    setFaturamentoBruto("0,00")
    setMostrarResumo(false)
    setValorCalculado("0,00")
    setProLabore("0,00")
    setChartData([])
    setBarChartData([])
    setShowPieChart(false)
    setShowBarChart(false)
  }

  const converterParaNumero = (valor: string) => {
    return parseFloat(valor.replace(".", "").replace(",", ".")) || 0
  }

  const calcularPreco = () => {
    const totalCustosFixos = custosFixos.reduce(
      (total, custo) => total + converterParaNumero(custo.valor),
      0
    )

    const totalCustosVariaveis = custosVariaveis.reduce(
      (total, custo) => total + converterParaNumero(custo.valor),
      0
    )

    let valorImposto = 0
    if (tipoEmpresa === "mei") {
      valorImposto = 70.60
    } else {
      valorImposto = Math.max(181.14, converterParaNumero(faturamentoBruto) * (converterParaNumero(imposto) / 100))
    }

    let valorPorHora = converterParaNumero(remuneracao)
    if (valorHora) {
      const diasUteisNum = parseInt(diasUteis) || 20
      const horasDiaNum = parseInt(horasDia) || 8
      valorPorHora = converterParaNumero(remuneracao) / (diasUteisNum * horasDiaNum)
    }

    let horasTotais = parseInt(horasEstimadas) || 0
    if (unidadeTempo === "dias") {
      horasTotais *= parseInt(horasDia) || 8
    } else if (unidadeTempo === "semanas") {
      horasTotais *= (parseInt(horasDia) || 8) * 5
    }

    const custoMensal = totalCustosFixos + valorImposto
    const custoHora = custoMensal / ((parseInt(diasUteis) || 20) * (parseInt(horasDia) || 8))
    const custoProjetoPorHora = custoHora * horasTotais
    const custoVariavelProjeto = totalCustosVariaveis
    const remuneracaoProjeto = valorPorHora * horasTotais

    const valorProLabore = tipoEmpresa === "mei" ? remuneracaoProjeto * 0.28 : 0
    setProLabore(valorProLabore.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))

    const valorTotalProjeto = custoProjetoPorHora + custoVariavelProjeto + remuneracaoProjeto + valorProLabore

    setValorCalculado(
      valorTotalProjeto.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    )

    const pieData = [
      { name: 'Custos Fixos', value: custoProjetoPorHora },
      { name: 'Custos Variáveis', value: custoVariavelProjeto },
      { name: 'Remuneração', value: remuneracaoProjeto },
      { name: 'Pró-labore', value: valorProLabore },
      { name: 'Impostos', value: valorImposto }
    ].filter(item => item.value > 0)

    setChartData(pieData)

    const barData = [
      {
        name: 'Distribuição de Custos',
        'Custos Fixos': custoProjetoPorHora,
        'Custos Variáveis': custoVariavelProjeto,
        'Remuneração': remuneracaoProjeto,
        'Pró-labore': valorProLabore,
        'Impostos': valorImposto
      }
    ]

    setBarChartData(barData)
    setMostrarResumo(true)
  }

  const HelpTooltip = ({ text }: { text: string }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-sm">
        {text}
      </HoverCardContent>
    </HoverCard>
  )

  return (
    <Card className="bg-background border-border">
      <CardHeader className="bg-background text-center border-b border-border">
        <div className="flex justify-center mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">V</span>
          </div>
        </div>
        <CardTitle className="text-xl text-foreground">Calculadora de Precificação</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Seção Tipo de Empresa */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium">Tipo de Empresa</h3>
            <HelpTooltip text="Escolha entre MEI (Microempreendedor Individual) ou ME (Microempresa). MEI tem imposto fixo de R$ 70,60, enquanto ME tem imposto variável conforme faturamento." />
          </div>
          <RadioGroup value={tipoEmpresa} onValueChange={setTipoEmpresa} className="flex gap-2">
            <div className={cn("flex items-center justify-center rounded-md border border-border px-4 py-2", tipoEmpresa === "mei" && "bg-purple-600/10 border-purple-600")}>
              <RadioGroupItem value="mei" id="mei" className="sr-only" />
              <Label htmlFor="mei" className={cn("cursor-pointer font-medium", tipoEmpresa === "mei" && "text-purple-600")}>
                MEI
              </Label>
            </div>
            <div className={cn("flex items-center justify-center rounded-md border border-border px-4 py-2", tipoEmpresa === "me" && "bg-purple-600/10 border-purple-600")}>
              <RadioGroupItem value="me" id="me" className="sr-only" />
              <Label htmlFor="me" className={cn("cursor-pointer font-medium", tipoEmpresa === "me" && "text-purple-600")}>
                ME
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground mt-2">
            {tipoEmpresa === "mei" ? "MEI: R$ 70,60" : "ME: Imposto variável conforme faturamento (a partir de R$ 181,14)"}
          </p>

          {tipoEmpresa === "me" && (
            <div className="mt-4">
              <Label htmlFor="faturamento-bruto" className="text-xs mb-1 block">
                Faturamento Bruto Anual
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R$</span>
                <Input
                  id="faturamento-bruto"
                  value={faturamentoBruto}
                  onChange={(e) => setFaturamentoBruto(formatarValorMonetario(e.target.value))}
                  className="pl-9"
                  placeholder="Faturamento bruto anual"
                />
              </div>
            </div>
          )}
        </div>

        {/* Seção Tipo de Serviço - Movida para o topo */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium">Serviço</h3>
            <HelpTooltip text="Descreva detalhadamente o serviço que será prestado. Isso ajudará na precificação adequada." />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Digite o tipo de serviço"
              value={tipoServico}
              onChange={(e) => setTipoServico(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Seção Custos Variáveis - Movida para segundo lugar */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium">Custos do Serviço</h3>
            <HelpTooltip text="Custos específicos para este serviço, como materiais, deslocamento, etc." />
          </div>
          <div className="space-y-2">
            {custosVariaveis.map((custo) => (
              <div key={custo.id} className="flex gap-2">
                <Input
                  value={custo.nome}
                  onChange={(e) => atualizarCustoVariavel(custo.id, "nome", e.target.value)}
                  placeholder="Nome do custo"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input
                    value={custo.valor}
                    onChange={(e) => atualizarCustoVariavel(custo.id, "valor", e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerCustoVariavel(custo.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={adicionarCustoVariavel} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar custo do serviço
            </Button>
          </div>
        </div>

        {/* Seção Remuneração - Movida para terceiro lugar */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium">Valor do Trabalho</h3>
            <HelpTooltip text="Quanto você quer receber pelo seu trabalho neste serviço." />
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <Switch id="valor-hora" checked={valorHora} onCheckedChange={setValorHora} />
            <Label htmlFor="valor-hora">Não sei o valor por hora</Label>
          </div>

          {!valorHora ? (
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                value={remuneracao}
                onChange={(e) => setRemuneracao(formatarValorMonetario(e.target.value))}
                className="pl-9"
                placeholder="Valor por hora"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R$</span>
                <Input
                  value={remuneracao}
                  onChange={(e) => setRemuneracao(formatarValorMonetario(e.target.value))}
                  className="pl-9"
                  placeholder="Remuneração mensal desejada"
                />
              </div>
              <div>
                <Label htmlFor="dias-uteis" className="text-xs">
                  Dias Úteis no Mês
                </Label>
                <Input
                  id="dias-uteis"
                  value={diasUteis}
                  onChange={(e) => setDiasUteis(e.target.value.replace(/\D/g, ""))}
                  placeholder="Dias úteis no mês"
                />
              </div>
              <div>
                <Label htmlFor="horas-dia" className="text-xs">
                  Horas Produtivas por Dia
                </Label>
                <Input
                  id="horas-dia"
                  value={horasDia}
                  onChange={(e) => setHorasDia(e.target.value.replace(/\D/g, ""))}
                  placeholder="Horas produtivas por dia"
                />
              </div>
            </div>
          )}
        </div>

        {/* Seção Horas Estimadas */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium">Horas Estimadas do Serviço/Projeto</h3>
            <HelpTooltip text="Tempo total estimado para realizar o projeto. Você pode informar em horas, dias ou semanas. Para dias e semanas, usaremos suas horas produtivas por dia para o cálculo." />
          </div>
          <div className="flex gap-2">
            <Input
              value={horasEstimadas}
              onChange={(e) => setHorasEstimadas(e.target.value.replace(/\D/g, ""))}
              placeholder="Horas estimadas"
            />
            <Select value={unidadeTempo} onValueChange={setUnidadeTempo}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horas">Horas</SelectItem>
                <SelectItem value="dias">Dias</SelectItem>
                <SelectItem value="semanas">Semanas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 pt-4">
          <Button 
            className="flex-1 bg-primary hover:bg-primary/80"
            onClick={calcularPreco}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Calcular
          </Button>
          <Button variant="outline" className="flex-1" onClick={limparFormulario}>
            Limpar
          </Button>
        </div>

        {/* Resumo de Cálculo - Atualizado para mostrar primeiro os custos do serviço */}
        {mostrarResumo && (
          <div className="mt-6 border border-border rounded-lg p-4 bg-muted/30">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Tipo de serviço</p>
                <p className="font-medium capitalize">{tipoServico}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Custos do serviço</p>
                <ul className="space-y-1">
                  {custosVariaveis.filter(c => c.nome && c.valor !== "0,00").map((custo) => (
                    <li key={custo.id} className="flex justify-between">
                      <span>{custo.nome}</span>
                      <span>R$ {custo.valor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Valor do trabalho</p>
                <p className="font-medium">
                  {valorHora 
                    ? `R$ ${remuneracao} por mês (${diasUteis} dias × ${horasDia} horas)`
                    : `R$ ${remuneracao} por hora`}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Impostos e taxas</p>
                <p className="font-medium">
                  {tipoEmpresa === "mei" ? "R$ 70,60 (fixo)" : `${imposto}%`}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Tempo estimado</p>
                <p className="font-medium">{horasEstimadas} {unidadeTempo}</p>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <p className="text-lg font-semibold flex justify-between">
                  <span>Valor total do serviço:</span>
                  <span className="text-purple-600">R$ {valorCalculado}</span>
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPieChart(!showPieChart)}
                  className="flex-1"
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Gráfico Pizza
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowBarChart(!showBarChart)}
                  className="flex-1"
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Gráfico Barras
                </Button>
              </div>

              {showPieChart && chartData.length > 0 && (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {showBarChart && barChartData.length > 0 && (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
                      />
                      <Legend />
                      <Bar dataKey="Custos Fixos" fill="#0088FE" />
                      <Bar dataKey="Custos Variáveis" fill="#00C49F" />
                      <Bar dataKey="Remuneração" fill="#FFBB28" />
                      <Bar dataKey="Pró-labore" fill="#FF8042" />
                      <Bar dataKey="Impostos" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}