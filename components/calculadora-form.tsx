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
import { Plus, Minus, Calculator } from "lucide-react"
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
          <Select defaultValue="geral">
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
                  onChange={(e) => setDiasUteis(e.target.value)}
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
                  onChange={(e) => setHorasDia(e.target.value)}
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
              onChange={(e) => setHorasEstimadas(e.target.value)}
              placeholder="Horas estimadas"
            />
            <Select defaultValue="horas">
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
          <Button className="flex-1 bg-primary hover:bg-primary/80">
            <Calculator className="mr-2 h-4 w-4" />
            Calcular
          </Button>
          <Button variant="outline" className="flex-1" onClick={limparFormulario}>
            Limpar
          </Button>
        </div>
        {/* 
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium mb-2">Importar Arquivo (Plano PRO)</h3>
          <div className="border border-dashed border-border rounded-md p-6 text-center">
            <div className="mb-2 flex justify-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold">PRO</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Arraste e solte o arquivo aqui ou</p>
            <Button variant="outline" size="sm">
              Selecionar Arquivo
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Nenhum arquivo escolhido</p>
          </div>
        </div>
        */}
      </CardContent>
    </Card>
  )
}
