
import React, { KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const handleManualStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue && isValidDateFormat(inputValue)) {
      const date = parseDate(inputValue);
      if (date) {
        onDateDebutChange(date.toISOString().split('T')[0]);
      }
    }
  };

  const handleManualEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue && isValidDateFormat(inputValue)) {
      const date = parseDate(inputValue);
      if (date) {
        onDateFinChange(date.toISOString().split('T')[0]);
      }
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>, 
    type: 'start' | 'end'
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const inputValue = event.currentTarget.value;
      
      if (inputValue && isValidDateFormat(inputValue)) {
        const date = parseDate(inputValue);
        if (date) {
          if (type === 'start') {
            onDateDebutChange(date.toISOString().split('T')[0]);
          } else {
            onDateFinChange(date.toISOString().split('T')[0]);
          }
        }
      }
    }
  };

  // Helper function to validate date format (DD/MM/YYYY)
  const isValidDateFormat = (dateString: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    return regex.test(dateString);
  };

  // Helper function to parse a date from format DD/MM/YYYY
  const parseDate = (dateString: string): Date | null => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    
    // Validate that the date is correct (handles invalid dates like 31/02/2023)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }
    
    return date;
  };

  // Format date for display (YYYY-MM-DD to DD/MM/YYYY)
  const formatDisplayDate = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div>
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
            <Label className="text-sm font-medium">Date début</Label>
            <div className="flex items-center gap-2">
              <DatePicker 
                date={dateDebut ? new Date(dateDebut) : undefined} 
                onDateChange={handleStartDateChange}
                placeholder="Date du"
                className="bg-white dark:bg-slate-950 w-1/2"
              />
              <Input
                type="text"
                placeholder="JJ/MM/AAAA"
                value={formatDisplayDate(dateDebut)}
                onChange={handleManualStartDateChange}
                onKeyDown={(e) => handleKeyDown(e, 'start')}
                className="bg-white dark:bg-slate-950 w-1/2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Date fin</Label>
            <div className="flex items-center gap-2">
              <DatePicker 
                date={dateFin ? new Date(dateFin) : undefined} 
                onDateChange={handleEndDateChange}
                placeholder="Date au"
                className="bg-white dark:bg-slate-950 w-1/2"
              />
              <Input
                type="text"
                placeholder="JJ/MM/AAAA"
                value={formatDisplayDate(dateFin)}
                onChange={handleManualEndDateChange}
                onKeyDown={(e) => handleKeyDown(e, 'end')}
                className="bg-white dark:bg-slate-950 w-1/2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
