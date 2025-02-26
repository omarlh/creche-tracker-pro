
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EnfantSelectProps {
  selectedEnfantId: number | null;
  onEnfantChange: (enfantId: number | null) => void;
  enfants?: { id: number; prenom: string; nom: string; }[];
}

export const EnfantSelect = ({ selectedEnfantId, onEnfantChange, enfants = [] }: EnfantSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="enfant">Enfant</Label>
      <Select 
        value={selectedEnfantId?.toString() || undefined} 
        onValueChange={(value) => onEnfantChange(value ? parseInt(value) : null)}
      >
        <SelectTrigger id="enfant">
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

