
import React from 'react';
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnfantDateFiltersProps {
  dateDebut: Date | undefined;
  dateFin: Date | undefined;
  onDateDebutChange: (date: Date | undefined) => void;
  onDateFinChange: (date: Date | undefined) => void;
  onResetDates: () => void;
}

export const EnfantDateFilters = ({
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onResetDates
}: EnfantDateFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 mb-4 bg-gray-50 rounded-lg border">
      <div className="flex-1 space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date d'inscription début
        </Label>
        <DatePicker 
          date={dateDebut} 
          onDateChange={onDateDebutChange}
          placeholder="Date de début"
        />
      </div>
      <div className="flex-1 space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date d'inscription fin
        </Label>
        <DatePicker 
          date={dateFin} 
          onDateChange={onDateFinChange}
          placeholder="Date de fin"
        />
      </div>
      <div className="flex items-end">
        <Button 
          variant="outline" 
          onClick={onResetDates}
          className="mb-0.5"
        >
          Réinitialiser les dates
        </Button>
      </div>
    </div>
  );
};
