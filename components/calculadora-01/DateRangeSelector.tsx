"use client";

import { useState, Fragment, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';

interface DateRangeSelectorProps {
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null, totalHours: number) => void;
  workDays?: boolean[]; // [Seg, Ter, Qua, Qui, Sex, Sáb, Dom]
  hoursPerDay?: number;
}

export const DateRangeSelector = ({ 
  onDateRangeChange,
  workDays = [true, true, true, true, true, false, false], // Padrão: Segunda a Sexta
  hoursPerDay = 8 // Padrão: 8 horas por dia
}: DateRangeSelectorProps) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [totalHours, setTotalHours] = useState(0);
  const [workingDaysCount, setWorkingDaysCount] = useState(0);

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']; // Dias da semana abreviados

  // Gera os dias do mês para exibição no calendário
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

  // Calcula horas trabalhadas quando as datas mudam
  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const { days, hours } = calculateWorkHours(selectedStartDate, selectedEndDate, workDays, hoursPerDay);
      setWorkingDaysCount(days);
      setTotalHours(hours);
      
      // Log detalhado no console
      console.log('📅 Período selecionado:', {
        'Data Início': selectedStartDate.toLocaleDateString('pt-BR'),
        'Data Fim': selectedEndDate.toLocaleDateString('pt-BR'),
        'Dias Úteis': days,
        'Horas Totais': hours,
        'Horas por Dia': hoursPerDay,
        'Dias Trabalhados': workDays
          .map((day, index) => day ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index] : null)
          .filter(Boolean)
          .join(', ')
      });
    } else {
      setWorkingDaysCount(0);
      setTotalHours(0);
    }
  }, [selectedStartDate, selectedEndDate, workDays, hoursPerDay]);

  // Calcula dias úteis e horas totais
  const calculateWorkHours = (start: Date, end: Date, workDays: boolean[], dailyHours: number) => {
    let daysCount = 0;
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);
    
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    
    while (current <= endDate) {
      const dayOfWeek = current.getDay(); // 0=Domingo, 1=Segunda, etc.
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

  const currentMonthDays = generateMonthDays(currentMonth);
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  const nextMonthDays = generateMonthDays(nextMonth);

  // Manipulador de clique nas datas
  const handleDateClick = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      if (date > selectedStartDate) {
        setSelectedEndDate(date);
      } else {
        setSelectedStartDate(date);
        setSelectedEndDate(selectedStartDate);
      }
    }
  };

  // Aplica a seleção e fecha o modal
  const applySelection = () => {
    if (selectedStartDate && selectedEndDate) {
      const { hours } = calculateWorkHours(selectedStartDate, selectedEndDate, workDays, hoursPerDay);
      onDateRangeChange?.(selectedStartDate, selectedEndDate, hours);
      setIsOpen(false);
    }
  };

  // Verifica se uma data está selecionada
  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedStartDate) return false;
    if (!selectedEndDate) return date.getTime() === selectedStartDate.getTime();
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  // Verifica se é a data inicial
  const isStartDate = (date: Date | null) => {
    return date && selectedStartDate && date.getTime() === selectedStartDate.getTime();
  };

  // Verifica se é a data final
  const isEndDate = (date: Date | null) => {
    return date && selectedEndDate && date.getTime() === selectedEndDate.getTime();
  };

  // Muda o mês exibido
  const changeMonth = (months: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + months, 1));
  };

  // Formata a data para o padrão brasileiro
  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString('pt-BR') : 'Não selecionada';
  };

  // Retorna os dias da semana que são trabalhados
  const getWorkingDaysString = () => {
    return workDays
     // .map((day, index) => day ? ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][index] : null)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="space-y-4">
      {/* Botão para abrir o seletor de datas */}
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
        
        {/* Modal do seletor de datas */}
        <DialogContent className="max-w-[800px] p-6">
          <div className="flex flex-col gap-6">
            {/* Cabeçalho com navegação entre meses */}
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
            
            {/* Calendários - Mês atual e próximo mês */}
            <div className="flex gap-8">
              {/* Mês atual */}
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
                              ${isSelected ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-500'}
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
              
              {/* Próximo mês */}
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
                              ${isSelected ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-500'}
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
            
            {/* Resumo da seleção */}
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
                  <p className="text-purple-600 font-bold">
                    {totalHours} horas
                  </p>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                Configuração: {getWorkingDaysString()} × {hoursPerDay}h/dia
              </div>
            </div>
            
            {/* Botões de ação */}
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

      {/* Resumo exibido fora do modal */}
      {selectedStartDate && selectedEndDate && (
        <div className="bg-purble-50 p-4 rounded-lg border border-purble-200">
          <h3 className="font-medium text-gray-700 mb-2">Resumo do Período</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Data inicial:</p>
              <p className="font-medium text-gray-500">{formatDate(selectedStartDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data final:</p>
              <p className="font-medium  text-gray-500">{formatDate(selectedEndDate)}</p>
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
            Baseado em: {getWorkingDaysString()} × {hoursPerDay}h/dia
          </div>
        </div>
      )}
    </div>
  );
};