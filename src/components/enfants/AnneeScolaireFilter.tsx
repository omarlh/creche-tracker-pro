
import { Calendar } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AnneeScolaireFilterProps {
  selectedAnneeScolaire: string;
  onAnneeScolaireChange: (value: string) => void;
  anneesScolaires: string[];
}

export const AnneeScolaireFilter = ({
  selectedAnneeScolaire,
  onAnneeScolaireChange,
  anneesScolaires,
}: AnneeScolaireFilterProps) => {
  return (
    <div className="flex-1 max-w-xs">
      <Label className="flex items-center gap-2 mb-2">
        <Calendar className="h-4 w-4" />
        Année scolaire
      </Label>
      <Select value={selectedAnneeScolaire} onValueChange={onAnneeScolaireChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une année scolaire" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les années</SelectItem>
          {anneesScolaires.map((annee) => (
            <SelectItem key={annee} value={annee}>
              {annee}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
