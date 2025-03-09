
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface RapportsHeaderProps {
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (date: string) => void;
  onDateFinChange: (date: string) => void;
  onExport: () => void;
  titre: string;
}

export function RapportsHeader({ 
  dateDebut, 
  dateFin, 
  onDateDebutChange, 
  onDateFinChange,
  onExport,
  titre
}: RapportsHeaderProps) {
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      onDateDebutChange(date.toISOString().split('T')[0]);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      onDateFinChange(date.toISOString().split('T')[0]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{titre}</h2>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">{titre}</h1>
          <Button onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date début</label>
            <DatePicker 
              date={dateDebut ? new Date(dateDebut) : undefined} 
              onDateChange={handleStartDateChange}
              className="bg-white dark:bg-slate-950"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date fin</label>
            <DatePicker 
              date={dateFin ? new Date(dateFin) : undefined} 
              onDateChange={handleEndDateChange}
              className="bg-white dark:bg-slate-950"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
