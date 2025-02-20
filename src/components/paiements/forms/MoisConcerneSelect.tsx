
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface MoisConcerneSelectProps {
  value: string;
  onChange: (value: string) => void;
  selectStyle: string;
}

export const MoisConcerneSelect = ({ value, onChange, selectStyle }: MoisConcerneSelectProps) => {
  const mois = [
    "Septembre", "Octobre", "Novembre", "Décembre",
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
  ];

  return (
    <div>
      <Label htmlFor="moisConcerne">Mois concerné</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="moisConcerne" className={selectStyle}>
          <SelectValue placeholder="Sélectionner le mois" />
        </SelectTrigger>
        <SelectContent>
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
