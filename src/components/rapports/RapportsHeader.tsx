
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RapportsHeaderProps {
  anneeScolaireSelectionnee: string;
  moisSelectionne: string;
  onAnneeChange: (annee: string) => void;
  onMoisChange: (mois: string) => void;
  onExport: () => void;
}

export const anneesDisponibles = [
  "2023/2024", "2024/2025", "2025/2026", "2026/2027",
  "2027/2028", "2028/2029", "2029/2030", "2030/2031",
  "2031/2032", "2032/2033"
];

export const moisDisponibles = [
  "Tous les mois", "Septembre", "Octobre", "Novembre",
  "Décembre", "Janvier", "Février", "Mars", "Avril",
  "Mai", "Juin"
];

export const RapportsHeader: React.FC<RapportsHeaderProps> = ({
  anneeScolaireSelectionnee,
  moisSelectionne,
  onAnneeChange,
  onMoisChange,
  onExport
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Rapports Mensuels</h2>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Rapports Mensuels</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select 
              value={anneeScolaireSelectionnee}
              onValueChange={onAnneeChange}
            >
              <SelectTrigger className="w-[200px] bg-gray-200 border-0">
                <SelectValue placeholder="Année scolaire" />
              </SelectTrigger>
              <SelectContent className="bg-gray-100">
                <SelectGroup>
                  <SelectLabel>Sélectionner une année scolaire</SelectLabel>
                  {anneesDisponibles.map(annee => (
                    <SelectItem key={annee} value={annee}>
                      Année scolaire {annee}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select 
              value={moisSelectionne}
              onValueChange={onMoisChange}
            >
              <SelectTrigger className="w-[200px] bg-gray-200 border-0">
                <SelectValue placeholder="Sélectionner un mois" />
              </SelectTrigger>
              <SelectContent className="bg-gray-100">
                <SelectGroup>
                  <SelectLabel>Sélectionner un mois</SelectLabel>
                  {moisDisponibles.map(mois => (
                    <SelectItem key={mois} value={mois}>
                      {mois}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>
    </div>
  );
};
