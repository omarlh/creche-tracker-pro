
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Enfant } from "@/data/enfants";

interface EnfantSelectProps {
  value: string;
  onChange: (value: string) => void;
  enfants: Enfant[];
  selectStyle: string;
}

export const EnfantSelect = ({ value, onChange, enfants, selectStyle }: EnfantSelectProps) => {
  return (
    <div>
      <Label htmlFor="enfant">Enfant</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="enfant" className="bg-gray-200 text-black">
          <SelectValue placeholder="Sélectionner un enfant" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {enfants.map((enfant) => (
            <SelectItem key={enfant.id} value={enfant.id.toString()}>
              {enfant.prenom} {enfant.nom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
