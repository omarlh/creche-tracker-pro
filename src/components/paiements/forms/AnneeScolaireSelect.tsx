
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const anneesDisponibles = [
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
];

interface AnneeScolaireSelectProps {
  anneeScolaire: string;
  onAnneeScolaireChange: (annee: string) => void;
}

export function AnneeScolaireSelect({ anneeScolaire, onAnneeScolaireChange }: AnneeScolaireSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="anneeScolaire">Année scolaire</Label>
      <Select value={anneeScolaire} onValueChange={onAnneeScolaireChange}>
        <SelectTrigger id="anneeScolaire">
          <SelectValue placeholder="Sélectionner une année scolaire" />
        </SelectTrigger>
        <SelectContent>
          {anneesDisponibles.map((annee) => (
            <SelectItem key={annee} value={annee}>
              {annee}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
