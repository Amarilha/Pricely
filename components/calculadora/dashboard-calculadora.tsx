"use client"

import { useState } from "react"
import { Calculator, TrendingUp, Target, Award, Zap, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function DashboardCalculadora() {
  const [pontos, setPontos] = useState([
    { id: 1, nome: "Meta 1", valor: 0, icone: Target, cor: "bg-blue-500" },
    { id: 2, nome: "Meta 2", valor: 0, icone: TrendingUp, cor: "bg-green-500" },
    { id: 3, nome: "Meta 3", valor: 0, icone: Award, cor: "bg-yellow-500" },
    { id: 4, nome: "Meta 4", valor: 0, icone: Zap, cor: "bg-purple-500" },
    { id: 5, nome: "Meta 5", valor: 0, icone: Star, cor: "bg-pink-500" },
    { id: 6, nome: "Meta 6", valor: 0, icone: Calculator, cor: "bg-orange-500" },
  ])

  const atualizarValor = (id: number, novoValor: number) => {
    setPontos(pontos.map((ponto) => (ponto.id === id ? { ...ponto, valor: novoValor } : ponto)))
  }

  const calcularTotal = () => {
    return pontos.reduce((total, ponto) => total + ponto.valor, 0)
  }

  const calcularMedia = () => {
    const total = calcularTotal()
    return total / pontos.length
  }

  const calcularPorcentagem = () => {
    const total = calcularTotal()
    const meta = 600 // Meta total de exemplo
    return (total / meta) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard de Metas</h1>
          <p className="text-gray-600">Configure os valores nos 6 pontos e veja o cálculo final</p>
        </div>

        {/* Linha com 6 Pontos */}
        <div className="relative mb-12">
          {/* Linha de fundo */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded-full transform -translate-y-1/2"></div>

          {/* Linha de progresso */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transform -translate-y-1/2 transition-all duration-500"
            style={{ width: `${Math.min(calcularPorcentagem(), 100)}%` }}
          ></div>

          {/* Pontos */}
          <div className="relative flex justify-between items-center">
            {pontos.map((ponto, index) => {
              const Icone = ponto.icone
              return (
                <div key={ponto.id} className="flex flex-col items-center">
                  {/* Ponto */}
                  <div
                    className={`w-16 h-16 ${ponto.cor} rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200 relative z-10`}
                  >
                    <Icone className="w-8 h-8 text-white" />
                  </div>

                  {/* Label */}
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-gray-700">{ponto.nome}</p>
                    <div className="mt-2">
                      <Input
                        type="number"
                        value={ponto.valor}
                        onChange={(e) => atualizarValor(ponto.id, Number(e.target.value))}
                        className="w-20 text-center"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Cards de Cálculo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-600">Total Acumulado</CardDescription>
              <CardTitle className="text-3xl font-bold text-blue-700">{calcularTotal().toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600">Soma de todos os pontos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-600">Média dos Pontos</CardDescription>
              <CardTitle className="text-3xl font-bold text-green-700">{calcularMedia().toFixed(1)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">Valor médio por ponto</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-purple-600">Progresso da Meta</CardDescription>
              <CardTitle className="text-3xl font-bold text-purple-700">{calcularPorcentagem().toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-600">Meta: 600 pontos</p>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes dos Cálculos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Detalhes dos Cálculos
            </CardTitle>
            <CardDescription>Breakdown completo dos valores e cálculos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Lista de Valores */}
              <div>
                <h3 className="font-semibold mb-4">Valores por Ponto:</h3>
                <div className="space-y-3">
                  {pontos.map((ponto) => {
                    const Icone = ponto.icone
                    return (
                      <div key={ponto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${ponto.cor} rounded-full flex items-center justify-center`}>
                            <Icone className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{ponto.nome}</span>
                        </div>
                        <span className="text-lg font-bold">{ponto.valor}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Fórmulas */}
              <div>
                <h3 className="font-semibold mb-4">Fórmulas de Cálculo:</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-medium text-blue-700">Total</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      {pontos.map((p) => p.valor).join(" + ")} = <strong>{calcularTotal()}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-medium text-green-700">Média</h4>
                    <p className="text-sm text-green-600 mt-1">
                      {calcularTotal()} ÷ 6 = <strong>{calcularMedia().toFixed(2)}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-medium text-purple-700">Porcentagem da Meta</h4>
                    <p className="text-sm text-purple-600 mt-1">
                      ({calcularTotal()} ÷ 600) × 100 = <strong>{calcularPorcentagem().toFixed(2)}%</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Reset */}
            <div className="mt-6 text-center">
              <Button
                onClick={() => setPontos(pontos.map((p) => ({ ...p, valor: 0 })))}
                variant="outline"
                className="w-full md:w-auto"
              >
                Resetar Todos os Valores
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
