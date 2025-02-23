
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface MoisConcerneSelectProps {
  moisConcerne: string;
  onMoisConcerneChange: (mois: string) => void;
}

export const MoisConcerneSelect = ({ moisConcerne, onMoisConcerneChange }: MoisConcerneSelectProps) => {
  const mois = [
    "Septembre", "Octobre", "Novembre", "Décembre",
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="moisConcerne">Mois concerné</Label>
      <Select value={moisConcerne} onValueChange={onMoisConcerneChange}>
        <SelectTrigger id="moisConcerne">
          <SelectValue placeholder="Sélectionner le mois" />
        </SelectTrigger>
        <SelectContent>
          {mois.map((mois) => (
            <SelectItem key={mois.toLowerCase()} value={mois.toLowerCase()}>
              {mois}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
