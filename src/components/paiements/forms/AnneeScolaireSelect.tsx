
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const genererAnneesDisponibles = () => {
  const anneesDisponibles = [];
  const currentYear = new Date().getFullYear();
  for (let i = -2; i <= 15; i++) {
    const anneeDebut = currentYear + i;
    const anneeFin = anneeDebut + 1;
    anneesDisponibles.push(`${anneeDebut}-${anneeFin}`);
  }
  return anneesDisponibles;
};

interface AnneeScolaireSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AnneeScolaireSelect({ value, onChange, disabled = false }: AnneeScolaireSelectProps) {
  const anneesDisponibles = genererAnneesDisponibles();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="anneeScolaire">Année scolaire</Label>
      <Select 
        value={value} 
        onValueChange={onChange} 
        disabled={disabled}
      >
        <SelectTrigger id="anneeScolaire" className="w-full">
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
