
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EnfantSelectProps {
  selectedEnfantId: number | null;
  onEnfantChange: (enfantId: number | null) => void;
}

export const EnfantSelect = ({ selectedEnfantId, onEnfantChange }: EnfantSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="enfant">Enfant</Label>
      <Select 
        value={selectedEnfantId?.toString() || ""} 
        onValueChange={(value) => onEnfantChange(value ? parseInt(value) : null)}
      >
        <SelectTrigger id="enfant">
          <SelectValue placeholder="Sélectionner un enfant" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="">Sélectionner un enfant</SelectItem>
          {/* EnfantSelect items will be populated from parent component */}
        </SelectContent>
      </Select>
    </div>
  );
};

