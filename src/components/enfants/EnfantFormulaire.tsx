
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Enfant, type PaiementFraisInscription } from "@/data/enfants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnfantFormulaireProps {
  selectedEnfant: Enfant | null;
  showPaiementForm: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  setShowPaiementForm: (show: boolean) => void;
}

const anneesDisponibles = [
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
];

export const EnfantFormulaire = ({
  selectedEnfant,
  showPaiementForm,
  onSubmit,
  onCancel,
  setShowPaiementForm,
}: EnfantFormulaireProps) => {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="gsmMaman" className="text-sm font-medium">
            GSM Maman
          </label>
          <Input
            id="gsmMaman"
            name="gsmMaman"
            type="tel"
            defaultValue={selectedEnfant?.gsmMaman}
            placeholder="Numéro de téléphone"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="gsmPapa" className="text-sm font-medium">
            GSM Papa
          </label>
          <Input
            id="gsmPapa"
            name="gsmPapa"
            type="tel"
            defaultValue={selectedEnfant?.gsmPapa}
            placeholder="Numéro de téléphone"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="montantTotal" className="text-sm font-medium">
            Montant total des frais d'inscription
          </label>
          <Input
            id="montantTotal"
            name="montantTotal"
            type="number"
            min="0"
            step="0.01"
            defaultValue={selectedEnfant?.fraisInscription?.montantTotal || 300}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="anneeScolaire" className="text-sm font-medium">
            Année scolaire
          </label>
          <Select name="anneeScolaire" defaultValue="2023-2024">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              {anneesDisponibles.map((annee) => (
                <SelectItem key={annee} value={annee}>
                  {annee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(showPaiementForm || !selectedEnfant) && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <label htmlFor="montantPaiement" className="text-sm font-medium">
                Montant du paiement des Frais d'Inscription & Assurances & Fournitures
              </label>
              <Input
                id="montantPaiement"
                name="montantPaiement"
                type="number"
                min="0"
                step="0.01"
                placeholder="Montant à payer maintenant"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="methodePaiement" className="text-sm font-medium">
                Méthode de paiement
              </label>
              <select
                id="methodePaiement"
                name="methodePaiement"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                defaultValue="carte"
              >
                <option value="carte">Carte bancaire</option>
                <option value="especes">Espèces</option>
                <option value="cheque">Chèque</option>
                <option value="virement">Virement bancaire</option>
              </select>
            </div>
          </div>
        )}

        {selectedEnfant && !showPaiementForm && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPaiementForm(true)}
          >
            Ajouter un paiement
          </Button>
        )}
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

      <div className="pt-4 space-x-2 flex justify-end">
        <Button 
          variant="outline" 
          type="button" 
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};
