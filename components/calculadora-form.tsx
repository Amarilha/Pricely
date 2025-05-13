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
import { Plus, Minus, Calculator, X } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [horasEstimadas, setHorasEstimadas] = useState("0")
  const [faturamentoBruto, setFaturamentoBruto] = useState("0,00")
  const [tipoServico, setTipoServico] = useState("geral")
  const [unidadeTempo, setUnidadeTempo] = useState("horas")
  
  // Novo estado para controlar a exibição do resumo
  const [mostrarResumo, setMostrarResumo] = useState(false)
  const [valorCalculado, setValorCalculado] = useState("0,00")

  const formatarValorMonetario = (valor: string): string => {
    // Remove todos os caracteres não numéricos
    const apenasNumeros = valor.replace(/\D/g, "")

    // Se não houver números, retorna "0,00"
    if (!apenasNumeros) return "0,00"

    // Converte para número e divide por 100 para obter o valor com decimais
    const numero = Number.parseInt(apenasNumeros, 10) / 100

    // Formata o número com vírgula como separador decimal e milhares com ponto
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
    setHorasEstimadas("0")
    setFaturamentoBruto("0,00")
    setMostrarResumo(false)
    setValorCalculado("0,00")
  }

  const converterParaNumero = (valor: string) => {
    return parseFloat(valor.replace(".", "").replace(",", ".")) || 0
  }

  const calcularPreco = () => {
    // Converter todos os custos fixos para números e somá-los
    const totalCustosFixos = custosFixos.reduce(
      (total, custo) => total + converterParaNumero(custo.valor),
      0
    )

    // Converter todos os custos variáveis para números e somá-los
    const totalCustosVariaveis = custosVariaveis.reduce(
      (total, custo) => total + converterParaNumero(custo.valor),
      0
    )

    // Calcular o valor do imposto dependendo do tipo de empresa
    let valorImposto = 0
    if (tipoEmpresa === "mei") {
      valorImposto = 70.60 // Valor fixo para MEI
    } else {
      // Para ME, baseado no faturamento bruto (simplificado)
      valorImposto = Math.max(181.14, converterParaNumero(faturamentoBruto) * (converterParaNumero(imposto) / 100))
    }

    // Calcular o valor da hora
    let valorPorHora = converterParaNumero(remuneracao)
    if (valorHora) {
      // Se o usuário não sabe o valor por hora, calcule com base na remuneração mensal
      const diasUteisNum = parseInt(diasUteis) || 20 // padrão para 20 dias se não for fornecido
      const horasDiaNum = parseInt(horasDia) || 8 // padrão para 8 horas se não for fornecido
      valorPorHora = converterParaNumero(remuneracao) / (diasUteisNum * horasDiaNum)
    }

    // Calcular horas estimadas com base na unidade selecionada
    let horasTotais = parseInt(horasEstimadas) || 0
    if (unidadeTempo === "dias") {
      horasTotais *= parseInt(horasDia) || 8 // padrão para 8 horas se não for fornecido
    } else if (unidadeTempo === "semanas") {
      horasTotais *= (parseInt(horasDia) || 8) * 5 // 5 dias úteis por semana
    }

    // Calcular o valor total do projeto
    const custoMensal = totalCustosFixos + valorImposto
    const custoHora = custoMensal / ((parseInt(diasUteis) || 20) * (parseInt(horasDia) || 8))
    const custoProjetoPorHora = custoHora * horasTotais
    const custoVariavelProjeto = totalCustosVariaveis
    const remuneracaoProjeto = valorPorHora * horasTotais

    const valorTotalProjeto = custoProjetoPorHora + custoVariavelProjeto + remuneracaoProjeto

    // Formatar o valor total para moeda brasileira
    setValorCalculado(
      valorTotalProjeto.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).replace(".", ",")
    )

    // Mostrar o resumo
    setMostrarResumo(true)
  }

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
        <div>
          <h3 className="text-sm font-medium mb-2">Tipo de Empresa</h3>
          <RadioGroup value={tipoEmpresa} onValueChange={setTipoEmpresa} className="flex gap-2">
            <div
              className={cn(
                "flex items-center justify-center rounded-md border border-border px-4 py-2",
                tipoEmpresa === "mei" && "bg-purple-600/10 border-purple-600",
              )}
            >
              <RadioGroupItem value="mei" id="mei" className="sr-only" />
              <Label
                htmlFor="mei"
                className={cn("cursor-pointer font-medium", tipoEmpresa === "mei" && "text-purple-600")}
              >
                MEI
              </Label>
            </div>
            <div
              className={cn(
                "flex items-center justify-center rounded-md border border-border px-4 py-2",
                tipoEmpresa === "me" && "bg-purple-600/10 border-purple-600",
              )}
            >
              <RadioGroupItem value="me" id="me" className="sr-only" />
              <Label
                htmlFor="me"
                className={cn("cursor-pointer font-medium", tipoEmpresa === "me" && "text-purple-600")}
              >
                ME
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground mt-2">
            {tipoEmpresa === "mei"
              ? "MEI: R$ 70,60"
              : "ME: Imposto variável conforme faturamento (a partir de R$ 181,14)"}
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
              <p className="text-xs text-muted-foreground mt-1">
                Usado para calcular o imposto conforme a faixa de faturamento
              </p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Serviço</h3>
          <Select value={tipoServico} onValueChange={setTipoServico}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geral">Geral</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Custos Fixos Mensais</h3>
          <div className="space-y-2">
            {custosFixos.map((custo) => (
              <div key={custo.id} className="flex gap-2">
                <Input
                  value={custo.nome}
                  onChange={(e) => atualizarCustoFixo(custo.id, "nome", e.target.value)}
                  placeholder="Nome do custo"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input
                    value={custo.valor}
                    onChange={(e) => atualizarCustoFixo(custo.id, "valor", e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerCustoFixo(custo.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={adicionarCustoFixo} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar custo fixo
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Custos Variáveis</h3>
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
              Adicionar custo variável
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Impostos e Taxas</h3>
          <div className="flex gap-2 items-center">
            <Input
              value={imposto}
              onChange={(e) => {
                // Para o campo de imposto, permitimos apenas números e vírgula
                const valor = e.target.value.replace(/[^\d,]/g, "")
                // Garantimos que haja apenas uma vírgula
                const partes = valor.split(",")
                const valorFormatado = partes[0] + (partes.length > 1 ? "," + partes.slice(1).join("") : "")
                setImposto(valorFormatado)
              }}
              placeholder="Percentual de imposto"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-2">Remuneração por Hora</h3>
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
                  onChange={(e) => {
                    // Permitir apenas números
                    const numeroApenas = e.target.value.replace(/\D/g, "")
                    setDiasUteis(numeroApenas)
                  }}
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
                  onChange={(e) => {
                    // Permitir apenas números
                    const numeroApenas = e.target.value.replace(/\D/g, "")
                    setHorasDia(numeroApenas)
                  }}
                  placeholder="Horas produtivas por dia"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Horas Estimadas do Serviço/Projeto</h3>
          <div className="flex gap-2">
            <Input
              value={horasEstimadas}
              onChange={(e) => {
                // Permitir apenas números
                const numeroApenas = e.target.value.replace(/\D/g, "")
                setHorasEstimadas(numeroApenas)
              }}
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

        {/* Resumo de cálculo */}
        {mostrarResumo && (
          <div className="mt-6 border border-border rounded-lg p-4 bg-muted/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Resumo do Orçamento</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMostrarResumo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Tipo de empresa</p>
                <p className="font-medium">{tipoEmpresa === "mei" ? "MEI" : "ME"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Tipo de serviço</p>
                <p className="font-medium capitalize">{tipoServico}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Custos fixos mensais</p>
                <ul className="space-y-1">
                  {custosFixos.filter(c => c.nome && c.valor !== "0,00").map((custo) => (
                    <li key={custo.id} className="flex justify-between">
                      <span>{custo.nome}</span>
                      <span>R$ {custo.valor}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Custos variáveis</p>
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
                <p className="text-sm text-muted-foreground">Impostos</p>
                <p className="font-medium">
                  {tipoEmpresa === "mei" ? "R$ 70,60 (fixo)" : `${imposto}%`}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Remuneração</p>
                <p className="font-medium">
                  {valorHora 
                    ? `R$ ${remuneracao} por mês (${diasUteis} dias × ${horasDia} horas)`
                    : `R$ ${remuneracao} por hora`}
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}