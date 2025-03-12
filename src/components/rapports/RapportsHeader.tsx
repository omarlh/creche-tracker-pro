
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fr } from 'date-fns/locale';
import { parse, isValid, format } from 'date-fns';

// Helper function to format date for display (YYYY-MM-DD to DD/MM/YYYY)
const formatDisplayDate = (isoDate: string): string => {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    if (!isValid(date)) return '';
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
};

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
  const [startDateInput, setStartDateInput] = useState(formatDisplayDate(dateDebut));
  const [endDateInput, setEndDateInput] = useState(formatDisplayDate(dateFin));

  // Update the input fields when props change
  useEffect(() => {
    setStartDateInput(formatDisplayDate(dateDebut));
    setEndDateInput(formatDisplayDate(dateFin));
  }, [dateDebut, dateFin]);

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

  const handleStartDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setStartDateInput(inputValue);
    
    if (isValidDateFormat(inputValue)) {
      const parsedDate = parseDate(inputValue);
      if (parsedDate) {
        onDateDebutChange(parsedDate.toISOString().split('T')[0]);
      }
    }
  };

  const handleEndDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setEndDateInput(inputValue);
    
    if (isValidDateFormat(inputValue)) {
      const parsedDate = parseDate(inputValue);
      if (parsedDate) {
        onDateFinChange(parsedDate.toISOString().split('T')[0]);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'start' | 'end') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const inputValue = type === 'start' ? startDateInput : endDateInput;
      
      if (isValidDateFormat(inputValue)) {
        const parsedDate = parseDate(inputValue);
        if (parsedDate) {
          if (type === 'start') {
            onDateDebutChange(parsedDate.toISOString().split('T')[0]);
          } else {
            onDateFinChange(parsedDate.toISOString().split('T')[0]);
          }
        }
      }
    }
  };

  // Helper function to validate date format (DD/MM/YYYY)
  const isValidDateFormat = (dateString: string): boolean => {
    if (!dateString) return false;
    
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateString)) return false;
    
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    return isValid(parsedDate);
  };

  // Helper function to parse a date from format DD/MM/YYYY
  const parseDate = (dateString: string): Date | null => {
    try {
      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
    return null;
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
              <Input
                type="text"
                placeholder="JJ/MM/AAAA"
                value={startDateInput}
                onChange={handleStartDateInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'start')}
                className="bg-white dark:bg-slate-950"
              />
              <DatePicker 
                date={dateDebut ? new Date(dateDebut) : undefined} 
                onDateChange={handleStartDateChange}
                placeholder="Sélectionner"
                className="bg-white dark:bg-slate-950"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Date fin</Label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="JJ/MM/AAAA"
                value={endDateInput}
                onChange={handleEndDateInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'end')}
                className="bg-white dark:bg-slate-950"
              />
              <DatePicker 
                date={dateFin ? new Date(dateFin) : undefined} 
                onDateChange={handleEndDateChange}
                placeholder="Sélectionner"
                className="bg-white dark:bg-slate-950"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
