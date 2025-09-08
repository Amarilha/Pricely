"use client"

import { useState } from "react"
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

  const handleWorkDayChange = (day: keyof typeof workDays) => {
    setWorkDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace('.', ',')
  }

  const formatNumberInput = (value: string, isCurrency: boolean = false) => {
    // Remove tudo que não é número ou vírgula
    let formattedValue = value.replace(/[^\d,]/g, '')
    
    // Permite apenas uma vírgula
    const commaCount = formattedValue.split(',').length - 1
    if (commaCount > 1) {
      formattedValue = formattedValue.replace(/,+$/, '')
    }
    
    // Limita a duas casas decimais após a vírgula
    if (formattedValue.includes(',')) {
      const parts = formattedValue.split(',')
      if (parts[1].length > 2) {
        formattedValue = parts[0] + ',' + parts[1].substring(0, 2)
      }
    }
    
    return formattedValue
  }

  const handleInputChange = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, isCurrency: boolean = false) => {
    const formattedValue = formatNumberInput(value, isCurrency)
    setter(formattedValue)
  }

  const calculateHourlyRate = () => {
    const income = parseFloat(estimatedIncome.replace(',', '.'))
    const hoursDaily = parseFloat(hoursPerDay.replace(',', '.'))
    const daysPerWeek = Object.values(workDays).filter(Boolean).length
    
    // Cálculo correto considerando 30 dias no mês
    const daysPerMonthValue = Math.round((daysPerWeek / 7) * 30)
    const totalHoursMonthValue = hoursDaily * daysPerMonthValue

    if (income > 0 && totalHoursMonthValue > 0) {
      setCalculatedRate(income / totalHoursMonthValue)
      setDaysPerMonth(daysPerMonthValue)
      setTotalHoursMonth(totalHoursMonthValue)
    } else {
      setCalculatedRate(null)
      setDaysPerMonth(null)
      setTotalHoursMonth(null)
    }
  }

  return (
    <div className="grid gap-8 md:grid-row-2">
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
                  placeholder="Ex: 50,00"
                  value={hourlyRate}
                  onChange={(e) => handleInputChange(e.target.value, setHourlyRate, true)}
                />
              </>
            )}
          </div>
        </CardContent>
        {knowsHourlyRate && (
          <CardFooter>
            <Button>Salvar</Button>
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
                placeholder="Ex: 5000,00"
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
                onChange={(e) => handleInputChange(e.target.value, setHoursPerDay)}
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
                    <p className="text-xl font-bold">{formatCurrency(totalHoursMonth)}h</p>
                  </div>
                </div>
                <p className="text-sm mt-4">Seu valor por hora é:</p>
                <p className="text-3xl font-bold text-purple-600">
                  R$ {formatCurrency(calculatedRate)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={calculateHourlyRate} className="w-full">
              Calcular
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}