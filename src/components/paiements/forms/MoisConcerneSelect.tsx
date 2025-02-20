
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface MoisConcerneSelectProps {
  moisValue: string;
  onMoisChange: (value: string) => void;
  selectStyle: string;
}

export const MoisConcerneSelect = ({ 
  moisValue, 
  onMoisChange,
  selectStyle 
}: MoisConcerneSelectProps) => {
  const mois = [
    "Septembre", "Octobre", "Novembre", "Décembre",
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
  ];

  return (
    <div>
      <Label htmlFor="moisConcerne">Mois concerné</Label>
      <Select value={moisValue} onValueChange={onMoisChange}>
        <SelectTrigger id="moisConcerne" className="bg-gray-200 text-black">
          <SelectValue placeholder="Sélectionner le mois" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {mois.map((mois) => (
            <SelectItem key={mois} value={mois.toLowerCase()}>
              {mois}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
