
import React from 'react';
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface DateRangeFilterProps {
  dateDebut: Date | undefined;
  dateFin: Date | undefined;
  onDateDebutChange: (date: Date | undefined) => void;
  onDateFinChange: (date: Date | undefined) => void;
  onResetDates: () => void;
  isLoading: boolean;
}

export function DateRangeFilter({
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onResetDates,
  isLoading
}: DateRangeFilterProps) {
  const handleStartDateChange = (date: Date | undefined) => {
    onDateDebutChange(date);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    onDateFinChange(date);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Date début</label>
        <DatePicker 
          date={dateDebut} 
          onDateChange={handleStartDateChange}
          placeholder="Date du" 
          className="bg-white dark:bg-slate-950"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Date fin</label>
        <DatePicker 
          date={dateFin} 
          onDateChange={handleEndDateChange}
          placeholder="Date au" 
          className="bg-white dark:bg-slate-950"
        />
      </div>
      <Button 
        variant="outline" 
        size="icon"
        onClick={onResetDates}
        disabled={isLoading}
        className="mt-auto mb-0.5 h-10 bg-white dark:bg-slate-950"
        title="Réinitialiser les dates"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
