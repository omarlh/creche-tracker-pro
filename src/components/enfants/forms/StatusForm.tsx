
import { Input } from "@/components/ui/input";
import { type Enfant } from "@/data/enfants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusFormProps {
  selectedEnfant: Enfant | null;
}

export const StatusForm = ({ selectedEnfant }: StatusFormProps) => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const genererAnnesScolaires = () => {
    const anneesDisponibles = [];
    const currentYear = new Date().getFullYear();
    for (let i = -5; i <= 5; i++) {
      const anneeDebut = currentYear + i;
      const anneeFin = anneeDebut + 1;
      anneesDisponibles.push(`${anneeDebut}-${anneeFin}`);
    }
    return anneesDisponibles;
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="dateInscription" className="text-sm font-medium">
            Date d'inscription du
          </label>
          <Input
            id="dateInscription"
            name="dateInscription"
            type="date"
            defaultValue={selectedEnfant?.dateInscription || currentDate}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="dateFinInscription" className="text-sm font-medium">
            Date d'inscription au
          </label>
          <Input
            id="dateFinInscription"
            name="dateFinInscription"
            type="date"
            defaultValue={selectedEnfant?.dateFinInscription || ""}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="statut" className="text-sm font-medium">
            Statut
          </label>
          <select
            id="statut"
            name="statut"
            defaultValue={selectedEnfant?.statut || "actif"}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="anneeScolaire" className="text-sm font-medium">
            Année scolaire
          </label>
          <Select name="anneeScolaire" defaultValue={selectedEnfant?.anneeScolaire || "2024-2025"}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner l'année scolaire" />
            </SelectTrigger>
            <SelectContent>
              {genererAnnesScolaires().map((annee) => (
                <SelectItem key={annee} value={annee}>
                  {annee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
