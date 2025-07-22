'use client';

import { useEffect } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';

interface WorkHoursCalendarProps {
  dados: {
    horasTrabalhadasMes: number;
    selectedDays?: boolean[];
    hoursPerDay?: number;
  };
  setDados: React.Dispatch<
    React.SetStateAction<{
      horasTrabalhadasMes: number;
      selectedDays?: boolean[];
      hoursPerDay?: number;
      [key: string]: any;
    }>
  >;
  startDay?: string;
  daysInMonth?: number;
}

export const WorkHoursCalendar = ({
  dados,
  setDados,
  startDay = 'Tuesday',
  daysInMonth = 30,
}: WorkHoursCalendarProps) => {
  // Weekday names
  const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  // Map start day to index (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
  const startDayIndex = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  }[startDay];

  // Initialize selectedDays and hoursPerDay if not present
  useEffect(() => {
    if (!dados.selectedDays || !Array.isArray(dados.selectedDays) || dados.selectedDays.length !== 7) {
      setDados((prev) => ({
        ...prev,
        selectedDays: Array(7).fill(false),
        hoursPerDay: 8,
        horasTrabalhadasMes: 0,
      }));
    }
  }, [dados, setDados]);

  // Calculate occurrences of each weekday in the month
  const weekdayOccurrences = Array(7).fill(0).map((_, index) => {
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      if ((day - 1 + startDayIndex) % 7 === index) {
        count++;
      }
    }
    return count;
  });

  // Calculate total working days and hours
  const daysPerWeek = dados.selectedDays?.filter((day) => day).length || 0;
  const totalWorkingDays = dados.selectedDays?.reduce(
    (sum, isSelected, index) => sum + (isSelected ? weekdayOccurrences[index] : 0),
    0
  ) || 0;
  const totalHours = totalWorkingDays * (dados.hoursPerDay || 0);

  // Update horasTrabalhadasMes in parent state
  useEffect(() => {
    if (dados.horasTrabalhadasMes !== totalHours) {
      setDados((prev) => ({ ...prev, horasTrabalhadasMes: totalHours }));
    }
  }, [totalHours, dados.horasTrabalhadasMes, setDados]);

  // Toggle a weekday selection
  const toggleDay = (index: number) => {
    setDados((prev) => {
      const newSelectedDays = [...(prev.selectedDays || Array(7).fill(false))];
      newSelectedDays[index] = !newSelectedDays[index];
      return { ...prev, selectedDays: newSelectedDays };
    });
  };

  // Update hours per day
  const updateHours = (value: string) => {
    const hours = Math.max(0, Number(value));
    setDados((prev) => ({ ...prev, hoursPerDay: hours }));
  };

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
                Selecione os dias da semana que você trabalha marcando as caixas correspondentes. Em seguida, insira quantas horas você trabalha por dia. O total de dias trabalhados no mês (baseado em 30 dias) e as horas totais serão calculados automaticamente para determinar o custo por hora dos gastos fixos.
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        <div className="space-y-4">
          {/* Weekday selection */}
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

          {/* Hours per day input */}
          <div className="flex items-center gap-4">
            <Label title="Quantas horas você trabalha por dia nos dias selecionados">
              Horas por dia:
            </Label>
            <Input
              type="number"
              min="0"
              value={dados.hoursPerDay || 8}
              onChange={(e) => updateHours(e.target.value)}
              className="w-20"
              placeholder="Horas"
              title="Insira o número de horas trabalhadas por dia"
            />
          </div>

          {/* Summary */}
          <div className="text-sm text-gray-500">
            Total:{' '}
            <span className="font-semibold">
              {daysPerWeek} dias por semana, {totalWorkingDays} dias no mês, {totalHours}h no total
            </span>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};