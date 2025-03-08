
import React from 'react';
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarRange, RotateCcw } from "lucide-react";

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
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4">
      <div className="space-y-2">
        <Label htmlFor="dateDebut">Date début</Label>
        <DatePicker 
          date={dateDebut} 
          onDateChange={onDateDebutChange}
          placeholder="Date du" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateFin">Date fin</Label>
        <DatePicker 
          date={dateFin} 
          onDateChange={onDateFinChange}
          placeholder="Date au" 
        />
      </div>
      <Button 
        variant="outline" 
        size="icon"
        onClick={onResetDates}
        disabled={isLoading}
        className="mb-0.5 h-10"
        title="Réinitialiser les dates"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
