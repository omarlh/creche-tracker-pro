
import { type Enfant } from "@/data/enfants";

interface StatusFormProps {
  selectedEnfant: Enfant | null;
}

export const StatusForm = ({ selectedEnfant }: StatusFormProps) => {
  return (
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
  );
};
