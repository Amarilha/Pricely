"use client"

import { useState } from "react"
import { Calculator, FileText, Camera, Wrench, Package, Palette, Users, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function CalculadoraOrcamentoInterativa() {
  // Estados para dados de cadastro
  const [dadosCadastro, setDadosCadastro] = useState({
    dataOrcamento: "",
    cliente: "",
    obra: "",
    endereco: "",
    responsavel: "",
  })

  const [descricaoObra, setDescricaoObra] = useState("")
  const [areaCobertura, setAreaCobertura] = useState(0)

  // Estados para matéria prima
  const [materiaPrima, setMateriaPrima] = useState([{ id: 1, qtBarras: 0, quantKg: 0, precoKg: 0, descricao: "" }])

  // Estados para mão de obra fabricação
  const [maoObraFabricacao, setMaoObraFabricacao] = useState([
    { id: 1, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 },
  ])

  // Estados para mão de obra instalação
  const [maoObraInstalacao, setMaoObraInstalacao] = useState([
    { id: 1, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 },
  ])

  // Estados para itens comerciais
  const [itensComerciais, setItensComerciais] = useState([{ id: 1, qt: 0, unid: "", precoUnit: 0, descricao: "" }])

  // Estados para acabamento
  const [acabamento, setAcabamento] = useState([{ id: 1, quant: 0, unid: "kg", precoKg: 0, descricao: "" }])

  // Estados para consumo
  const [consumo, setConsumo] = useState([{ id: 1, qt: 0, unid: "", preco: 0, descricao: "" }])

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

  // Funções para adicionar/remover itens
  const adicionarMateriaPrima = () => {
    const novoId = Math.max(...materiaPrima.map((item) => item.id)) + 1
    setMateriaPrima([...materiaPrima, { id: novoId, qtBarras: 0, quantKg: 0, precoKg: 0, descricao: "" }])
  }

  const removerMateriaPrima = (id: number) => {
    if (materiaPrima.length > 1) {
      setMateriaPrima(materiaPrima.filter((item) => item.id !== id))
    }
  }

  const adicionarMaoObraFab = () => {
    const novoId = Math.max(...maoObraFabricacao.map((item) => item.id)) + 1
    setMaoObraFabricacao([
      ...maoObraFabricacao,
      { id: novoId, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 },
    ])
  }

  const removerMaoObraFab = (id: number) => {
    if (maoObraFabricacao.length > 1) {
      setMaoObraFabricacao(maoObraFabricacao.filter((item) => item.id !== id))
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

  const adicionarItemComercial = () => {
    const novoId = Math.max(...itensComerciais.map((item) => item.id)) + 1
    setItensComerciais([...itensComerciais, { id: novoId, qt: 0, unid: "", precoUnit: 0, descricao: "" }])
  }

  const removerItemComercial = (id: number) => {
    if (itensComerciais.length > 1) {
      setItensComerciais(itensComerciais.filter((item) => item.id !== id))
    }
  }

  const adicionarAcabamento = () => {
    const novoId = Math.max(...acabamento.map((item) => item.id)) + 1
    setAcabamento([...acabamento, { id: novoId, quant: 0, unid: "kg", precoKg: 0, descricao: "" }])
  }

  const removerAcabamento = (id: number) => {
    if (acabamento.length > 1) {
      setAcabamento(acabamento.filter((item) => item.id !== id))
    }
  }

  const adicionarConsumo = () => {
    const novoId = Math.max(...consumo.map((item) => item.id)) + 1
    setConsumo([...consumo, { id: novoId, qt: 0, unid: "", preco: 0, descricao: "" }])
  }

  const removerConsumo = (id: number) => {
    if (consumo.length > 1) {
      setConsumo(consumo.filter((item) => item.id !== id))
    }
  }

  // Cálculos automáticos
  const calcularMateriaPrima = () => {
    return materiaPrima.reduce((total, item) => total + item.quantKg * item.precoKg, 0)
  }

  const calcularMaoObraFabricacao = () => {
    return maoObraFabricacao.reduce((total, item) => total + item.pessoas * item.dias * item.hrsDia * item.precoHr, 0)
  }

  const calcularMaoObraInstalacao = () => {
    return maoObraInstalacao.reduce((total, item) => total + item.pessoas * item.dias * item.hrsDia * item.precoHr, 0)
  }

  const calcularItensComerciais = () => {
    return itensComerciais.reduce((total, item) => total + item.qt * item.precoUnit, 0)
  }

  const calcularAcabamento = () => {
    return acabamento.reduce((total, item) => total + item.quant * item.precoKg, 0)
  }

  const calcularConsumo = () => {
    return consumo.reduce((total, item) => total + item.qt * item.preco, 0)
  }

  const pesoTotal = materiaPrima.reduce((total, item) => total + item.quantKg, 0)
  const valorMateriaPrima = calcularMateriaPrima()
  const valorMaoObraFab = calcularMaoObraFabricacao()
  const valorMaoObraInst = calcularMaoObraInstalacao()
  const valorItensComerciais = calcularItensComerciais()
  const valorAcabamento = calcularAcabamento()
  const valorConsumo = calcularConsumo()

  const custoTotalObra =
    valorMateriaPrima + valorMaoObraFab + valorMaoObraInst + valorItensComerciais + valorAcabamento + valorConsumo
  const valorImposto = custoTotalObra * (dadosFinais.impostoPercentual / 100)
  const custoTotalComTaxas =
    custoTotalObra + dadosFinais.engenharia + dadosFinais.comissao + dadosFinais.consultoria + valorImposto
  const valorLucro = custoTotalComTaxas * (dadosFinais.margemLucro / 100)
  const precoVendaFinal = custoTotalComTaxas + valorLucro

  const precoPorKg = pesoTotal > 0 ? precoVendaFinal / pesoTotal : 0
  const precoPorM2 = areaCobertura > 0 ? precoVendaFinal / areaCobertura : 0

  // Verificar campos preenchidos para progresso
  const camposPreenchidos = {
    dadosCadastro: dadosCadastro.cliente && dadosCadastro.obra,
    descricaoObra: descricaoObra.length > 0,
    materiaPrima: materiaPrima.some((item) => item.quantKg > 0),
    maoObraFab: maoObraFabricacao.some((item) => item.pessoas > 0),
    maoObraInst: maoObraInstalacao.some((item) => item.pessoas > 0),
    itensComerciais: itensComerciais.some((item) => item.qt > 0),
    acabamento: acabamento.some((item) => item.quant > 0),
    consumo: consumo.some((item) => item.qt > 0),
    observacoes: observacoes.length > 0,
    foto: fotoObra.length > 0,
  }

  const etapasConcluidas = Object.values(camposPreenchidos).filter(Boolean).length
  const progressoPercentual = (etapasConcluidas / 10) * 100

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Calculadora de Orçamento Interativa</h1>
          <p className="text-gray-600">Insira os valores e veja os cálculos em tempo real</p>
        </div>

        {/* Linha de Progresso */}
        <div className="relative mb-12 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Progresso do Orçamento</h2>
            <span className="text-sm font-medium text-blue-600">{etapasConcluidas}/10 seções preenchidas</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
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
                    concluido ? "bg-chart-2 text-white shadow-lg" : "bg-muted text-gray-600"
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
            {/* Dados de Cadastro */}
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
                  <Label>Nome da Obra</Label>
                  <Input
                    value={dadosCadastro.obra}
                    onChange={(e) => setDadosCadastro({ ...dadosCadastro, obra: e.target.value })}
                    placeholder="Nome da obra"
                  />
                </div>
                <div>
                  <Label>Endereço da Obra</Label>
                  <Input
                    value={dadosCadastro.endereco}
                    onChange={(e) => setDadosCadastro({ ...dadosCadastro, endereco: e.target.value })}
                    placeholder="Endereço completo"
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
                    <Label>Área de Cobertura (m²)</Label>
                    <Input
                      type="number"
                      value={areaCobertura}
                      onChange={(e) => setAreaCobertura(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label>Descrição da Obra</Label>
                  <Textarea
                    value={descricaoObra}
                    onChange={(e) => setDescricaoObra(e.target.value)}
                    placeholder="Descreva detalhadamente o que será executado..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Matéria Prima */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    3-6. Matéria Prima
                  </div>
                  <Button onClick={adicionarMateriaPrima} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materiaPrima.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Material {index + 1}</h4>
                        {materiaPrima.length > 1 && (
                          <Button onClick={() => removerMateriaPrima(item.id)} size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <Label>Qt. Barras</Label>
                          <Input
                            type="number"
                            value={item.qtBarras}
                            onChange={(e) => {
                              const newItems = materiaPrima.map((mp) =>
                                mp.id === item.id ? { ...mp, qtBarras: Number(e.target.value) } : mp,
                              )
                              setMateriaPrima(newItems)
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Peso (kg)</Label>
                          <Input
                            type="number"
                            value={item.quantKg}
                            onChange={(e) => {
                              const newItems = materiaPrima.map((mp) =>
                                mp.id === item.id ? { ...mp, quantKg: Number(e.target.value) } : mp,
                              )
                              setMateriaPrima(newItems)
                            }}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <Label>Preço/kg (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.precoKg}
                            onChange={(e) => {
                              const newItems = materiaPrima.map((mp) =>
                                mp.id === item.id ? { ...mp, precoKg: Number(e.target.value) } : mp,
                              )
                              setMateriaPrima(newItems)
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
                        <Label>Descrição do Material</Label>
                        <Input
                          value={item.descricao}
                          onChange={(e) => {
                            const newItems = materiaPrima.map((mp) =>
                              mp.id === item.id ? { ...mp, descricao: e.target.value } : mp,
                            )
                            setMateriaPrima(newItems)
                          }}
                          placeholder="Ex: Perfil U 200x50x2,25mm"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-chart-1/10 border-l-4 border-chart-1 rounded-lg">
                    <p className="font-bold text-chart-1">
                      Total Matéria Prima: R$ {valorMateriaPrima.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-chart-1">Peso Total: {pesoTotal.toLocaleString()} kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mão de Obra Fabricação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    8. Mão de Obra - Fabricação
                  </div>
                  <Button onClick={adicionarMaoObraFab} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maoObraFabricacao.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Serviço {index + 1}</h4>
                        {maoObraFabricacao.length > 1 && (
                          <Button onClick={() => removerMaoObraFab(item.id)} size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="mb-3">
                        <Label>Descrição do Serviço</Label>
                        <Input
                          value={item.descricao}
                          onChange={(e) => {
                            const newItems = maoObraFabricacao.map((mo) =>
                              mo.id === item.id ? { ...mo, descricao: e.target.value } : mo,
                            )
                            setMaoObraFabricacao(newItems)
                          }}
                          placeholder="Ex: Fabricação da estrutura"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div>
                          <Label>Pessoas</Label>
                          <Input
                            type="number"
                            value={item.pessoas}
                            onChange={(e) => {
                              const newItems = maoObraFabricacao.map((mo) =>
                                mo.id === item.id ? { ...mo, pessoas: Number(e.target.value) } : mo,
                              )
                              setMaoObraFabricacao(newItems)
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
                              const newItems = maoObraFabricacao.map((mo) =>
                                mo.id === item.id ? { ...mo, dias: Number(e.target.value) } : mo,
                              )
                              setMaoObraFabricacao(newItems)
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
                              const newItems = maoObraFabricacao.map((mo) =>
                                mo.id === item.id ? { ...mo, hrsDia: Number(e.target.value) } : mo,
                              )
                              setMaoObraFabricacao(newItems)
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
                              const newItems = maoObraFabricacao.map((mo) =>
                                mo.id === item.id ? { ...mo, precoHr: Number(e.target.value) } : mo,
                              )
                              setMaoObraFabricacao(newItems)
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
                      Total Mão de Obra Fabricação: R${" "}
                      {valorMaoObraFab.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Mão de Obra Instalação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    9. Mão de Obra - Instalação
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
                          placeholder="Ex: Instalação da estrutura"
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
                      Total Mão de Obra Instalação: R${" "}
                      {valorMaoObraInst.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Itens Comerciais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    10-13. Itens Comerciais
                  </div>
                  <Button onClick={adicionarItemComercial} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itensComerciais.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {itensComerciais.length > 1 && (
                          <Button onClick={() => removerItemComercial(item.id)} size="sm" variant="destructive">
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
                              const newItems = itensComerciais.map((ic) =>
                                ic.id === item.id ? { ...ic, qt: Number(e.target.value) } : ic,
                              )
                              setItensComerciais(newItems)
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Unidade</Label>
                          <Input
                            value={item.unid}
                            onChange={(e) => {
                              const newItems = itensComerciais.map((ic) =>
                                ic.id === item.id ? { ...ic, unid: e.target.value } : ic,
                              )
                              setItensComerciais(newItems)
                            }}
                            placeholder="m², kg, unid..."
                          />
                        </div>
                        <div>
                          <Label>Preço/Unid (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.precoUnit}
                            onChange={(e) => {
                              const newItems = itensComerciais.map((ic) =>
                                ic.id === item.id ? { ...ic, precoUnit: Number(e.target.value) } : ic,
                              )
                              setItensComerciais(newItems)
                            }}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <Label>Descrição do Item</Label>
                        <Input
                          value={item.descricao}
                          onChange={(e) => {
                            const newItems = itensComerciais.map((ic) =>
                              ic.id === item.id ? { ...ic, descricao: e.target.value } : ic,
                            )
                            setItensComerciais(newItems)
                          }}
                          placeholder="Ex: ACM 3mm cor azul"
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
                      Total Itens Comerciais: R${" "}
                      {valorItensComerciais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acabamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    14. Acabamento
                  </div>
                  <Button onClick={adicionarAcabamento} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {acabamento.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Acabamento {index + 1}</h4>
                        {acabamento.length > 1 && (
                          <Button onClick={() => removerAcabamento(item.id)} size="sm" variant="destructive">
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
                              const newItems = acabamento.map((ac) =>
                                ac.id === item.id ? { ...ac, quant: Number(e.target.value) } : ac,
                              )
                              setAcabamento(newItems)
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Unidade</Label>
                          <Input
                            value={item.unid}
                            onChange={(e) => {
                              const newItems = acabamento.map((ac) =>
                                ac.id === item.id ? { ...ac, unid: e.target.value } : ac,
                              )
                              setAcabamento(newItems)
                            }}
                            placeholder="kg, m²..."
                          />
                        </div>
                        <div>
                          <Label>Preço/Unid (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.precoKg}
                            onChange={(e) => {
                              const newItems = acabamento.map((ac) =>
                                ac.id === item.id ? { ...ac, precoKg: Number(e.target.value) } : ac,
                              )
                              setAcabamento(newItems)
                            }}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <Label>Descrição do Acabamento</Label>
                        <Input
                          value={item.descricao}
                          onChange={(e) => {
                            const newItems = acabamento.map((ac) =>
                              ac.id === item.id ? { ...ac, descricao: e.target.value } : ac,
                            )
                            setAcabamento(newItems)
                          }}
                          placeholder="Ex: Galvanização a fogo"
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
                      Total Acabamento: R$ {valorAcabamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consumo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    15. Consumo
                  </div>
                  <Button onClick={adicionarConsumo} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consumo.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {consumo.length > 1 && (
                          <Button onClick={() => removerConsumo(item.id)} size="sm" variant="destructive">
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
                              const newItems = consumo.map((co) =>
                                co.id === item.id ? { ...co, qt: Number(e.target.value) } : co,
                              )
                              setConsumo(newItems)
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Unidade</Label>
                          <Input
                            value={item.unid}
                            onChange={(e) => {
                              const newItems = consumo.map((co) =>
                                co.id === item.id ? { ...co, unid: e.target.value } : co,
                              )
                              setConsumo(newItems)
                            }}
                            placeholder="cj, dias, hrs..."
                          />
                        </div>
                        <div>
                          <Label>Preço (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.preco}
                            onChange={(e) => {
                              const newItems = consumo.map((co) =>
                                co.id === item.id ? { ...co, preco: Number(e.target.value) } : co,
                              )
                              setConsumo(newItems)
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
                            const newItems = consumo.map((co) =>
                              co.id === item.id ? { ...co, descricao: e.target.value } : co,
                            )
                            setConsumo(newItems)
                          }}
                          placeholder="Ex: Solda, combustível, frete..."
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
                      Total Consumo: R$ {valorConsumo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dados Finais e Resultado */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dados Finais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Dados Finais do Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Engenharia (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={dadosFinais.engenharia}
                    onChange={(e) => setDadosFinais({ ...dadosFinais, engenharia: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Comissão (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={dadosFinais.comissao}
                    onChange={(e) => setDadosFinais({ ...dadosFinais, comissao: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label>Imposto (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={dadosFinais.impostoPercentual}
                    onChange={(e) => setDadosFinais({ ...dadosFinais, impostoPercentual: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
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
              <div>
                <Label>Observações Gerais</Label>
                <Textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações que serão incluídas na proposta..."
                  rows={3}
                />
              </div>
              <div>
                <Label>URL da Foto da Obra</Label>
                <Input
                  value={fotoObra}
                  onChange={(e) => setFotoObra(e.target.value)}
                  placeholder="https://exemplo.com/foto.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resultado Final */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-chart-2">
                <Calculator className="w-6 h-6" />
                17. RESULTADO FINAL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Matéria Prima:</span>
                      <span className="font-bold">
                        R$ {valorMateriaPrima.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mão Obra Fab.:</span>
                      <span className="font-bold">
                        R$ {valorMaoObraFab.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mão Obra Inst.:</span>
                      <span className="font-bold">
                        R$ {valorMaoObraInst.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Itens Comerciais:</span>
                      <span className="font-bold">
                        R$ {valorItensComerciais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Acabamento:</span>
                      <span className="font-bold">
                        R$ {valorAcabamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consumo:</span>
                      <span className="font-bold">
                        R$ {valorConsumo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engenharia:</span>
                      <span className="font-bold">
                        R$ {dadosFinais.engenharia.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comissão:</span>
                      <span className="font-bold">
                        R$ {dadosFinais.comissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-base font-bold text-chart-2">
                    <span>CUSTO TOTAL:</span>
                    <span>R$ {custoTotalObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Imposto ({dadosFinais.impostoPercentual}%):</span>
                    <span className="font-bold">
                      R$ {valorImposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Lucro ({dadosFinais.margemLucro}%):</span>
                    <span className="font-bold">
                      R$ {valorLucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-foreground border-t pt-2">
                    <span>PREÇO FINAL:</span>
                    <span>R$ {precoVendaFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-chart-1/10 rounded-lg">
                    <p className="text-xs text-gray-600">Peso Total</p>
                    <p className="text-lg font-bold text-chart-1">{pesoTotal.toLocaleString()} kg</p>
                  </div>
                  <div className="text-center p-3 bg-chart-2/10 rounded-lg">
                    <p className="text-xs text-gray-600">Preço por kg</p>
                    <p className="text-lg font-bold text-chart-2">R$ {precoPorKg.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-3 bg-chart-3/10 rounded-lg">
                    <p className="text-xs text-gray-600">Preço por m²</p>
                    <p className="text-lg font-bold text-chart-3">R$ {precoPorM2.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex justify-center gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Gerar Proposta PDF
          </Button>
          <Button variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Salvar Orçamento
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Reset todos os campos
              setDadosCadastro({ dataOrcamento: "", cliente: "", obra: "", endereco: "", responsavel: "" })
              setDescricaoObra("")
              setAreaCobertura(0)
              setMateriaPrima([{ id: 1, qtBarras: 0, quantKg: 0, precoKg: 0, descricao: "" }])
              setMaoObraFabricacao([{ id: 1, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 }])
              setMaoObraInstalacao([{ id: 1, descricao: "", pessoas: 0, dias: 0, hrsDia: 0, precoHr: 0 }])
              setItensComerciais([{ id: 1, qt: 0, unid: "", precoUnit: 0, descricao: "" }])
              setAcabamento([{ id: 1, quant: 0, unid: "kg", precoKg: 0, descricao: "" }])
              setConsumo([{ id: 1, qt: 0, unid: "", preco: 0, descricao: "" }])
              setDadosFinais({ engenharia: 0, comissao: 0, consultoria: 0, impostoPercentual: 0, margemLucro: 0 })
              setObservacoes("")
              setFotoObra("")
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Tudo
          </Button>
        </div>
      </div>
    </div>
  )
}
