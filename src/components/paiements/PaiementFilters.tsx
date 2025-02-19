
import { Filter, Calendar, User } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { type Enfant } from "@/data/enfants";

interface PaiementFiltersProps {
  selectedEnfant: string;
  selectedMois: string;
  onEnfantChange: (value: string) => void;
  onMoisChange: (value: string) => void;
  enfants: Enfant[];
  moisDisponibles: string[];
}

export const PaiementFilters = ({
  selectedEnfant,
  selectedMois,
  onEnfantChange,
  onMoisChange,
  enfants,
  moisDisponibles,
}: PaiementFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
      <div className="flex-1">
        <Label className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4" />
          Filtrer par enfant
        </Label>
        <Select value={selectedEnfant} onValueChange={onEnfantChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les enfants" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les enfants</SelectItem>
            {enfants.map((enfant) => (
              <SelectItem key={enfant.id} value={enfant.id.toString()}>
                {enfant.prenom} {enfant.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4" />
          Filtrer par mois
        </Label>
        <Select value={selectedMois} onValueChange={onMoisChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les mois" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les mois</SelectItem>
            {moisDisponibles.map((mois) => (
              <SelectItem key={mois} value={mois.toLowerCase()}>
                {mois}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
