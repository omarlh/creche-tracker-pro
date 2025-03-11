
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw, Calendar } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  onReset: () => void;
  isLoading: boolean;
  selectedAnneeScolaire: string;
  onAnneeScolaireChange: (value: string) => void;
}

export function DateRangeFilter({
  onReset,
  isLoading,
  selectedAnneeScolaire,
  onAnneeScolaireChange
}: DateRangeFilterProps) {
  const genererAnnesScolaires = () => {
    const anneesDisponibles = [];
    const currentYear = new Date().getFullYear();
    
    // Generate years from current year - 5 to current year + 5
    for (let i = -5; i <= 5; i++) {
      const anneeDebut = currentYear + i;
      const anneeFin = anneeDebut + 1;
      anneesDisponibles.push(`${anneeDebut}-${anneeFin}`);
    }
    
    // Also include slash format for compatibility
    const slashFormats = [];
    for (let i = -5; i <= 5; i++) {
      const anneeDebut = currentYear + i;
      const anneeFin = anneeDebut + 1;
      slashFormats.push(`${anneeDebut}/${anneeFin}`);
    }
    
    // Combine and remove duplicates
    return [...new Set([...anneesDisponibles, ...slashFormats])];
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="flex-1 max-w-xs">
        <Label className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4" />
          Année scolaire
        </Label>
        <Select value={selectedAnneeScolaire} onValueChange={onAnneeScolaireChange}>
          <SelectTrigger className="bg-white dark:bg-slate-950">
            <SelectValue placeholder="Sélectionner une année scolaire" />
          </SelectTrigger>
          <SelectContent>
            {genererAnnesScolaires().map((annee) => (
              <SelectItem key={annee} value={annee}>
                {annee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={onReset}
        disabled={isLoading}
        className="h-10 bg-white dark:bg-slate-950 mt-8"
        title="Réinitialiser les filtres"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
