// components/calculadora-01/calendario.tsx
'use client';

import { useState, Fragment, useEffect, useMemo } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DateRangeSelectorProps {
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null, totalHours: number) => void;
  workDays?: boolean[];
  hoursPerDay?: number;
  setDados?: React.Dispatch<React.SetStateAction<any>>;
}

interface WorkHoursCalendarProps {
  dados: {
    horasTrabalhadasMes: number;
    selectedDays?: boolean[];
    hoursPerDay?: number;
    dataInicio?: string;
    dataFim?: string;
    tempoExecucao?: number;
  };
  setDados: React.Dispatch<
    React.SetStateAction<{
      horasTrabalhadasMes: number;
      selectedDays?: boolean[];
      hoursPerDay?: number;
      dataInicio?: string;
      dataFim?: string;
      tempoExecucao?: number;
      [key: string]: any;
    }>
  >;
  startDay?: string;
  daysInMonth?: number;
}

export const WorkHoursCalendar = ({
  dados,
  setDados,
  startDay = 'Monday',
  daysInMonth = 30,
}: WorkHoursCalendarProps) => {
  const [showDateRangeSelector, setShowDateRangeSelector] = useState(false);

  return (
    <Tooltip.Provider>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label>Horas Trabalhadas/Mês</Label>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span>
                <Info className="h-4 w-4 text-gray-500 cursor-help" />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-gray-800 text-white text-xs rounded py-2 px-3 max-w-xs"
                sideOffset={5}
              >
                Escolha entre definir dias da semana padrão ou selecionar um período específico.
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        <Button 
          variant="outline" 
          onClick={() => setShowDateRangeSelector(!showDateRangeSelector)}
          className="w-full"
        >
          {showDateRangeSelector ? 'Usar dias da semana padrão' : 'Selecionar período específico'}
        </Button>

        {showDateRangeSelector ? (
          <DateRangeSelector 
            onDateRangeChange={(start, end, hours) => {
              setDados(prev => ({
                ...prev,
                dataInicio: start?.toISOString().split('T')[0] || '',
                dataFim: end?.toISOString().split('T')[0] || '',
                tempoExecucao: hours,
                horasTrabalhadasMes: hours
              }));
            }}
            workDays={dados.selectedDays || [true, true, true, true, true, false, false]}
            hoursPerDay={dados.hoursPerDay || 8}
            setDados={setDados}
          />
        ) : (
          <StandardWorkDaysSelector 
            dados={dados}
            setDados={setDados}
            startDay={startDay}
            daysInMonth={daysInMonth}
          />
        )}
      </div>
    </Tooltip.Provider>
  );
};

const StandardWorkDaysSelector = ({
  dados,
  setDados,
  startDay = 'Monday',
  daysInMonth = 30,
}: WorkHoursCalendarProps) => {
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const startDayIndex = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  }[startDay];

  useEffect(() => {
    if (!dados.selectedDays || !Array.isArray(dados.selectedDays)) {
      setDados(prev => ({
        ...prev,
        selectedDays: [true, true, true, true, true, false, false], // Padrão: Seg-Sex
        hoursPerDay: 8,
        horasTrabalhadasMes: 0,
      }));
    }
  }, [dados, setDados]);

  const weekdayOccurrences = Array(7).fill(0).map((_, index) => {
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      if ((day - 1 + startDayIndex) % 7 === index) {
        count++;
      }
    }
    return count;
  });

  const daysPerWeek = dados.selectedDays?.filter((day) => day).length || 0;
  const totalWorkingDays = dados.selectedDays?.reduce(
    (sum, isSelected, index) => sum + (isSelected ? weekdayOccurrences[index] : 0),
    0
  ) || 0;
  const totalHours = totalWorkingDays * (dados.hoursPerDay || 0);

  useEffect(() => {
    if (dados.horasTrabalhadasMes !== totalHours) {
      setDados(prev => ({ 
        ...prev, 
        horasTrabalhadasMes: totalHours,
        tempoExecucao: totalHours
      }));
    }
  }, [totalHours, dados.horasTrabalhadasMes, setDados]);

  const toggleDay = (index: number) => {
    setDados(prev => {
      const newSelectedDays = [...(prev.selectedDays || Array(7).fill(false))];
      newSelectedDays[index] = !newSelectedDays[index];
      return { ...prev, selectedDays: newSelectedDays };
    });
  };

  const updateHours = (value: string) => {
    // Garante que o valor seja um número entre 0 e 24
    const hours = Math.max(0, Math.min(24, Number(value)));
    setDados(prev => ({ ...prev, hoursPerDay: hours }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {weekdays.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-center font-semibold text-gray-600">{day}</span>
            <Checkbox
              checked={dados.selectedDays ? dados.selectedDays[index] : false}
              onCheckedChange={() => toggleDay(index)}
              className="mt-2"
              title={`Marque para incluir ${day} como dia de trabalho (${weekdayOccurrences[index]} dias no mês)`}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Label title="Quantas horas você trabalha por dia nos dias selecionados">
          Horas por dia:
        </Label>
        <Input
          type="number"
          min="0"
          max="24"
          value={dados.hoursPerDay || 8}
          onChange={(e) => updateHours(e.target.value)}
          className="w-20"
          placeholder="Horas"
          title="Insira o número de horas trabalhadas por dia (máximo 24h)"
        />
      </div>

      <div className="text-sm text-gray-500">
        Total:{' '}
        <span className="font-semibold">
          {daysPerWeek} dias por semana, {totalWorkingDays} dias no mês, {totalHours}h no total
        </span>
      </div>
    </div>
  );
};

export const MilhaHoraCalculator = () => {
  const [salarioDesejado, setSalarioDesejado] = useState(5000);
  const [duracaoProjeto, setDuracaoProjeto] = useState(40);
  const [dadosCalendario, setDadosCalendario] = useState({
    horasTrabalhadasMes: 160,
    selectedDays: [true, true, true, true, true, false, false],
    hoursPerDay: 8,
  });

  const valorHora = useMemo(() => {
    if (dadosCalendario.horasTrabalhadasMes > 0) {
      return salarioDesejado / dadosCalendario.horasTrabalhadasMes;
    }
    return 0;
  }, [salarioDesejado, dadosCalendario.horasTrabalhadasMes]);

  const custoProjeto = useMemo(() => {
    return valorHora * duracaoProjeto;
  }, [valorHora, duracaoProjeto]);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de Valor/Hora</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="salario-desejado">Quanto você quer ganhar por mês?</Label>
            <Input
              id="salario-desejado"
              type="number"
              value={salarioDesejado}
              onChange={(e) => setSalarioDesejado(Number(e.target.value))}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="duracao-projeto">Quantas horas vai durar o projeto?</Label>
            <Input
              id="duracao-projeto"
              type="number"
              value={duracaoProjeto}
              onChange={(e) => setDuracaoProjeto(Number(e.target.value))}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <WorkHoursCalendar dados={dadosCalendario} setDados={setDadosCalendario} />
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-center">Resultado</h3>
          <div className="flex justify-around text-center">
            <div>
              <p className="text-sm text-gray-600">Seu valor/hora é</p>
              <p className="text-2xl font-bold text-purple-600">{formatarMoeda(valorHora)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Custo total do projeto</p>
              <p className="text-2xl font-bold text-green-600">{formatarMoeda(custoProjeto)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import { useDateRange } from './data-context';

export const DateRangeSelector = ({ 
  onDateRangeChange,
  workDays = [true, true, true, true, true, false, false],
  hoursPerDay = 8,
  setDados
}: DateRangeSelectorProps) => {
  const { dateRange, setDateRange } = useDateRange();
  const { startDate: selectedStartDate, endDate: selectedEndDate } = dateRange;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [totalHours, setTotalHours] = useState(0);
  const [workingDaysCount, setWorkingDaysCount] = useState(0);
  const [selectedDays, setSelectedDays] = useState(workDays);
  const [dailyHours, setDailyHours] = useState(hoursPerDay);

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const generateMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
    
    const weeks = [];
    let currentWeek = Array(7).fill(null);
    let dayCounter = 1;
    
    for (let i = 0; i < 6; i++) {
      currentWeek = Array(7).fill(null);
      
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfWeek) || dayCounter > daysInMonth) {
          currentWeek[j] = null;
        } else {
          currentWeek[j] = new Date(year, month, dayCounter);
          dayCounter++;
        }
      }
      
      weeks.push(currentWeek);
      if (dayCounter > daysInMonth) break;
    }
    
    return weeks;
  };

  const calculateWorkHours = (start: Date, end: Date, workDays: boolean[], dailyHours: number) => {
    let daysCount = 0;
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);
    
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    
    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (workDays[dayOfWeek]) {
        daysCount++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return {
      days: daysCount,
      hours: daysCount * dailyHours
    };
  };

  const updateHours = (value: string) => {
    // Garante que o valor seja um número entre 0 e 24
    const hours = Math.max(0, Math.min(24, Number(value)));
    setDailyHours(hours);
    if (setDados) {
      setDados(prev => ({ ...prev, hoursPerDay: hours }));
    }
  };

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const { days, hours } = calculateWorkHours(selectedStartDate, selectedEndDate, selectedDays, dailyHours);
      setWorkingDaysCount(days);
      setTotalHours(hours);
      
      if (onDateRangeChange) {
        onDateRangeChange(selectedStartDate, selectedEndDate, hours);
      }
    } else {
      setWorkingDaysCount(0);
      setTotalHours(0);
    }
  }, [selectedStartDate, selectedEndDate, selectedDays, dailyHours, onDateRangeChange]);

  const currentMonthDays = generateMonthDays(currentMonth);
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  const nextMonthDays = generateMonthDays(nextMonth);

  const handleDateClick = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setDateRange({ startDate: date, endDate: null, totalHours: 0 });
    } else {
      if (date > selectedStartDate) {
        setDateRange({ startDate: selectedStartDate, endDate: date, totalHours: totalHours });
      } else {
        setDateRange({ startDate: date, endDate: selectedStartDate, totalHours: totalHours });
      }
    }
  };

  const applySelection = () => {
    if (selectedStartDate && selectedEndDate) {
      const { hours } = calculateWorkHours(selectedStartDate, selectedEndDate, selectedDays, dailyHours);
      
      setDateRange({ startDate: selectedStartDate, endDate: selectedEndDate, totalHours: hours });

      if (setDados) {
        setDados(prev => ({
          ...prev,
          horasTrabalhadasMes: hours,
          selectedDays,
          hoursPerDay: dailyHours,
          tempoExecucao: hours
        }));
      }
      
      setIsOpen(false);
    }
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedStartDate) return false;
    if (!selectedEndDate) return date.getTime() === selectedStartDate.getTime();
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isStartDate = (date: Date | null) => {
    return date && selectedStartDate && date.getTime() === selectedStartDate.getTime();
  };

  const isEndDate = (date: Date | null) => {
    return date && selectedEndDate && date.getTime() === selectedEndDate.getTime();
  };

  const changeMonth = (months: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + months, 1));
  };

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString('pt-BR') : 'Não selecionada';
  };

  const getWorkingDaysString = () => {
    return selectedDays
      .map((day, index) => day ? ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][index] : null)
      .filter(Boolean)
      .join(', ');
  };

  const toggleWorkDay = (index: number) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[index] = !newSelectedDays[index];
    setSelectedDays(newSelectedDays);
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedStartDate && selectedEndDate ? (
              `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`
            ) : (
              <span>Selecione o período</span>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-[800px] p-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                &lt;
              </button>
              <h3 className="text-lg font-semibold text-purple-600">
                Selecione o período do projeto
              </h3>
              <button 
                onClick={() => changeMonth(1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                &gt;
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-center font-semibold text-gray-600">{day}</span>
                  <Checkbox
                    checked={selectedDays[index]}
                    onCheckedChange={() => toggleWorkDay(index)}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <Label title="Quantas horas você trabalha por dia nos dias selecionados">
                Horas por dia:
              </Label>
              <Input
                type="number"
                min="0"
                max="24"
                value={dailyHours}
                onChange={(e) => updateHours(e.target.value)}
                className="w-20"
                placeholder="Horas"
                title="Insira o número de horas trabalhadas por dia (máximo 24h)"
              />
            </div>
            
            <div className="flex gap-8">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day, index) => (
                    <div key={`header-${index}`} className="text-center font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                  
                  {currentMonthDays.map((week, weekIndex) => (
                    <Fragment key={`week-${weekIndex}`}>
                      {week.map((date, dayIndex) => {
                        const day = date ? date.getDate() : null;
                        const isSelected = date && isDateSelected(date);
                        const isStart = date && isStartDate(date);
                        const isEnd = date && isEndDate(date);
                        
                        return (
                          <div 
                            key={`day-${weekIndex}-${dayIndex}`}
                            onClick={() => date && handleDateClick(date)}
                            className={`
                              text-center py-2 rounded relative
                              ${date ? 'cursor-pointer' : 'text-gray-300'}
                              ${isSelected ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-600'}
                              ${isStart ? 'rounded-l-full bg-purple-600 text-white' : ''}
                              ${isEnd ? 'rounded-r-full bg-purple-600 text-white' : ''}
                            `}
                          >
                            {day || ''}
                          </div>
                        );
                      })}
                    </Fragment>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {nextMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day, index) => (
                    <div key={`next-header-${index}`} className="text-center font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                  
                  {nextMonthDays.map((week, weekIndex) => (
                    <Fragment key={`next-week-${weekIndex}`}>
                      {week.map((date, dayIndex) => {
                        const day = date ? date.getDate() : null;
                        const isSelected = date && isDateSelected(date);
                        const isStart = date && isStartDate(date);
                        const isEnd = date && isEndDate(date);
                        
                        return (
                          <div 
                            key={`next-day-${weekIndex}-${dayIndex}`}
                            onClick={() => date && handleDateClick(date)}
                            className={`
                              text-center py-2 rounded relative
                              ${date ? 'cursor-pointer' : 'text-gray-300'}
                              ${isSelected ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-600'}
                              ${isStart ? 'rounded-l-full bg-purple-600 text-white' : ''}
                              ${isEnd ? 'rounded-r-full bg-purple-600 text-white' : ''}
                            `}
                          >
                            {day || ''}
                          </div>
                        );
                      })}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-medium text-gray-600">Data de início:</h3>
                  <p className="text-gray-800">
                    {formatDate(selectedStartDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-600">Data de término:</h3>
                  <p className="text-gray-800">
                    {formatDate(selectedEndDate)}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-md font-medium text-gray-600">Dias úteis:</h3>
                  <p className="text-gray-800 font-semibold">
                    {workingDaysCount} dias
                  </p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-600">Horas totais:</h3>
                  <p className="font-bold text-purple-600">
                    {totalHours} horas
                  </p>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                Configuração: {getWorkingDaysString()} × {dailyHours}h/dia
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={applySelection}
                disabled={!selectedStartDate || !selectedEndDate}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedStartDate && selectedEndDate && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-gray-700 mb-2">Resumo do Período</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Data inicial:</p>
              <p className="font-medium text-gray-500">{formatDate(selectedStartDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data final:</p>
              <p className="font-medium text-gray-500">{formatDate(selectedEndDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dias trabalhados:</p>
              <p className="font-medium text-gray-500">{workingDaysCount} dias</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de horas:</p>
              <p className="font-bold text-purple-600">{totalHours} horas</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Baseado em: {getWorkingDaysString()} × {dailyHours}h/dia
          </div>
        </div>
      )}
    </div>
  );
};