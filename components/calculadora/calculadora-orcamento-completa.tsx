"use client"

import { useState } from "react"
import { Calculator, FileText, Camera, Wrench, Package, Palette, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function CalculadoraOrcamentoCompleta() {
  // Estados para dados de cadastro
  const [dadosCadastro, setDadosCadastro] = useState({
    dataOrcamento: "30/12/2024",
    cliente: "Nome do Cliente",
    obra: "Nome da Obra",
    endereco: "Colocar endereço",
    responsavel: "Nome do Responsável",
  })

  const [descricaoObra, setDescricaoObra] = useState("Pergolado com 75m² de cobertura + 165m² de revestimento em ACM")

  // Estados para matéria prima
  const [materiaPrima, setMateriaPrima] = useState([
    { id: 1, qtBarras: 37, quantKg: 1030, precoKg: 8.0, descricao: "Perfil U 200x50x2,25mm" },
    { id: 2, qtBarras: 52, quantKg: 388, precoKg: 8.0, descricao: "Perfil U 50x25x2,25mm" },
    { id: 3, qtBarras: 23, quantKg: 457, precoKg: 9.5, descricao: "Tubo 100x50x2,00mm" },
    { id: 4, qtBarras: 21, quantKg: 262, precoKg: 8.0, descricao: 'Cantoneira 2x1"x1/8"' },
    { id: 5, qtBarras: 16, quantKg: 83, precoKg: 8.5, descricao: "Chapa Dobrada 500x200x5mm para pilares" },
    { id: 6, qtBarras: 1, quantKg: 200, precoKg: 10.0, descricao: "Estrutura auxiliar acm" },
  ])

  // Estados para mão de obra fabricação
  const [maoObraFabricacao, setMaoObraFabricacao] = useState([
    { id: 1, descricao: "FABRICAÇÃO ESTRUTURA", pessoas: 4, dias: 4, hrsDia: 9, precoHr: 40 },
    { id: 2, descricao: "DOBRA DO ACM", pessoas: 2, dias: 2, hrsDia: 9, precoHr: 40 },
  ])

  // Estados para mão de obra instalação
  const [maoObraInstalacao, setMaoObraInstalacao] = useState([
    { id: 1, descricao: "INSTALAÇÃO", pessoas: 4, dias: 3, hrsDia: 9, precoHr: 40 },
    { id: 2, descricao: "INSTALAÇÃO DO ACM", pessoas: 3, dias: 1, hrsDia: 5, precoHr: 40 },
  ])

  // Estados para itens comerciais
  const [itensComerciais, setItensComerciais] = useState([
    {
      id: 1,
      qt: 35,
      unid: "Unid.",
      precoUnit: 435.0,
      descricao: "ACM 3mm medindo 1,22x5,00 na cor AZUL (6,10m² cada chapa) - EASYBOLD",
    },
    {
      id: 2,
      qt: 17,
      unid: "m²",
      precoUnit: 110.0,
      descricao: "Telha tp 40 esp. 0,50mm + 50mm EPS + Telha tp 40 esp. 0,43mm (Vermelho duas faces)",
    },
    {
      id: 3,
      qt: 30,
      unid: "m²",
      precoUnit: 110.0,
      descricao: "Telha tp 40 esp. 0,50mm + 50mm EPS + Telha tp 40 esp. 0,43mm (Amarelo duas faces)",
    },
    {
      id: 4,
      qt: 26,
      unid: "m²",
      precoUnit: 110.0,
      descricao: "Telha tp 40 esp. 0,50mm + 50mm EPS + Telha tp 40 esp. 0,43mm (Azul duas faces)",
    },
    { id: 5, qt: 26, unid: "m²", precoUnit: 65.0, descricao: "Telha translúcida tp 40 esp. 1mm" },
    { id: 6, qt: 25, unid: "m", precoUnit: 130.0, descricao: "Calha corte 700mm esp. 0,65mm pintada" },
    { id: 7, qt: 1, unid: "cj", precoUnit: 3000.0, descricao: "Acessórios para ACM" },
    { id: 8, qt: 1, unid: "cj", precoUnit: 1700.0, descricao: "Parafusos e acessórios" },
    { id: 9, qt: 19, unid: "m", precoUnit: 85.0, descricao: "Rufo corte 500mm pintado de acabamento" },
  ])

  // Estados para acabamento
  const [acabamento, setAcabamento] = useState([
    { id: 1, quant: 3020, unid: "kg", precoKg: 3.3, descricao: "GALVANIZADO A FOGO" },
    {
      id: 2,
      quant: 457,
      unid: "kg",
      precoKg: 1.0,
      descricao: "estrutura metálica que ficar aparente será pintada cor a verificar",
    },
  ])

  // Estados para consumo
  const [consumo, setConsumo] = useState([
    { id: 1, qt: 0, unid: "cj", preco: 300.0, descricao: "Solda" },
    { id: 2, qt: 0, unid: "cj", preco: 100.0, descricao: "Discos" },
    {
      id: 3,
      qt: 0,
      unid: "Hrs",
      preco: 350.0,
      descricao: "Plataforma elevatoria Usará plataforma estrutura à 6m do chão pra fora do prédio",
    },
    { id: 4, qt: 3, unid: "dias", preco: 800.0, descricao: "Locação de equipamentos munck" },
    { id: 5, qt: 12, unid: "almoço", preco: 20.0, descricao: "Refeição P/ Obra" },
    { id: 6, qt: 3, unid: "dia", preco: 60.0, descricao: "Combustível P/ Obra" },
    { id: 7, qt: 1, unid: "CJ", preco: 100.0, descricao: "Ajuda de Custo com medições e engenharia" },
    { id: 8, qt: 0, unid: "CJ", preco: 0.0, descricao: "Estadia em hotel com café da manha e janta" },
    { id: 9, qt: 3, unid: "CJ", preco: 200.0, descricao: "FRETE" },
  ])

  // Estados para dados finais
  const [dadosFinais, setDadosFinais] = useState({
    precoVenda: 135000.0,
    engenharia: 2700.0,
    comissao: 4050.0,
    consultoria: 0.0,
    imposto: 7737.6,
    lucro: 12622.4,
    margem: 9.35,
  })

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
  const custoTotalComEngenharia =
    custoTotalObra + dadosFinais.engenharia + dadosFinais.comissao + dadosFinais.consultoria + dadosFinais.imposto
  const precoPorKg = custoTotalComEngenharia / pesoTotal
  const precoPorM2 = custoTotalComEngenharia / 75 // 75m² de cobertura

  const etapas = [
    { numero: 1, titulo: "Dados de cadastro", concluido: true },
    { numero: 2, titulo: "Descrição da obra", concluido: true },
    { numero: 3, titulo: "Dados estimados (kg)", concluido: true },
    { numero: 4, titulo: "Preço por quilo", concluido: true },
    { numero: 5, titulo: "Descrição do item", concluido: true },
    { numero: 6, titulo: "Valor orçado peso", concluido: true },
    { numero: 7, titulo: "Valor de referência", concluido: true },
    { numero: 8, titulo: "Mão obra fabricação", concluido: true },
    { numero: 9, titulo: "Mão obra instalação", concluido: true },
    { numero: 10, titulo: "Dados unidades variadas", concluido: true },
    { numero: 11, titulo: "Preço por unidade", concluido: true },
    { numero: 12, titulo: "Descrição item", concluido: true },
    { numero: 13, titulo: "Valor orçado unidade", concluido: true },
    { numero: 14, titulo: "Acabamento", concluido: true },
    { numero: 15, titulo: "Itens de consumo", concluido: true },
    { numero: 16, titulo: "Observações", concluido: true },
    { numero: 17, titulo: "Resultado orçamento", concluido: true },
    { numero: 18, titulo: "Foto da obra", concluido: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Calculadora de Orçamento - Pergolado ACM</h1>
          <p className="text-gray-600">Orçamento completo com todos os custos detalhados</p>
        </div>

        {/* Linha de Progresso */}
        <div className="relative mb-12 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Progresso do Orçamento</h2>
            <span className="text-sm font-medium text-green-600">17/18 etapas concluídas</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
              style={{ width: "94.4%" }}
            ></div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 lg:grid-cols-18 gap-2">
            {etapas.map((etapa) => (
              <div key={etapa.numero} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    etapa.concluido ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {etapa.numero}
                </div>
                <span className="text-xs mt-1 text-center max-w-16 truncate" title={etapa.titulo}>
                  {etapa.titulo.split(" ")[0]}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Data do Orçamento</Label>
                    <Input value={dadosCadastro.dataOrcamento} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>Cliente</Label>
                    <Input value={dadosCadastro.cliente} readOnly className="bg-gray-50" />
                  </div>
                </div>
                <div>
                  <Label>Obra</Label>
                  <Input value={dadosCadastro.obra} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label>Descrição da Obra</Label>
                  <Textarea value={descricaoObra} readOnly className="bg-gray-50" rows={2} />
                </div>
              </CardContent>
            </Card>

            {/* Matéria Prima */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  3-6. Matéria Prima
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {materiaPrima.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-sm p-2 bg-gray-50 rounded">
                      <span className="font-medium">{item.qtBarras} barras</span>
                      <span>{item.quantKg} kg</span>
                      <span>R$ {item.precoKg.toFixed(2)}/kg</span>
                      <span className="font-bold">
                        R$ {(item.quantKg * item.precoKg).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs">{item.descricao}</span>
                    </div>
                  ))}
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="font-bold text-blue-700">
                      Total Matéria Prima: R$ {valorMateriaPrima.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-blue-600">Peso Total: {pesoTotal.toLocaleString()} kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mão de Obra */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  7-9. Mão de Obra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Fabricação</h4>
                  {maoObraFabricacao.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-sm p-2 bg-gray-50 rounded">
                      <span>{item.descricao}</span>
                      <span>{item.pessoas}p</span>
                      <span>{item.dias}d</span>
                      <span>{item.hrsDia}h/d</span>
                      <span>R${item.precoHr}/h</span>
                      <span className="font-bold">
                        R$ {(item.pessoas * item.dias * item.hrsDia * item.precoHr).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))}
                  <p className="text-sm text-green-600 font-medium">
                    Subtotal Fabricação: R$ {valorMaoObraFab.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Instalação</h4>
                  {maoObraInstalacao.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-sm p-2 bg-gray-50 rounded">
                      <span>{item.descricao}</span>
                      <span>{item.pessoas}p</span>
                      <span>{item.dias}d</span>
                      <span>{item.hrsDia}h/d</span>
                      <span>R${item.precoHr}/h</span>
                      <span className="font-bold">
                        R$ {(item.pessoas * item.dias * item.hrsDia * item.precoHr).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))}
                  <p className="text-sm text-green-600 font-medium">
                    Subtotal Instalação: R$ {valorMaoObraInst.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="font-bold text-green-700">
                    Total Mão de Obra: R${" "}
                    {(valorMaoObraFab + valorMaoObraInst).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Itens Comerciais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  10-13. Itens Comerciais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {itensComerciais.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm p-2 bg-gray-50 rounded">
                      <span>
                        {item.qt} {item.unid}
                      </span>
                      <span>R$ {item.precoUnit.toFixed(2)}</span>
                      <span className="font-bold">
                        R$ {(item.qt * item.precoUnit).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs">{item.descricao.substring(0, 30)}...</span>
                    </div>
                  ))}
                  <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <p className="font-bold text-purple-700">
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
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  14. Acabamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {acabamento.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm p-2 bg-gray-50 rounded">
                      <span>
                        {item.quant} {item.unid}
                      </span>
                      <span>R$ {item.precoKg.toFixed(2)}/kg</span>
                      <span className="font-bold">
                        R$ {(item.quant * item.precoKg).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs">{item.descricao}</span>
                    </div>
                  ))}
                  <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <p className="font-bold text-orange-700">
                      Total Acabamento: R$ {valorAcabamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consumo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  15. Consumo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {consumo
                    .filter((item) => item.qt > 0)
                    .map((item) => (
                      <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm p-2 bg-gray-50 rounded">
                        <span>
                          {item.qt} {item.unid}
                        </span>
                        <span>R$ {item.preco.toFixed(2)}</span>
                        <span className="font-bold">
                          R$ {(item.qt * item.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs">{item.descricao.substring(0, 30)}...</span>
                      </div>
                    ))}
                  <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <p className="font-bold text-red-700">
                      Total Consumo: R$ {valorConsumo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultado Final */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Calculator className="w-6 h-6" />
                  17. RESULTADO FINAL DO ORÇAMENTO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Matéria Prima:</span>
                        <span className="font-bold">
                          R$ {valorMateriaPrima.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mão de Obra Fab.:</span>
                        <span className="font-bold">
                          R$ {valorMaoObraFab.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mão de Obra Inst.:</span>
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
                    <div className="flex justify-between text-lg font-bold text-green-700">
                      <span>CUSTO TOTAL DA OBRA:</span>
                      <span>R$ {custoTotalObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-green-800">
                      <span>PREÇO DE VENDA:</span>
                      <span>R$ {dadosFinais.precoVenda.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600">Peso por m²</p>
                      <p className="text-lg font-bold text-blue-600">{(pesoTotal / 75).toFixed(1)} kg/m²</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-600">Preço por kg</p>
                      <p className="text-lg font-bold text-green-600">R$ {precoPorKg.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-600">Preço por m²</p>
                      <p className="text-lg font-bold text-purple-600">R$ {precoPorM2.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <strong>Margem de Lucro:</strong> {dadosFinais.margem}% |<strong> Lucro:</strong> R${" "}
                      {dadosFinais.lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Gerar Proposta PDF
          </Button>
          <Button variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Adicionar Foto da Obra
          </Button>
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Recalcular Orçamento
          </Button>
        </div>
      </div>
    </div>
  )
}
