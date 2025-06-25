"use client"

import { useState } from "react"
import {
  Calculator,
  FileText,
  Camera,
  Wrench,
  Package,
  Palette,
  Users,
  Plus,
  Trash2,
  Building2,
  Briefcase,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export  function CalculadoraOrcamentoInterativa() {
  // Estado para modo da calculadora
  const [modoObra, setModoObra] = useState(true) // true = Obra, false = Serviço

  // Estados para dados de cadastro
  const [dadosCadastro, setDadosCadastro] = useState({
    dataOrcamento: "",
    cliente: "",
    projeto: "",
    endereco: "",
    responsavel: "",
  })

  const [descricaoProjeto, setDescricaoProjeto] = useState("")
  const [areaProjeto, setAreaProjeto] = useState(0)

  // Estados para materiais/insumos
  const [materiais, setMateriais] = useState([{ id: 1, qtBarras: 0, quantKg: 0, precoKg: 0, descricao: "" }])

  // Estados para mão de obra
  const [maoObraExecucao, setMaoObraExecucao] = useState([
    { id: 1, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 },
  ])

  const [maoObraInstalacao, setMaoObraInstalacao] = useState([
    { id: 1, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 },
  ])

  // Estados para itens/serviços
  const [itensServicos, setItensServicos] = useState([{ id: 1, qt: 0, unid: "", precoUnit: 0, descricao: "" }])

  // Estados para acabamento/extras
  const [acabamentoExtras, setAcabamentoExtras] = useState([{ id: 1, quant: 0, unid: "kg", precoKg: 0, descricao: "" }])

  // Estados para consumo/despesas
  const [consumoDespesas, setConsumoDespesas] = useState([{ id: 1, qt: 0, unid: "", preco: 0, descricao: "" }])

  // Estados para dados finais
  const [dadosFinais, setDadosFinais] = useState({
    engenharia: 0,
    comissao: 0,
    consultoria: 0,
    impostoPercentual: 0,
    margemLucro: 0,
  })

  const [observacoes, setObservacoes] = useState("")
  const [fotoObra, setFotoObra] = useState("")

  // Funções para adicionar/remover itens (adaptadas para ambos os modos)
  // Helper function to parse and format number inputs
  const parseAndFormat = (value: string): number => {
    const num = parseFloat(value.replace(/[^0-9,-]/g, '').replace(',', '.')) || 0;
    return num;
  };


  const adicionarMaterial = () => {
    const novoId = Math.max(...materiais.map((item) => item.id)) + 1
    setMateriais([...materiais, { id: novoId, qtBarras: 0, quantKg: 0, precoKg: 0, descricao: "" }])
  }

  const removerMaterial = (id: number) => {
    if (materiais.length > 1) {
      setMateriais(materiais.filter((item) => item.id !== id))
    }
  }

  const adicionarMaoObraExec = () => {
    const novoId = Math.max(...maoObraExecucao.map((item) => item.id)) + 1
    setMaoObraExecucao([...maoObraExecucao, { id: novoId, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 }])
  }

  const removerMaoObraExec = (id: number) => {
    if (maoObraExecucao.length > 1) {
      setMaoObraExecucao(maoObraExecucao.filter((item) => item.id !== id))
    }
  }

  const adicionarMaoObraInst = () => {
    const novoId = Math.max(...maoObraInstalacao.map((item) => item.id)) + 1
    setMaoObraInstalacao([
      ...maoObraInstalacao,
      { id: novoId, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 },
    ])
  }

  const removerMaoObraInst = (id: number) => {
    if (maoObraInstalacao.length > 1) {
      setMaoObraInstalacao(maoObraInstalacao.filter((item) => item.id !== id))
    }
  }

  const adicionarItemServico = () => {
    const novoId = Math.max(...itensServicos.map((item) => item.id)) + 1
    setItensServicos([...itensServicos, { id: novoId, qt: 0, unid: "", precoUnit: 0, descricao: "" }])
  }

  const removerItemServico = (id: number) => {
    if (itensServicos.length > 1) {
      setItensServicos(itensServicos.filter((item) => item.id !== id))
    }
  }

  const adicionarAcabamentoExtra = () => {
    const novoId = Math.max(...acabamentoExtras.map((item) => item.id)) + 1
    setAcabamentoExtras([...acabamentoExtras, { id: novoId, quant: 0, unid: "kg", precoKg: 0, descricao: "" }])
  }

  const removerAcabamentoExtra = (id: number) => {
    if (acabamentoExtras.length > 1) {
      setAcabamentoExtras(acabamentoExtras.filter((item) => item.id !== id))
    }
  }

  const adicionarConsumoDespesa = () => {
    const novoId = Math.max(...consumoDespesas.map((item) => item.id)) + 1
    setConsumoDespesas([...consumoDespesas, { id: novoId, qt: 0, unid: "", preco: 0, descricao: "" }])
  }

  const removerConsumoDespesa = (id: number) => {
    if (consumoDespesas.length > 1) {
      setConsumoDespesas(consumoDespesas.filter((item) => item.id !== id))
    }
  }

  // Cálculos automáticos
  const calcularMateriais = () => {
    return materiais.reduce((total, item) => total + item.quantKg * item.precoKg, 0)
  }

  const calcularMaoObraExecucao = () => {
    return maoObraExecucao.reduce((total, item) => total + item.pessoas * item.dias * item.hrsDia * item.precoHr, 0)
  }

  const calcularMaoObraInstalacao = () => {
    return maoObraInstalacao.reduce((total, item) => total + item.pessoas * item.dias * item.hrsDia * item.precoHr, 0)
  }

  const calcularItensServicos = () => {
    return itensServicos.reduce((total, item) => total + item.qt * item.precoUnit, 0)
  }

  const calcularAcabamentoExtras = () => {
    return acabamentoExtras.reduce((total, item) => total + item.quant * item.precoKg, 0)
  }

  const calcularConsumoDespesas = () => {
    return consumoDespesas.reduce((total, item) => total + item.qt * item.preco, 0)
  }

  const pesoTotal = materiais.reduce((total, item) => total + item.quantKg, 0)
  const valorMateriais = calcularMateriais()
  const valorMaoObraExec = calcularMaoObraExecucao()
  const valorMaoObraInst = calcularMaoObraInstalacao()
  const valorItensServicos = calcularItensServicos()
  const valorAcabamentoExtras = calcularAcabamentoExtras()
  const valorConsumoDespesas = calcularConsumoDespesas()

  const custoTotal =
    valorMateriais +
    valorMaoObraExec +
    valorMaoObraInst +
    valorItensServicos +
    valorAcabamentoExtras +
    valorConsumoDespesas
  // Engenharia e Comissão agora são percentuais do custoTotal
  const valorEngenharia = custoTotal * (dadosFinais.engenharia / 100)
  const valorComissao = custoTotal * (dadosFinais.comissao / 100)
  const valorImposto = custoTotal * (dadosFinais.impostoPercentual / 100)
  const custoTotalComTaxas = custoTotal + valorEngenharia + valorComissao + dadosFinais.consultoria + valorImposto
  const valorLucro = custoTotalComTaxas * (dadosFinais.margemLucro / 100)
  const precoFinal = custoTotalComTaxas + valorLucro

  const precoPorKg = pesoTotal > 0 ? precoFinal / pesoTotal : 0
  const precoPorUnidade = areaProjeto > 0 ? precoFinal / areaProjeto : 0

  // Verificar campos preenchidos para progresso
  const camposPreenchidos = {
    dadosCadastro: dadosCadastro.cliente && dadosCadastro.projeto,
    descricaoProjeto: descricaoProjeto.length > 0,
    materiais: materiais.some((item) => item.quantKg > 0),
    maoObraExec: maoObraExecucao.some((item) => item.pessoas > 0),
    maoObraInst: maoObraInstalacao.some((item) => item.pessoas > 0),
    itensServicos: itensServicos.some((item) => item.qt > 0),
    acabamentoExtras: acabamentoExtras.some((item) => item.quant > 0),
    consumoDespesas: consumoDespesas.some((item) => item.qt > 0),
    observacoes: observacoes.length > 0,
    foto: fotoObra.length > 0,
  }

  const etapasConcluidas = Object.values(camposPreenchidos).filter(Boolean).length
  const progressoPercentual = (etapasConcluidas / 10) * 100

  // Labels dinâmicos baseados no modo
  const labels = modoObra
    ? {
        titulo: "Calculadora de Orçamento - Obras",
        projeto: "Obra",
        endereco: "Endereço da Obra",
        area: "Área de Cobertura (m²)",
        materiais: "Matéria Prima",
        maoObraExec: "Mão de Obra - Fabricação",
        maoObraInst: "Mão de Obra - Instalação",
        itensServicos: "Itens Comerciais",
        acabamentoExtras: "Acabamento",
        consumoDespesas: "Consumo",
        foto: "Foto da Obra",
        unidadeMedida: "m²",
      }
    : {
        titulo: "Calculadora de Orçamento - Serviços",
        projeto: "Serviço/Projeto",
        endereco: "Local de Execução",
        area: "Quantidade/Escopo",
        materiais: "Materiais/Insumos",
        maoObraExec: "Mão de Obra - Execução",
        maoObraInst: "Mão de Obra - Suporte",
        itensServicos: "Itens/Serviços Terceiros",
        acabamentoExtras: "Extras/Adicionais",
        consumoDespesas: "Despesas/Consumo",
        foto: "Foto/Referência",
        unidadeMedida: "unid",
      }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        {/* Header com Switch */}
        <div className="bg-card border-b p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-foreground">{labels.titulo}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Obra</span>
                  <Switch checked={!modoObra} onCheckedChange={(checked) => setModoObra(!checked)} />
                  <span className="text-sm font-medium">Serviço</span>
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">
              {modoObra
                ? "Insira os valores para calcular orçamentos de obras e construções"
                : "Insira os valores para calcular orçamentos de serviços em geral"}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Linha de Progresso */}
          <div className="relative mb-12 bg-card p-6 rounded-xl shadow-lg border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Progresso do Orçamento</h2>
              <span className="text-sm font-medium text-chart-1">{etapasConcluidas}/10 seções preenchidas</span>
            </div>

            <div className="w-full bg-muted rounded-full h-3 mb-6">
              <div
                className="bg-gradient-to-r from-chart-1 to-chart-2 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressoPercentual}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {Object.entries(camposPreenchidos).map(([key, concluido], index) => (
                <div key={key} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      concluido ? "bg-green-500 text-white shadow-lg" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1 text-center max-w-16 truncate capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda */}
            <div className="space-y-6">

              {/* 1-2 Dados de Cadastro */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    1-2. Dados de Cadastro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Data do Orçamento</Label>
                      <Input
                        type="date"
                        value={dadosCadastro.dataOrcamento}
                        onChange={(e) => setDadosCadastro({ ...dadosCadastro, dataOrcamento: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Cliente</Label>
                      <Input
                        value={dadosCadastro.cliente}
                        onChange={(e) => setDadosCadastro({ ...dadosCadastro, cliente: e.target.value })}
                        placeholder="Nome do cliente"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>{labels.projeto}</Label>
                    <Input
                      value={dadosCadastro.projeto}
                      onChange={(e) => setDadosCadastro({ ...dadosCadastro, projeto: e.target.value })}
                      placeholder={modoObra ? "Nome da obra" : "Nome do serviço/projeto"}
                    />
                  </div>
                  <div>
                    <Label>{labels.endereco}</Label>
                    <Input
                      value={dadosCadastro.endereco}
                      onChange={(e) => setDadosCadastro({ ...dadosCadastro, endereco: e.target.value })}
                      placeholder={modoObra ? "Endereço completo da obra" : "Local onde será executado"}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Responsável</Label>
                      <Input
                        value={dadosCadastro.responsavel}
                        onChange={(e) => setDadosCadastro({ ...dadosCadastro, responsavel: e.target.value })}
                        placeholder="Nome do responsável"
                      />
                    </div>
                    <div>
                      <Label>{labels.area}</Label>
                      <Input
                        type="number"
                        value={areaProjeto}
                        onChange={(e) => setAreaProjeto(parseAndFormat(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Descrição do {modoObra ? "Projeto" : "Serviço"}</Label>
                    <Textarea
                      value={descricaoProjeto}
                      onChange={(e) => setDescricaoProjeto(e.target.value)}
                      placeholder={
                        modoObra
                          ? "Descreva detalhadamente o que será construído..."
                          : "Descreva detalhadamente o serviço a ser executado..."
                      }
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* 7-8 Mão de Obra Execução */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      7-8. {labels.maoObraExec}
                    </div>
                    <Button onClick={adicionarMaoObraExec} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {maoObraExecucao.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Serviço {index + 1}</h4>
                          {maoObraExecucao.length > 1 && (
                            <Button onClick={() => removerMaoObraExec(item.id)} size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="mb-3">
                          <Label>Descrição do Serviço</Label>
                          <Input
                            value={item.descricao}
                            onChange={(e) => {
                              const newItems = maoObraExecucao.map((mo) =>
                                mo.id === item.id ? { ...mo, descricao: e.target.value } : mo,
                              )
                              setMaoObraExecucao(newItems)
                            }}
                            placeholder={
                              modoObra ? "Ex: Fabricação da estrutura" : "Ex: Desenvolvimento, execução, etc."
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-3 mb-3">
                          <div>
                            <Label>Pessoas</Label>
                            <Input
                              type="number"
                              value={item.pessoas}
                                onChange={(e) => {
                                const newItems = maoObraExecucao.map((mo) =>
                                  mo.id === item.id ? { ...mo, pessoas: Number(e.target.value) } : mo,
                                )
                                setMaoObraExecucao(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>Dias</Label>
                            <Input
                              type="number"
                              value={item.dias}
                                onChange={(e) => {
                                const newItems = maoObraExecucao.map((mo) =>
                                  mo.id === item.id ? { ...mo, dias: Number(e.target.value) } : mo,
                                )
                                setMaoObraExecucao(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>Hrs/Dia</Label>
                            <Input
                              type="number"
                              value={item.hrsDia}
                                onChange={(e) => {
                                const newItems = maoObraExecucao.map((mo) =>
                                  mo.id === item.id ? { ...mo, hrsDia: Number(e.target.value) } : mo,
                                )
                                setMaoObraExecucao(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>R$/Hora</Label>
                            <Input
                              type="number"
                              step="0.01"
                                value={item.precoHr}
                              onChange={(e) => {
                                const newItems = maoObraExecucao.map((mo) =>
                                  mo.id === item.id ? { ...mo, precoHr: Number(e.target.value) } : mo,
                                )
                                setMaoObraExecucao(newItems)
                              }}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Valor Total</Label>
                          <Input
                              value={`R$ ${(item.pessoas * item.dias * item.hrsDia * item.precoHr).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                            readOnly
                            className="bg-chart-2/5 font-bold"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-chart-2/10 border-l-4 border-chart-2 rounded-lg">
                      <p className="font-bold text-chart-2">
                        Total {labels.maoObraExec}: R${" "}
                        {valorMaoObraExec.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 10-13 Itens/Serviços */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      10-13. {labels.itensServicos}
                    </div>
                    <Button onClick={adicionarItemServico} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {itensServicos.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Item {index + 1}</h4>
                          {itensServicos.length > 1 && (
                            <Button onClick={() => removerItemServico(item.id)} size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <Label>Quantidade</Label>
                            <Input
                              type="number"
                              value={item.qt}
                                onChange={(e) => {
                                const newItems = itensServicos.map((ic) =>
                                  ic.id === item.id ? { ...ic, qt: Number(e.target.value) } : ic,
                                )
                                setItensServicos(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>Unidade</Label>
                            <Input
                              value={item.unid}
                              onChange={(e) => {
                                const newItems = itensServicos.map((ic) =>
                                  ic.id === item.id ? { ...ic, unid: e.target.value } : ic,
                                )
                                setItensServicos(newItems)
                              }}
                              placeholder={modoObra ? "m², kg, unid..." : "hrs, dias, licenças..."}
                            />
                          </div>
                          <div>
                            <Label>Preço/Unid (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                                value={item.precoUnit}
                              onChange={(e) => {
                                const newItems = itensServicos.map((ic) =>
                                  ic.id === item.id ? { ...ic, precoUnit: Number(e.target.value) } : ic,
                                )
                                setItensServicos(newItems)
                              }}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <Label>Descrição</Label>
                          <Input
                            value={item.descricao}
                            onChange={(e) => {
                              const newItems = itensServicos.map((ic) =>
                                ic.id === item.id ? { ...ic, descricao: e.target.value } : ic,
                              )
                              setItensServicos(newItems)
                            }}
                            placeholder={
                              modoObra ? "Ex: ACM 3mm cor azul" : "Ex: Software, licença, serviço terceirizado"
                            }
                          />
                        </div>
                        <div>
                          <Label>Valor Total</Label>
                          <Input
                              value={`R$ ${(item.qt * item.precoUnit).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                            readOnly
                            className="bg-chart-3/5 font-bold"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-chart-3/10 border-l-4 border-chart-3 rounded-lg">
                      <p className="font-bold text-chart-3">
                        Total {labels.itensServicos}: R${" "}
                        {valorItensServicos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
             
              {/* 15 Consumo/Despesas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      15. {labels.consumoDespesas}
                    </div>
                    <Button onClick={adicionarConsumoDespesa} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consumoDespesas.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Item {index + 1}</h4>
                          {consumoDespesas.length > 1 && (
                            <Button onClick={() => removerConsumoDespesa(item.id)} size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <Label>Quantidade</Label>
                            <Input
                              type="number"
                              value={item.qt}
                                onChange={(e) => {
                                const newItems = consumoDespesas.map((co) =>
                                  co.id === item.id ? { ...co, qt: Number(e.target.value) } : co,
                                )
                                setConsumoDespesas(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>Unidade</Label>
                            <Input
                              value={item.unid}
                              onChange={(e) => {
                                const newItems = consumoDespesas.map((co) =>
                                  co.id === item.id ? { ...co, unid: e.target.value } : co,
                                )
                                setConsumoDespesas(newItems)
                              }}
                              placeholder={modoObra ? "cj, dias, hrs..." : "mês, licença, viagem..."}
                            />
                          </div>
                          <div>
                            <Label>Preço (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                                value={item.preco}
                              onChange={(e) => {
                                const newItems = consumoDespesas.map((co) =>
                                  co.id === item.id ? { ...co, preco: Number(e.target.value) } : co,
                                )
                                setConsumoDespesas(newItems)
                              }}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <Label>Descrição</Label>
                          <Input
                            value={item.descricao}
                            onChange={(e) => {
                              const newItems = consumoDespesas.map((co) =>
                                co.id === item.id ? { ...co, descricao: e.target.value } : co,
                              )
                              setConsumoDespesas(newItems)
                            }}
                            placeholder={
                              modoObra
                                ? "Ex: Solda, combustível, frete..."
                                : "Ex: Hospedagem, transporte, comunicação..."
                            }
                          />
                        </div>
                        <div>
                          <Label>Valor Total</Label>
                          <Input
                              value={`R$ ${(item.qt * item.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                            readOnly
                            className="bg-chart-5/5 font-bold"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-chart-5/10 border-l-4 border-chart-5 rounded-lg">
                      <p className="font-bold text-chart-5">
                        Total {labels.consumoDespesas}: R${" "}
                        {valorConsumoDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">

              {/* 3-6 Materiais/Insumos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      3-6. {labels.materiais}
                    </div>
                    <Button onClick={adicionarMaterial} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {materiais.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{modoObra ? `Material ${index + 1}` : `Insumo ${index + 1}`}</h4>
                          {materiais.length > 1 && (
                            <Button onClick={() => removerMaterial(item.id)} size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <Label>{modoObra ? "Qt. Barras" : "Quantidade"}</Label>
                            <Input
                              type="number"
                              value={item.qtBarras}
                                onChange={(e) => {
                                const newItems = materiais.map((mp) =>
                                  mp.id === item.id ? { ...mp, qtBarras: Number(e.target.value) } : mp,
                                )
                                setMateriais(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>{modoObra ? "Peso (kg)" : "Peso/Volume"}</Label>
                            <Input
                              type="number"
                              value={item.quantKg}
                                onChange={(e) => {
                                const newItems = materiais.map((mp) =>
                                  mp.id === item.id ? { ...mp, quantKg: Number(e.target.value) } : mp,
                                )
                                setMateriais(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <Label>Preço/unid (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.precoKg}
                                onChange={(e) => {
                                const newItems = materiais.map((mp) =>
                                  mp.id === item.id ? { ...mp, precoKg: Number(e.target.value) } : mp,
                                )
                                setMateriais(newItems)
                              }}
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <Label>Valor Total</Label>
                            <Input
                                value={`R$ ${(item.quantKg * item.precoKg).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                              readOnly
                              className="bg-chart-1/5 font-bold"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Descrição</Label>
                          <Input
                            value={item.descricao}
                            onChange={(e) => {
                              const newItems = materiais.map((mp) =>
                                mp.id === item.id ? { ...mp, descricao: e.target.value } : mp,
                              )
                              setMateriais(newItems)
                            }}
                            placeholder={
                              modoObra ? "Ex: Perfil U 200x50x2,25mm" : "Ex: Material específico, ferramenta, etc."
                            }
                          />
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-chart-1/10 border-l-4 border-chart-1 rounded-lg">
                      <p className="font-bold text-chart-1">
                        Total {labels.materiais}: R${" "}
                        {valorMateriais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      {modoObra && <p className="text-sm text-chart-1">Peso Total: {pesoTotal.toLocaleString()} kg</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/*9 Mão de Obra Instalação/Suporte */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      9. {labels.maoObraInst}
                    </div>
                    <Button onClick={adicionarMaoObraInst} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {maoObraInstalacao.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Serviço {index + 1}</h4>
                          {maoObraInstalacao.length > 1 && (
                            <Button onClick={() => removerMaoObraInst(item.id)} size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="mb-3">
                          <Label>Descrição do Serviço</Label>
                          <Input
                            value={item.descricao}
                            onChange={(e) => {
                              const newItems = maoObraInstalacao.map((mo) =>
                                mo.id === item.id ? { ...mo, descricao: e.target.value } : mo,
                              )
                              setMaoObraInstalacao(newItems)
                            }}
                            placeholder={
                              modoObra ? "Ex: Instalação da estrutura" : "Ex: Suporte, manutenção, treinamento"
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-3 mb-3">
                          <div>
                            <Label>Pessoas</Label>
                            <Input
                              type="number"
                              value={item.pessoas}
                                onChange={(e) => {
                                const newItems = maoObraInstalacao.map((mo) =>
                                  mo.id === item.id ? { ...mo, pessoas: Number(e.target.value) } : mo,
                                )
                                setMaoObraInstalacao(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>Dias</Label>
                            <Input
                              type="number"
                              value={item.dias}
                                onChange={(e) => {
                                const newItems = maoObraInstalacao.map((mo) =>
                                  mo.id === item.id ? { ...mo, dias: Number(e.target.value) } : mo,
                                )
                                setMaoObraInstalacao(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>Hrs/Dia</Label>
                            <Input
                              type="number"
                              value={item.hrsDia}
                                onChange={(e) => {
                                const newItems = maoObraInstalacao.map((mo) =>
                                  mo.id === item.id ? { ...mo, hrsDia: Number(e.target.value) } : mo,
                                )
                                setMaoObraInstalacao(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>R$/Hora</Label>
                            <Input
                              type="number"
                              step="0.01"
                                value={item.precoHr}
                              onChange={(e) => {
                                const newItems = maoObraInstalacao.map((mo) =>
                                  mo.id === item.id ? { ...mo, precoHr: Number(e.target.value) } : mo,
                                )
                                setMaoObraInstalacao(newItems)
                              }}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Valor Total</Label>
                          <Input
                              value={`R$ ${(item.pessoas * item.dias * item.hrsDia * item.precoHr).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                            readOnly
                            className="bg-chart-2/5 font-bold"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-chart-2/10 border-l-4 border-chart-2 rounded-lg">
                      <p className="font-bold text-chart-2">
                        Total {labels.maoObraInst}: R${" "}
                        {valorMaoObraInst.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 14 Acabamento/Extras */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      14. {labels.acabamentoExtras}
                    </div>
                    <Button onClick={adicionarAcabamentoExtra} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {acabamentoExtras.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{modoObra ? `Acabamento ${index + 1}` : `Extra ${index + 1}`}</h4>
                          {acabamentoExtras.length > 1 && (
                            <Button onClick={() => removerAcabamentoExtra(item.id)} size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <Label>Quantidade</Label>
                            <Input
                              type="number"
                              value={item.quant}
                                onChange={(e) => {
                                const newItems = acabamentoExtras.map((ac) =>
                                  ac.id === item.id ? { ...ac, quant: Number(e.target.value) } : ac,
                                )
                                setAcabamentoExtras(newItems)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>Unidade</Label>
                            <Input
                              value={item.unid}
                              onChange={(e) => {
                                const newItems = acabamentoExtras.map((ac) =>
                                  ac.id === item.id ? { ...ac, unid: e.target.value } : ac,
                                )
                                setAcabamentoExtras(newItems)
                              }}
                              placeholder={modoObra ? "kg, m²..." : "hrs, unid..."}
                            />
                          </div>
                          <div>
                            <Label>Preço/Unid (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                                value={item.precoKg}
                              onChange={(e) => {
                                const newItems = acabamentoExtras.map((ac) =>
                                  ac.id === item.id ? { ...ac, precoKg: Number(e.target.value) } : ac,
                                )
                                setAcabamentoExtras(newItems)
                              }}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <Label>Descrição</Label>
                          <Input
                            value={item.descricao}
                            onChange={(e) => {
                              const newItems = acabamentoExtras.map((ac) =>
                                ac.id === item.id ? { ...ac, descricao: e.target.value } : ac,
                              )
                              setAcabamentoExtras(newItems)
                            }}
                            placeholder={
                              modoObra ? "Ex: Galvanização a fogo" : "Ex: Funcionalidade extra, customização"
                            }
                          />
                        </div>
                        <div>
                          <Label>Valor Total</Label>
                          <Input
                              value={`R$ ${(item.quant * item.precoKg).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                            readOnly
                            className="bg-chart-4/5 font-bold"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-chart-4/10 border-l-4 border-chart-4 rounded-lg">
                      <p className="font-bold text-chart-4">
                        Total {labels.acabamentoExtras}: R${" "}
                        {valorAcabamentoExtras.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dados Finais do Orçamento  */}      
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-center justify-center">
                    <Calculator className="w-5 h-5" />
                    Dados Finais do Orçamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"> 
                    <div>
                  <Label>{modoObra ? "Engenharia (%)" : "Planejamento (%)"}</Label>
                  <Input
                    type="number"
                    step="0.01" // Permite porcentagens decimais
                      value={dadosFinais.engenharia}
                    onChange={(e) => setDadosFinais({ ...dadosFinais, engenharia: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                    </div>
                    <div>
                  <Label>Comissão (%)</Label>
                  <Input
                    type="number"
                      step="0.01"
                    value={dadosFinais.comissao}
                    onChange={(e) => setDadosFinais({ ...dadosFinais, comissao: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                    </div>
                    <div>
                  <Label>Imposto (%)</Label>
                  <Input
                    type="number"
                      step="0.01"
                    value={dadosFinais.impostoPercentual}
                    onChange={(e) => setDadosFinais({ ...dadosFinais, impostoPercentual: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                    </div>
                    <div>
                  <Label>Margem de Lucro (%)</Label>
                  <Input
                    type="number"
                      step="0.01"
                    value={dadosFinais.margemLucro}
                    onChange={(e) => setDadosFinais({ ...dadosFinais, margemLucro: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                  <Label>Consultoria (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={dadosFinais.consultoria}
                    onChange={(e) => setDadosFinais({ ...dadosFinais, consultoria: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                    </div>
                    <div>
                  <Label>{labels.foto}</Label>
                  <Input
                    value={fotoObra}
                    onChange={(e) => setFotoObra(e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Observações Gerais</Label>
                    <Textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Observações que serão incluídas na proposta..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              
              <Separator className="my-6" />
            </div>
          </div>
        </div>
      </div>


      {/* Resultado Final - Largura Total */}
      <div className="w-full bg-gradient-to-r from-chart-2/10 via-chart-1/10 to-chart-3/10 border-t border-b py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <Card className="bg-card/95 backdrop-blur border-2 border-chart-2/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-3xl text-chart-2">
                <Calculator className="w-8 h-8" />
                17. RESULTADO FINAL DO ORÇAMENTO
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                {modoObra ? "Orçamento completo da obra" : "Orçamento completo do serviço"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Breakdown de Custos */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Breakdown de Custos</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-chart-1/5 rounded-lg">
                        <span>{labels.materiais}:</span>
                        <span className="font-bold">
                          R$ {valorMateriais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-chart-2/5 rounded-lg">
                        <span>{labels.maoObraExec}:</span>
                        <span className="font-bold">
                          R$ {valorMaoObraExec.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-chart-2/5 rounded-lg">
                        <span>{labels.maoObraInst}:</span>
                        <span className="font-bold">
                          R$ {valorMaoObraInst.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-chart-3/5 rounded-lg">
                        <span>{labels.itensServicos}:</span>
                        <span className="font-bold">
                          R$ {valorItensServicos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-chart-4/5 rounded-lg">
                        <span>{labels.acabamentoExtras}:</span>
                        <span className="font-bold">
                          R$ {valorAcabamentoExtras.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-chart-5/5 rounded-lg">
                        <span>{labels.consumoDespesas}:</span>
                        <span className="font-bold">
                          R$ {valorConsumoDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span>{modoObra ? "Engenharia" : "Planejamento"} ({dadosFinais.engenharia}%):</span>
                        <span className="font-bold">
                          R$ {valorEngenharia.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span>Comissão ({dadosFinais.comissao}%):</span>
                        <span className="font-bold">
                          R$ {valorComissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span>Consultoria:</span>                        <span className="font-bold">
 R$ {dadosFinais.consultoria.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
    </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="flex justify-between text-lg font-bold p-4 bg-chart-2/10 rounded-lg">
                      <span>CUSTO TOTAL:</span>
                      <span>R$ {custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-base p-3 bg-muted/50 rounded-lg">
                      <span>Imposto ({dadosFinais.impostoPercentual}%):</span>
                      <span className="font-bold">
                        R$ {valorImposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-base p-3 bg-muted/50 rounded-lg">
                      <span>Lucro ({dadosFinais.margemLucro}%):</span>
                      <span className="font-bold">
 R$ {valorLucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resultado Final e Métricas */}
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-chart-2/20 to-chart-1/20 rounded-xl border-2 border-chart-2/30">
                    <h3 className="text-2xl font-bold text-chart-2 mb-2">PREÇO FINAL</h3>
                    <p className="text-4xl font-bold text-foreground">
                      R$ {precoFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {modoObra && pesoTotal > 0 && (
                      <div className="text-center p-4 bg-chart-1/10 rounded-lg border border-chart-1/30">
                        <p className="text-xs text-muted-foreground">Peso Total</p>
                        <p className="text-xl font-bold text-chart-1">{pesoTotal.toLocaleString()} kg</p>
                        <p className="text-xs text-muted-foreground mt-1">R$ {precoPorKg.toFixed(2)} por kg</p>
                      </div>
                    )}
                    {areaProjeto > 0 && (
                      <div className="text-center p-4 bg-chart-3/10 rounded-lg border border-chart-3/30">
                        <p className="text-xs text-muted-foreground">{modoObra ? "Área Total" : "Quantidade Total"}</p>
                        <p className="text-xl font-bold text-chart-3">
                          {areaProjeto.toLocaleString()} {labels.unidadeMedida}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          R$ {precoPorUnidade.toFixed(2)} por {labels.unidadeMedida}
                        </p>
                      </div>
                    )}
                    <div className="text-center p-4 bg-chart-4/10 rounded-lg border border-chart-4/30">
                      <p className="text-xs text-muted-foreground">Margem de Lucro</p>
                      <p className="text-xl font-bold text-chart-4">{dadosFinais.margemLucro.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        R$ {valorLucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" className="bg-chart-2 hover:bg-chart-2/90">
                  <FileText className="w-5 h-5 mr-2" />
                  Gerar Proposta PDF
                </Button>
                <Button size="lg" variant="outline">
                  <Camera className="w-5 h-5 mr-2" />
                  Salvar Orçamento
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    // Reset todos os campos
                    setDadosCadastro({ dataOrcamento: "", cliente: "", projeto: "", endereco: "", responsavel: "" })
                    setDescricaoProjeto("")
                    setAreaProjeto(0)
                    setMateriais([{ id: 1, qtBarras: 0, quantKg: 0, precoKg: 0, descricao: "" }])
                    setMaoObraExecucao([{ id: 1, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 }])
                    setMaoObraInstalacao([{ id: 1, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 }])
                    setItensServicos([{ id: 1, qt: 0, unid: "", precoUnit: 0, descricao: "" }])
                    setAcabamentoExtras([{ id: 1, quant: 0, unid: "kg", precoKg: 0, descricao: "" }])
                    setConsumoDespesas([{ id: 1, qt: 0, unid: "", preco: 0, descricao: "" }])
                    setDadosFinais({ engenharia: 0, comissao: 0, consultoria: 0, impostoPercentual: 0, margemLucro: 0 })
                    setObservacoes("")
                    setFotoObra("")
                  }}
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Limpar Tudo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
