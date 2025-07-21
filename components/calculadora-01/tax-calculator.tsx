"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TaxCalculatorProps {
  receitaBruta: number
  onTaxChange: (totalTax: number, breakdown: TaxBreakdown) => void
}

interface TaxBreakdown {
  simples: number
  iss: number
  pis: number
  cofins: number
  irpj: number
  csll: number
  total: number
  regime: string
}

export function TaxCalculator({ receitaBruta, onTaxChange }: TaxCalculatorProps) {
  const [regimeTributario, setRegimeTributario] = useState<string>("simples")
  const [aliquotaISS, setAliquotaISS] = useState<number>(5)
  const [faixaSimples, setFaixaSimples] = useState<number>(1)
  const [isCalculating, setIsCalculating] = useState(false)

  // Tabela do Simples Nacional (Anexo III - Serviços) - Memoizada para evitar recriação
  const tabelaSimples = useMemo(
    () => [
      { faixa: 1, receita: 180000, aliquota: 6.0 },
      { faixa: 2, receita: 360000, aliquota: 11.2 },
      { faixa: 3, receita: 720000, aliquota: 13.5 },
      { faixa: 4, receita: 1800000, aliquota: 16.0 },
      { faixa: 5, receita: 3600000, aliquota: 21.0 },
      { faixa: 6, receita: 4800000, aliquota: 33.0 },
    ],
    [],
  )

  // Função de cálculo memoizada para evitar recálculos desnecessários
  const calcularImpostos = useCallback((): TaxBreakdown => {
    // Validação de entrada para evitar cálculos com valores inválidos
    if (!receitaBruta || receitaBruta <= 0 || isNaN(receitaBruta)) {
      return {
        simples: 0,
        iss: 0,
        pis: 0,
        cofins: 0,
        irpj: 0,
        csll: 0,
        total: 0,
        regime: regimeTributario,
      }
    }

    const breakdown: TaxBreakdown = {
      simples: 0,
      iss: 0,
      pis: 0,
      cofins: 0,
      irpj: 0,
      csll: 0,
      total: 0,
      regime: regimeTributario,
    }

    try {
      if (regimeTributario === "simples") {
        const faixa = tabelaSimples.find((f) => f.faixa === faixaSimples) || tabelaSimples[0]
        breakdown.simples = (receitaBruta * faixa.aliquota) / 100
        breakdown.iss = (receitaBruta * aliquotaISS) / 100
        breakdown.total = breakdown.simples + breakdown.iss
      } else if (regimeTributario === "presumido") {
        breakdown.pis = (receitaBruta * 0.65) / 100
        breakdown.cofins = (receitaBruta * 3.0) / 100
        breakdown.irpj = (receitaBruta * 0.32 * 15) / 100 // 32% da receita, 15% de IR
        breakdown.csll = (receitaBruta * 0.32 * 9) / 100 // 32% da receita, 9% de CSLL
        breakdown.iss = (receitaBruta * aliquotaISS) / 100
        breakdown.total = breakdown.pis + breakdown.cofins + breakdown.irpj + breakdown.csll + breakdown.iss
      } else if (regimeTributario === "real") {
        breakdown.pis = (receitaBruta * 1.65) / 100
        breakdown.cofins = (receitaBruta * 7.6) / 100
        breakdown.irpj = (receitaBruta * 0.25 * 15) / 100 // Estimativa 25% lucro, 15% IR
        breakdown.csll = (receitaBruta * 0.25 * 9) / 100 // Estimativa 25% lucro, 9% CSLL
        breakdown.iss = (receitaBruta * aliquotaISS) / 100
        breakdown.total = breakdown.pis + breakdown.cofins + breakdown.irpj + breakdown.csll + breakdown.iss
      }

      // Validação dos resultados para evitar NaN ou Infinity
      Object.keys(breakdown).forEach((key) => {
        if (
          key !== "regime" &&
          (isNaN(breakdown[key as keyof TaxBreakdown] as number) ||
            !isFinite(breakdown[key as keyof TaxBreakdown] as number))
        ) {
          ;(breakdown as any)[key] = 0
        }
      })
    } catch (error) {
      console.error("Erro no cálculo de impostos:", error)
      // Retorna valores zerados em caso de erro
      return {
        simples: 0,
        iss: 0,
        pis: 0,
        cofins: 0,
        irpj: 0,
        csll: 0,
        total: 0,
        regime: regimeTributario,
      }
    }

    return breakdown
  }, [receitaBruta, regimeTributario, aliquotaISS, faixaSimples, tabelaSimples])

  // Memoizar o resultado dos impostos
  const impostos = useMemo(() => calcularImpostos(), [calcularImpostos])

  // Effect para chamar onTaxChange de forma controlada
  useEffect(() => {
    // Debounce para evitar chamadas excessivas
    const timeoutId = setTimeout(() => {
      if (!isCalculating && onTaxChange) {
        setIsCalculating(true)
        try {
          onTaxChange(impostos.total, impostos)
        } catch (error) {
          console.error("Erro ao chamar onTaxChange:", error)
        } finally {
          setIsCalculating(false)
        }
      }
    }, 100) // Debounce de 100ms

    return () => clearTimeout(timeoutId)
  }, [impostos, onTaxChange, isCalculating])

  // Função de formatação memoizada
  const formatarMoeda = useCallback((valor: number) => {
    if (!valor || isNaN(valor) || !isFinite(valor)) return "R$ 0,00"

    try {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      })
    } catch (error) {
      return `R$ ${valor.toFixed(2).replace(".", ",")}`
    }
  }, [])

  // Função de recomendação memoizada
  const recomendacao = useMemo(() => {
    if (!receitaBruta || receitaBruta <= 0) {
      return {
        regime: "Simples Nacional",
        motivo: "Recomendado para a maioria dos casos",
        cor: "default",
      }
    }

    if (receitaBruta <= 4800000) {
      return {
        regime: "Simples Nacional",
        motivo: "Menor carga tributária para este faturamento",
        cor: "default",
      }
    } else if (receitaBruta <= 78000000) {
      return {
        regime: "Lucro Presumido",
        motivo: "Boa opção para margem de lucro alta",
        cor: "secondary",
      }
    } else {
      return {
        regime: "Lucro Real",
        motivo: "Obrigatório para este faturamento",
        cor: "destructive",
      }
    }
  }, [receitaBruta])

  // Handlers com validação
  const handleRegimeChange = useCallback((value: string) => {
    if (value && typeof value === "string") {
      setRegimeTributario(value)
    }
  }, [])

  const handleFaixaChange = useCallback((value: string) => {
    const numValue = Number(value)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 6) {
      setFaixaSimples(numValue)
    }
  }, [])

  const handleISSChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setAliquotaISS(value)
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Impostos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="regime">Regime Tributário</Label>
              <Select value={regimeTributario} onValueChange={handleRegimeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Simples Nacional</SelectItem>
                  <SelectItem value="presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="real">Lucro Real</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {regimeTributario === "simples" && (
              <div>
                <Label htmlFor="faixa">Faixa Simples Nacional</Label>
                <Select value={faixaSimples.toString()} onValueChange={handleFaixaChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tabelaSimples.map((faixa) => (
                      <SelectItem key={faixa.faixa} value={faixa.faixa.toString()}>
                        Faixa {faixa.faixa} - {faixa.aliquota}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="iss">Alíquota ISS (%)</Label>
              <Input
                id="iss"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={aliquotaISS}
                onChange={handleISSChange}
              />
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Recomendação:</strong> {recomendacao.regime} - {recomendacao.motivo}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhamento dos Impostos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isCalculating ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-sm text-muted-foreground">Calculando...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {regimeTributario === "simples" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Simples Nacional:</span>
                    <Badge variant="outline">{formatarMoeda(impostos.simples)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ISS:</span>
                    <Badge variant="outline">{formatarMoeda(impostos.iss)}</Badge>
                  </div>
                </>
              )}

              {regimeTributario !== "simples" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">PIS:</span>
                    <Badge variant="outline">{formatarMoeda(impostos.pis)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">COFINS:</span>
                    <Badge variant="outline">{formatarMoeda(impostos.cofins)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">IRPJ:</span>
                    <Badge variant="outline">{formatarMoeda(impostos.irpj)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CSLL:</span>
                    <Badge variant="outline">{formatarMoeda(impostos.csll)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ISS:</span>
                    <Badge variant="outline">{formatarMoeda(impostos.iss)}</Badge>
                  </div>
                </>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total de Impostos:</span>
                  <Badge className="text-base">{formatarMoeda(impostos.total)}</Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Carga Tributária:</span>
                  <span className="text-sm font-medium">
                    {receitaBruta > 0 ? ((impostos.total / receitaBruta) * 100).toFixed(2) : "0.00"}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
