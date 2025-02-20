
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AnneeScolaireSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const AnneeScolaireSelect = ({ value, onChange }: AnneeScolaireSelectProps) => {
  const genererAnnesScolaires = () => {
    const anneesDisponibles = [];
    const currentYear = new Date().getFullYear();
    for (let i = -5; i <= 5; i++) {
      const anneeDebut = currentYear + i;
      const anneeFin = anneeDebut + 1;
      anneesDisponibles.push(`${anneeDebut}-${anneeFin}`);
    }
    return anneesDisponibles;
  };

  return (
    <div>
      <Label htmlFor="anneeScolaire">Année scolaire</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="anneeScolaire">
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
  );
};
