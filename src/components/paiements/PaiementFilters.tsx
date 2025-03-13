
import { Calendar, User } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type Enfant } from "@/data/enfants";
import { useEffect } from "react";

interface PaiementFiltersProps {
  selectedEnfant: string;
  onEnfantChange: (value: string) => void;
  selectedStartDate: string;
  selectedEndDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  enfants: Enfant[];
}

export const PaiementFilters = ({
  selectedEnfant,
  selectedStartDate,
  selectedEndDate,
  onEnfantChange,
  onStartDateChange,
  onEndDateChange,
  enfants,
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
            <SelectValue placeholder="Sélectionner un enfant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les enfants</SelectItem>
            {enfants.map((enfant) => (
              <SelectItem key={enfant.id} value={enfant.id.toString()}>
                {enfant.prenom} {enfant.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date de début
        </Label>
        <Input
          type="date"
          value={selectedStartDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex-1 space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date de fin
        </Label>
        <Input
          type="date"
          value={selectedEndDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};
