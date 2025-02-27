
import { Input } from "@/components/ui/input";
import { type Enfant } from "@/data/enfants";

interface StatusFormProps {
  selectedEnfant: Enfant | null;
}

export const StatusForm = ({ selectedEnfant }: StatusFormProps) => {
  const currentDate = new Date().toISOString().split('T')[0];
  
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
    </div>
  );
};
