
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EnfantSelectProps {
  selectedEnfantId: number | null;
  onEnfantChange: (enfantId: number | null) => void;
  enfants?: { id: number; prenom: string; nom: string; }[];
}

export const EnfantSelect = ({ selectedEnfantId, onEnfantChange, enfants = [] }: EnfantSelectProps) => {
  console.log("EnfantSelect - enfants:", enfants);
  console.log("EnfantSelect - selectedEnfantId:", selectedEnfantId);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="enfant">Enfant</Label>
      <Select 
        value={selectedEnfantId?.toString() || ""} 
        onValueChange={(value) => {
          console.log("Selected value:", value);
          onEnfantChange(value ? parseInt(value) : null);
        }}
      >
        <SelectTrigger id="enfant">
          <SelectValue placeholder="Sélectionner un enfant" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          <SelectItem value="">Sélectionner un enfant</SelectItem>
          {enfants.length > 0 ? (
            enfants.map((enfant) => (
              <SelectItem key={enfant.id} value={enfant.id.toString()}>
                {enfant.prenom} {enfant.nom}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-data" disabled>
              Aucun enfant trouvé
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {enfants.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun enfant disponible. Veuillez d'abord ajouter des enfants.
        </p>
      )}
    </div>
  );
};
