"use client"

import { useState, useCallback, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Trash2 } from "lucide-react"
import { stateAuth } from "@/app/src/services/estadoAuth"

// Interface para a mão de obra salva
interface Labor {
  id_Mobra: string;
  nome: string;
  valor_hora: number;
  id_user: string;
  created_at?: string;
}

export function MaoDeObra() {
  const [hourlyRate, setHourlyRate] = useState("")
  const [knowsHourlyRate, setKnowsHourlyRate] = useState(true)
  const [estimatedIncome, setEstimatedIncome] = useState("")
  const [hoursPerDay, setHoursPerDay] = useState("")
  const [workDays, setWorkDays] = useState({
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
    domingo: false,
  })
  const [calculatedRate, setCalculatedRate] = useState<number | null>(null)
  const [daysPerMonth, setDaysPerMonth] = useState<number | null>(null)
  const [totalHoursMonth, setTotalHoursMonth] = useState<number | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [laborName, setLaborName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [savedLabors, setSavedLabors] = useState<Labor[]>([])
  const [selectedLabor, setSelectedLabor] = useState<Labor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar mãos de obra salvas do banco de dados ao inicializar
  useEffect(() => {
    loadSavedLabors()
  }, [])

  // Função para buscar mãos de obra através da API
  const getMaoDeObraAPI = async (userId: string): Promise<Labor[]> => {
    try {
      const response = await fetch(`/api/mao-de-obra?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Erro ao buscar mãos de obra')
      }
      return await response.json()
    } catch (err) {
      console.error('❌ Falha na conexão:', err)
      throw err
    }
  }

  // Função para salvar mão de obra através da API
  const createMaoDeObraAPI = async (MaoDeObraData: {
    id_user: string;
    laborName: string;
    rateToSave: number;
  }): Promise<Labor> => {
    try {
      const response = await fetch('/api/mao-de-obra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(MaoDeObraData),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao salvar mão de obra')
      }
      
      return await response.json()
    } catch (err) {
      console.error('❌ Falha ao salvar:', err)
      throw err
    }
  }

  // Função para excluir mão de obra através da API
  const deleteMaoDeObraAPI = async (laborId: string) => {
    try {
      const response = await fetch(`/api/mao-de-obra?id=${laborId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Erro ao excluir mão de obra')
      }
      
      return await response.json()
    } catch (err) {
      console.error('❌ Falha ao excluir:', err)
      throw err
    }
  }

  // Carregar mãos de obra do banco de dados
  const loadSavedLabors = useCallback(async () => {
    try {
      setIsLoading(true)
      const userId = await stateAuth()
      if (userId) {
        const laborsFromDB = await getMaoDeObraAPI(userId)
        setSavedLabors(laborsFromDB)
      }
    } catch (error) {
      console.error("Erro ao carregar mãos de obra:", error)
      setErrorMessage("Erro ao carregar mãos de obra salvas.")
      setShowErrorDialog(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função de formatação memoizada
  const formatarMoeda = useCallback((valor: number | null): string => {
    if (valor === null || isNaN(valor) || !isFinite(valor)) return "R$ 0,00"

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

  // Função para formatar input como moeda
  const formatCurrencyInput = (value: string): string => {
    const onlyNumbers = value.replace(/\D/g, '')
    if (onlyNumbers === '') return ''
    
    const numberValue = parseFloat(onlyNumbers) / 100
    return formatarMoeda(numberValue)
  }

  // Função para converter valor formatado para número
  const currencyToNumber = (currency: string): number => {
    if (!currency) return 0
    
    const numericString = currency
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim()
    
    return parseFloat(numericString) || 0
  }

  const handleWorkDayChange = (day: keyof typeof workDays) => {
    setWorkDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  const formatNumberInput = (value: string, isCurrency: boolean = false, isHours: boolean = false) => {
    if (isCurrency) {
      return formatCurrencyInput(value)
    }
    
    let formattedValue = value.replace(/[^\d,]/g, '')
    
    const commaCount = formattedValue.split(',').length - 1
    if (commaCount > 1) {
      formattedValue = formattedValue.replace(/,+$/, '')
    }
    
    if (formattedValue.includes(',')) {
      const parts = formattedValue.split(',')
      if (parts[1].length > 2) {
        formattedValue = parts[0] + ',' + parts[1].substring(0, 2)
      }
    }
    
    if (isHours && formattedValue) {
      const numericValue = parseFloat(formattedValue.replace(',', '.'))
      
      if (numericValue < 0) {
        formattedValue = '0'
      }
      
      if (numericValue > 24) {
        formattedValue = '24'
      }
      
      if (formattedValue.includes(',') && parseFloat(formattedValue.replace(',', '.')) > 24) {
        formattedValue = '24'
      }
    }
    
    return formattedValue
  }

  const handleInputChange = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, isCurrency: boolean = false, isHours: boolean = false) => {
    const formattedValue = formatNumberInput(value, isCurrency, isHours)
    setter(formattedValue)
  }

  const calculateHourlyRate = () => {
    const income = currencyToNumber(estimatedIncome)
    const hoursDaily = parseFloat(hoursPerDay.replace(',', '.'))
    const daysPerWeek = Object.values(workDays).filter(Boolean).length
    
    if (daysPerWeek === 0) {
      setErrorMessage("Selecione pelo menos um dia da semana trabalhado.")
      setShowErrorDialog(true)
      return
    }
    
    if (!income || income <= 0) {
      setErrorMessage("Informe uma expectativa salarial válida.")
      setShowErrorDialog(true)
      return
    }
    
    if (!hoursDaily || hoursDaily <= 0) {
      setErrorMessage("Informe uma quantidade de horas diárias válida.")
      setShowErrorDialog(true)
      return
    }

    if (hoursDaily > 24) {
      setErrorMessage("As horas trabalhadas por dia não podem ser maiores que 24 horas.")
      setShowErrorDialog(true)
      return
    }

    const daysPerMonthValue = Math.round((daysPerWeek / 7) * 30)
    const totalHoursMonthValue = parseFloat((hoursDaily * daysPerMonthValue).toFixed(2))

    if (income > 0 && totalHoursMonthValue > 0) {
      const rate = income / totalHoursMonthValue
      setCalculatedRate(rate)
      setDaysPerMonth(daysPerMonthValue)
      setTotalHoursMonth(totalHoursMonthValue)
    } else {
      setCalculatedRate(null)
      setDaysPerMonth(null)
      setTotalHoursMonth(null)
    }
  }

  const handleSave = () => {
    let rateToSave: number | null = null
    
    if (knowsHourlyRate) {
      if (hourlyRate) {
        rateToSave = currencyToNumber(hourlyRate)
      } else {
        setErrorMessage("Por favor, informe o valor da hora antes de salvar.")
        setShowErrorDialog(true)
        return
      }
    } else {
      if (!calculatedRate) {
        setErrorMessage("Por favor, calcule o valor da hora antes de salvar.")
        setShowErrorDialog(true)
        return
      }
      rateToSave = calculatedRate
    }

    if (rateToSave && rateToSave > 0) {
      setShowSaveDialog(true)
    } else {
      setErrorMessage("Por favor, informe ou calcule um valor válido antes de salvar.")
      setShowErrorDialog(true)
    }
  }

  const confirmSave = async () => {
    const rateToSave = knowsHourlyRate 
      ? currencyToNumber(hourlyRate)
      : calculatedRate
    
    const userId = await stateAuth();
    
    try {
      await createMaoDeObraAPI({
        id_user: userId,
        laborName: laborName,
        rateToSave: rateToSave as number
      })
      
      // Recarregar a lista após salvar
      const updatedLabors = await getMaoDeObraAPI(userId)
      setSavedLabors(updatedLabors)
      
      setShowSaveDialog(false)
      setLaborName("")
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Erro ao salvar mão de obra:", error)
      setErrorMessage("Erro ao salvar mão de obra. Tente novamente.")
      setShowErrorDialog(true)
    }
  }

  const handleSelectLabor = (labor: Labor) => {
    setSelectedLabor(labor)
    setKnowsHourlyRate(true)
    setHourlyRate(formatarMoeda(labor.valor_hora))
  }

  const handleDeleteLabor = async (laborId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      await deleteMaoDeObraAPI(laborId)
      
      // Recarregar a lista do banco de dados
      const userId = await stateAuth()
      const updatedLabors = await getMaoDeObraAPI(userId)
      setSavedLabors(updatedLabors)
      
      // Se a mão de obra deletada era a selecionada, limpar seleção
      if (selectedLabor && selectedLabor.id_Mobra === laborId) {
        setSelectedLabor(null)
        setHourlyRate("")
      }
    } catch (error) {
      console.error("Erro ao excluir mão de obra:", error)
      setErrorMessage("Erro ao excluir mão de obra. Tente novamente.")
      setShowErrorDialog(true)
    }
  }

  return (
    <div className="grid gap-8">
      {/* Card para selecionar mão de obra existente */}
      <Card>
        <CardHeader>
          <CardTitle>Mãos de Obra Salvas</CardTitle>
          <CardDescription>
            {isLoading ? "Carregando..." : "Selecione uma mão de obra salva ou crie uma nova"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <p>Carregando mãos de obra...</p>
            </div>
          ) : savedLabors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedLabors.map((labor) => (
                <div
                  key={labor.id_Mobra}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedLabor?.id_Mobra === labor.id_Mobra 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => handleSelectLabor(labor)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{labor.nome}</h4>
                      <p className="text-sm text-purple-600">{formatarMoeda(labor.valor_hora)}/hora</p>
                      {labor.created_at && (
                        <p className="text-xs text-gray-500">
                          Criada em: {new Date(labor.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                      onClick={(e) => handleDeleteLabor(labor.id_Mobra, e)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Nenhuma mão de obra salva ainda.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valor da Hora</CardTitle>
          <CardDescription>
            Você sabe o valor da sua hora de trabalho?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="knows-hourly-rate"
                checked={knowsHourlyRate}
                onCheckedChange={setKnowsHourlyRate}
              />
              <Label htmlFor="knows-hourly-rate">
                {knowsHourlyRate ? "Sim, sei meu valor" : "Não, quero calcular"}
              </Label>
            </div>
            {knowsHourlyRate && (
              <>
                <Label htmlFor="hourly-rate">Valor por Hora (R$)</Label>
                <Input
                  id="hourly-rate"
                  type="text"
                  placeholder="Ex: R$ 50,00"
                  value={hourlyRate}
                  onChange={(e) => handleInputChange(e.target.value, setHourlyRate, true)}
                />
              </>
            )}
          </div>
        </CardContent>
        {knowsHourlyRate && (
          <CardFooter>
            <Button onClick={handleSave}>Salvar</Button>
          </CardFooter>
        )}
      </Card>

      {!knowsHourlyRate && (
        <Card>
          <CardHeader>
            <CardTitle>Calcule seu valor por hora</CardTitle>
            <CardDescription>
              Informe sua expectativa salarial e horas trabalhadas para calcular o
              valor da sua hora.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="estimated-income">
                Expectativa Salarial Mensal (R$)
              </Label>
              <Input
                id="estimated-income"
                type="text"
                placeholder="Ex: R$ 5.000,00"
                value={estimatedIncome}
                onChange={(e) => handleInputChange(e.target.value, setEstimatedIncome, true)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours-per-day">Horas Trabalhadas por Dia</Label>
              <Input
                id="hours-per-day"
                type="text"
                placeholder="Ex: 8,5"
                value={hoursPerDay}
                onChange={(e) => handleInputChange(e.target.value, setHoursPerDay, false, true)}
              />
            </div>
            <div className="space-y-2">
              <Label>Dias da Semana Trabalhados</Label>
              <div className="flex flex-wrap gap-4">
                {Object.keys(workDays).map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={workDays[day as keyof typeof workDays]}
                      onCheckedChange={() =>
                        handleWorkDayChange(day as keyof typeof workDays)
                      }
                    />
                    <Label htmlFor={day} className="capitalize">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {calculatedRate !== null && daysPerMonth !== null && totalHoursMonth !== null && (
              <div className="text-center space-y-2 p-4 bg-muted rounded-lg">
                <p className="text-lg font-semibold">Resultado do cálculo:</p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Dias/mês</p>
                    <p className="text-xl font-bold">{daysPerMonth}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Horas/mês</p>
                    <p className="text-xl font-bold">{totalHoursMonth}h</p>
                  </div>
                </div>
                <p className="text-sm mt-4">Seu valor por hora é:</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatarMoeda(calculatedRate)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4 mt-3">
            <Button onClick={calculateHourlyRate}>
              Calcular
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </CardFooter>
        </Card>
      )}

      {/* Diálogo para nomear a mão de obra */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nomear Mão de Obra</DialogTitle>
            <DialogDescription>
              Digite um nome para identificar esta mão de obra.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="labor-name" className="text-right">
                Nome
              </Label>
              <Input
                id="labor-name"
                value={laborName}
                onChange={(e) => setLaborName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Eletricista, Pedreiro, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmSave} 
              disabled={!laborName.trim()}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de erro */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Erro
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>Entendi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de sucesso */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Sucesso
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Alert className="border-green-600 bg-green-50">
              <AlertDescription className="text-green-800">
                Mão de obra "{laborName}" salva com sucesso!
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}