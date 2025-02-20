
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
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
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Rapports Mensuels</h1>
          <Button onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Filtrer par année scolaire</Label>
            <Select 
              value={anneeScolaireSelectionnee}
              onValueChange={onAnneeChange}
            >
              <SelectTrigger className="w-full bg-gray-100">
                <SelectValue placeholder="Sélectionner une année scolaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {anneesDisponibles.map(annee => (
                    <SelectItem key={annee} value={annee}>
                      {annee}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Filtrer par mois</Label>
            <Select 
              value={moisSelectionne}
              onValueChange={onMoisChange}
            >
              <SelectTrigger className="w-full bg-gray-100">
                <SelectValue placeholder="Sélectionner un mois" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {moisDisponibles.map(mois => (
                    <SelectItem key={mois} value={mois}>
                      {mois}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
