
import { Input } from "@/components/ui/input";
import { type Enfant } from "@/types/enfant.types";

interface PersonalInfoFormProps {
  selectedEnfant: Enfant | null;
}

export const PersonalInfoForm = ({ selectedEnfant }: PersonalInfoFormProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="nom" className="text-sm font-medium">
            Nom
          </label>
          <Input
            id="nom"
            name="nom"
            defaultValue={selectedEnfant?.nom}
            placeholder="Nom de l'enfant"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="prenom" className="text-sm font-medium">
            Prénom
          </label>
          <Input
            id="prenom"
            name="prenom"
            defaultValue={selectedEnfant?.prenom}
            placeholder="Prénom de l'enfant"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="classe" className="text-sm font-medium">
            Classe
          </label>
          <select
            id="classe"
            name="classe"
            defaultValue={selectedEnfant?.classe}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="TPS">TPS</option>
            <option value="PS">PS</option>
            <option value="MS">MS</option>
            <option value="GS">GS</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="dateNaissance" className="text-sm font-medium">
            Date de naissance
          </label>
          <Input
            id="dateNaissance"
            name="dateNaissance"
            type="date"
            defaultValue={selectedEnfant?.dateNaissance}
            required
          />
        </div>
      </div>
    </>
  );
};
