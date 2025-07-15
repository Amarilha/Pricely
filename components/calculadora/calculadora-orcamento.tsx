"use client"

import { useState } from "react"
import { Building2, Calculator, FileText, Camera, DollarSign, Wrench, Package, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function CalculadoraOrcamento() {
  // Estados para todos os campos
  const [dadosCadastro, setDadosCadastro] = useState({
    cliente: "",
    obra: "",
    data: "",
    responsavel: "",
  })

  const [descricaoObra, setDescricaoObra] = useState("")

  const [materiaisPeso, setMateriaisPeso] = useState({
    pesoKg: 0,
    precoPorKg: 0,
    descricaoItem: "",
  })

  const [referencias, setReferencias] = useState({
    valorReferencia: 0,
    maoObraFabricacao: 0,
    maoObraInstalacao: 0,
  })

  const [materiaisUnidade, setMateriaisUnidade] = useState({
    quantidade: 0,
    precoUnidade: 0,
    descricaoUnidade: "",
  })

  const [acabamentos, setAcabamentos] = useState({
    galvanizacao: 0,
    jateamento: 0,
    pintura: 0,
  })

  const [itensConsumo, setItensConsumo] = useState({
    parafusos: 0,
    soldas: 0,
    outros: 0,
  })

  const [observacoes, setObservacoes] = useState("")
  const [fotoObra, setFotoObra] = useState("")

  // Cálculos automáticos
  const valorOrcadoPeso = materiaisPeso.pesoKg * materiaisPeso.precoPorKg
  const valorOrcadoUnidade = materiaisUnidade.quantidade * materiaisUnidade.precoUnidade
  const totalAcabamentos = acabamentos.galvanizacao + acabamentos.jateamento + acabamentos.pintura
  const totalConsumo = itensConsumo.parafusos + itensConsumo.soldas + itensConsumo.outros
  const totalMaoObra = referencias.maoObraFabricacao + referencias.maoObraInstalacao

  const resultadoFinal =
    valorOrcadoPeso + valorOrcadoUnidade + totalAcabamentos + totalConsumo + totalMaoObra + referencias.valorReferencia

  const etapas = [
    { numero: 1, titulo: "Dados de Cadastro", icone: FileText, concluido: dadosCadastro.cliente && dadosCadastro.obra },
    { numero: 2, titulo: "Descrição da Obra", icone: Building2, concluido: descricaoObra.length > 0 },
    { numero: 3, titulo: "Dados por Peso (kg)", icone: Package, concluido: materiaisPeso.pesoKg > 0 },
    { numero: 4, titulo: "Preço por Kg", icone: DollarSign, concluido: materiaisPeso.precoPorKg > 0 },
    { numero: 5, titulo: "Descrição Item", icone: FileText, concluido: materiaisPeso.descricaoItem.length > 0 },
    { numero: 6, titulo: "Valor Orçado Peso", icone: Calculator, concluido: valorOrcadoPeso > 0 },
    { numero: 7, titulo: "Valor Referência", icone: DollarSign, concluido: referencias.valorReferencia > 0 },
    { numero: 8, titulo: "Mão de Obra Fabricação", icone: Wrench, concluido: referencias.maoObraFabricacao > 0 },
    { numero: 9, titulo: "Mão de Obra Instalação", icone: Wrench, concluido: referencias.maoObraInstalacao > 0 },
    { numero: 10, titulo: "Dados por Unidade", icone: Package, concluido: materiaisUnidade.quantidade > 0 },
    { numero: 11, titulo: "Preço por Unidade", icone: DollarSign, concluido: materiaisUnidade.precoUnidade > 0 },
    {
      numero: 12,
      titulo: "Descrição Unidade",
      icone: FileText,
      concluido: materiaisUnidade.descricaoUnidade.length > 0,
    },
    { numero: 13, titulo: "Valor Orçado Unidade", icone: Calculator, concluido: valorOrcadoUnidade > 0 },
    { numero: 14, titulo: "Acabamentos", icone: Palette, concluido: totalAcabamentos > 0 },
    { numero: 15, titulo: "Itens de Consumo", icone: Package, concluido: totalConsumo > 0 },
    { numero: 16, titulo: "Observações", icone: FileText, concluido: observacoes.length > 0 },
    { numero: 17, titulo: "Resultado Final", icone: Calculator, concluido: resultadoFinal > 0 },
    { numero: 18, titulo: "Foto da Obra", icone: Camera, concluido: fotoObra.length > 0 },
  ]

  const etapasConcluidas = etapas.filter((e) => e.concluido).length
  const progressoPercentual = (etapasConcluidas / 18) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Calculadora de Orçamento</h1>
          <p className="text-gray-600">Sistema completo para orçamento de estruturas metálicas</p>
        </div>

        {/* Linha de Progresso com 18 Pontos */}
        <div className="relative mb-12 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Progresso do Orçamento</h2>
            <span className="text-sm font-medium text-blue-600">{etapasConcluidas}/18 etapas concluídas</span>
          </div>

          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressoPercentual}%` }}
            ></div>
          </div>

          {/* Pontos das etapas */}
          <div className="grid grid-cols-6 md:grid-cols-9 lg:grid-cols-18 gap-2">
            {etapas.map((etapa) => {
              const Icone = etapa.icone
              return (
                <div key={etapa.numero} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      etapa.concluido ? "bg-green-500 text-white shadow-lg" : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {etapa.numero}
                  </div>
                  <span className="text-xs mt-1 text-center max-w-16 truncate" title={etapa.titulo}>
                    {etapa.titulo.split(" ")[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Entrada de Dados */}
          <div className="space-y-6">
            {/* 1-2: Dados de Cadastro e Descrição */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  1-2. Dados de Cadastro e Descrição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input
                      id="cliente"
                      value={dadosCadastro.cliente}
                      onChange={(e) => setDadosCadastro({ ...dadosCadastro, cliente: e.target.value })}
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="obra">Obra</Label>
                    <Input
                      id="obra"
                      value={dadosCadastro.obra}
                      onChange={(e) => setDadosCadastro({ ...dadosCadastro, obra: e.target.value })}
                      placeholder="Nome da obra"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição Sucinta da Obra</Label>
                  <Textarea
                    id="descricao"
                    value={descricaoObra}
                    onChange={(e) => setDescricaoObra(e.target.value)}
                    placeholder="Defina o que é a obra..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 3-6: Materiais por Peso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  3-6. Cálculo por Peso (kg)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="peso">Peso Estimado (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      value={materiaisPeso.pesoKg}
                      onChange={(e) => setMateriaisPeso({ ...materiaisPeso, pesoKg: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="precoPorKg">Preço por Kg (R$)</Label>
                    <Input
                      id="precoPorKg"
                      type="number"
                      step="0.01"
                      value={materiaisPeso.precoPorKg}
                      onChange={(e) => setMateriaisPeso({ ...materiaisPeso, precoPorKg: Number(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="descricaoItem">Descrição do Item</Label>
                  <Input
                    id="descricaoItem"
                    value={materiaisPeso.descricaoItem}
                    onChange={(e) => setMateriaisPeso({ ...materiaisPeso, descricaoItem: e.target.value })}
                    placeholder="Tipo de perfil, especificações..."
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Valor Orçado (Peso):</strong> R${" "}
                    {valorOrcadoPeso.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 7-9: Referências e Mão de Obra */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  7-9. Referências e Mão de Obra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="valorRef">Valor de Referência para Estrutura (R$)</Label>
                  <Input
                    id="valorRef"
                    type="number"
                    step="0.01"
                    value={referencias.valorReferencia}
                    onChange={(e) => setReferencias({ ...referencias, valorReferencia: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maoObraFab">Mão de Obra Fabricação (R$)</Label>
                    <Input
                      id="maoObraFab"
                      type="number"
                      step="0.01"
                      value={referencias.maoObraFabricacao}
                      onChange={(e) => setReferencias({ ...referencias, maoObraFabricacao: Number(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maoObraInst">Mão de Obra Instalação (R$)</Label>
                    <Input
                      id="maoObraInst"
                      type="number"
                      step="0.01"
                      value={referencias.maoObraInstalacao}
                      onChange={(e) => setReferencias({ ...referencias, maoObraInstalacao: Number(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 10-13: Materiais por Unidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  10-13. Cálculo por Unidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={materiaisUnidade.quantidade}
                      onChange={(e) => setMateriaisUnidade({ ...materiaisUnidade, quantidade: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="precoUnidade">Preço por Unidade (R$)</Label>
                    <Input
                      id="precoUnidade"
                      type="number"
                      step="0.01"
                      value={materiaisUnidade.precoUnidade}
                      onChange={(e) =>
                        setMateriaisUnidade({ ...materiaisUnidade, precoUnidade: Number(e.target.value) })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="descricaoUnidade">Descrição do Item</Label>
                  <Input
                    id="descricaoUnidade"
                    value={materiaisUnidade.descricaoUnidade}
                    onChange={(e) => setMateriaisUnidade({ ...materiaisUnidade, descricaoUnidade: e.target.value })}
                    placeholder="Parafusos, chapas, etc..."
                  />
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Valor Orçado (Unidade):</strong> R${" "}
                    {valorOrcadoUnidade.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Acabamentos e Resultado */}
          <div className="space-y-6">
            {/* 14: Acabamentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  14. Acabamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="galvanizacao">Galvanização (R$)</Label>
                  <Input
                    id="galvanizacao"
                    type="number"
                    step="0.01"
                    value={acabamentos.galvanizacao}
                    onChange={(e) => setAcabamentos({ ...acabamentos, galvanizacao: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="jateamento">Jateamento (R$)</Label>
                  <Input
                    id="jateamento"
                    type="number"
                    step="0.01"
                    value={acabamentos.jateamento}
                    onChange={(e) => setAcabamentos({ ...acabamentos, jateamento: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="pintura">Pintura (R$)</Label>
                  <Input
                    id="pintura"
                    type="number"
                    step="0.01"
                    value={acabamentos.pintura}
                    onChange={(e) => setAcabamentos({ ...acabamentos, pintura: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <strong>Total Acabamentos:</strong> R${" "}
                    {totalAcabamentos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 15: Itens de Consumo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  15. Itens de Consumo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="parafusos">Parafusos e Fixações (R$)</Label>
                  <Input
                    id="parafusos"
                    type="number"
                    step="0.01"
                    value={itensConsumo.parafusos}
                    onChange={(e) => setItensConsumo({ ...itensConsumo, parafusos: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="soldas">Soldas e Eletrodos (R$)</Label>
                  <Input
                    id="soldas"
                    type="number"
                    step="0.01"
                    value={itensConsumo.soldas}
                    onChange={(e) => setItensConsumo({ ...itensConsumo, soldas: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="outros">Outros Consumíveis (R$)</Label>
                  <Input
                    id="outros"
                    type="number"
                    step="0.01"
                    value={itensConsumo.outros}
                    onChange={(e) => setItensConsumo({ ...itensConsumo, outros: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">
                    <strong>Total Consumo:</strong> R${" "}
                    {totalConsumo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 16-18: Finalizações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  16-18. Finalizações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="observacoes">Observações Gerais</Label>
                  <Textarea
                    id="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Descrições que serão incluídas na proposta oficial..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="foto">URL da Foto da Obra</Label>
                  <Input
                    id="foto"
                    value={fotoObra}
                    onChange={(e) => setFotoObra(e.target.value)}
                    placeholder="https://exemplo.com/foto-obra.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resultado Final */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Calculator className="w-6 h-6" />
                  17. RESULTADO DO ORÇAMENTO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Materiais por Peso:</span>
                    <span>R$ {valorOrcadoPeso.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Materiais por Unidade:</span>
                    <span>R$ {valorOrcadoUnidade.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Valor de Referência:</span>
                    <span>R$ {referencias.valorReferencia.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mão de Obra Total:</span>
                    <span>R$ {totalMaoObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Acabamentos:</span>
                    <span>R$ {totalAcabamentos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Itens de Consumo:</span>
                    <span>R$ {totalConsumo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold text-green-700">
                    <span>TOTAL GERAL:</span>
                    <span>R$ {resultadoFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700">
            Imprimir Orçamento
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Reset todos os campos
              setDadosCadastro({ cliente: "", obra: "", data: "", responsavel: "" })
              setDescricaoObra("")
              setMateriaisPeso({ pesoKg: 0, precoPorKg: 0, descricaoItem: "" })
              setReferencias({ valorReferencia: 0, maoObraFabricacao: 0, maoObraInstalacao: 0 })
              setMateriaisUnidade({ quantidade: 0, precoUnidade: 0, descricaoUnidade: "" })
              setAcabamentos({ galvanizacao: 0, jateamento: 0, pintura: 0 })
              setItensConsumo({ parafusos: 0, soldas: 0, outros: 0 })
              setObservacoes("")
              setFotoObra("")
            }}
          >
            Limpar Tudo
          </Button>
        </div>
      </div>
    </div>
  )
}
