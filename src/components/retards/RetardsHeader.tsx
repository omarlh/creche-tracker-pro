
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RetardsHeaderProps {
  selectedAnnee: string;
  setSelectedAnnee: (annee: string) => void;
  handlePrint: () => void;
}

const anneesDisponibles = [
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
];

export const RetardsHeader = ({ selectedAnnee, setSelectedAnnee, handlePrint }: RetardsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Gestion des Retards de Paiement</h1>
        <div className="w-[200px]">
          <Select
            value={selectedAnnee}
            onValueChange={setSelectedAnnee}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              {anneesDisponibles.map((annee) => (
                <SelectItem key={annee} value={annee}>
                  Année {annee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={handlePrint}
        variant="outline"
        className="print:hidden"
      >
        <Printer className="mr-2 h-4 w-4" />
        Imprimer
      </Button>
    </div>
  );
};
