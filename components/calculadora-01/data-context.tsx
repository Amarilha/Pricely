'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
  totalHours: number;
}

interface DateRangeContextType {
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
    totalHours: 0,
  });

  useEffect(() => {
    const savedDateRange = localStorage.getItem('dateRange');
    if (savedDateRange) {
      const parsedDateRange = JSON.parse(savedDateRange);
      setDateRange({
        startDate: parsedDateRange.startDate ? new Date(parsedDateRange.startDate) : null,
        endDate: parsedDateRange.endDate ? new Date(parsedDateRange.endDate) : null,
        totalHours: parsedDateRange.totalHours,
      });
    }
  }, []);

  const handleSetDateRange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
    localStorage.setItem('dateRange', JSON.stringify(newDateRange));
  };

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange: handleSetDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};
