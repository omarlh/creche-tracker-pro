
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw, Calendar, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateRangeFilterProps {
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  onReset: () => void;
  isLoading: boolean;
}

export function DateRangeFilter({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onReset,
  isLoading
}: DateRangeFilterProps) {
  const months = [
    { value: "all", label: "Tous les mois" },
    { value: "01", label: "Janvier" },
    { value: "02", label: "Février" },
    { value: "03", label: "Mars" },
    { value: "04", label: "Avril" },
    { value: "05", label: "Mai" },
    { value: "06", label: "Juin" },
    { value: "07", label: "Juillet" },
    { value: "08", label: "Août" },
    { value: "09", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ];

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [{ value: "all", label: "Toutes les années" }];
    
    // Previous 2 years, current year, and next year
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      years.push({ value: i.toString(), label: i.toString() });
    }
    return years;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Mois</label>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select 
            value={selectedMonth} 
            onValueChange={onMonthChange}
          >
            <SelectTrigger className="w-[150px] bg-white dark:bg-slate-950">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Année</label>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Select 
            value={selectedYear} 
            onValueChange={onYearChange}
          >
            <SelectTrigger className="w-[150px] bg-white dark:bg-slate-950">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {generateYearOptions().map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        variant="outline" 
        size="icon"
        onClick={onReset}
        disabled={isLoading}
        className="mt-auto mb-0.5 h-10 bg-white dark:bg-slate-950"
        title="Réinitialiser les filtres"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
