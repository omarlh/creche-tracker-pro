
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface MoisConcerneSelectProps {
  moisValue: string;
  anneeValue: string;
  onMoisChange: (value: string) => void;
  onAnneeChange: (value: string) => void;
  anneeScolaire: string;
  selectStyle: string;
}

export const MoisConcerneSelect = ({ 
  moisValue, 
  anneeValue,
  onMoisChange, 
  onAnneeChange,
  anneeScolaire,
  selectStyle 
}: MoisConcerneSelectProps) => {
  const mois = [
    "Septembre", "Octobre", "Novembre", "Décembre",
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
  ];

  const getMoisIndex = (moisNom: string): number => {
    const moisIndex = mois.findIndex(m => m.toLowerCase() === moisNom.toLowerCase());
    return moisIndex < 4 ? moisIndex + 9 : moisIndex - 3;
  };

  const getAnneesFromAnneeScolaire = (anneeScolaire: string) => {
    const [debut, fin] = anneeScolaire.split('-');
    return [debut, fin];
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="moisConcerne">Mois concerné</Label>
        <Select value={moisValue} onValueChange={onMoisChange}>
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

      <div>
        <Label htmlFor="anneeConcerne">Année concernée</Label>
        <Select value={anneeValue} onValueChange={onAnneeChange}>
          <SelectTrigger id="anneeConcerne" className={selectStyle}>
            <SelectValue placeholder="Sélectionner l'année" />
          </SelectTrigger>
          <SelectContent>
            {getAnneesFromAnneeScolaire(anneeScolaire).map((annee) => (
              <SelectItem key={annee} value={annee}>
                {annee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
