
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Enfant } from "@/data/enfants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentFormProps {
  selectedEnfant: Enfant | null;
  showPaiementForm: boolean;
  setShowPaiementForm: (show: boolean) => void;
  anneesDisponibles: string[];
}

export const PaymentForm = ({ 
  selectedEnfant, 
  showPaiementForm, 
  setShowPaiementForm,
  anneesDisponibles
}: PaymentFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="montantTotal" className="text-sm font-medium">
          Frais d'inscription & Assurance & Fournitures à payer sur une ou plusieurs fois
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="anneeScolaire" className="text-sm font-medium">
            Année scolaire
          </label>
          <Select name="anneeScolaire" defaultValue="2023-2024">
            <SelectTrigger className="bg-gray-100">
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent className="bg-gray-100">
              {anneesDisponibles.map((annee) => (
                <SelectItem key={annee} value={annee} className="hover:bg-gray-200">
                  {annee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="dateInscription" className="text-sm font-medium">
            Date d'inscription
          </label>
          <Input
            id="dateInscription"
            name="dateInscription"
            type="date"
            defaultValue={selectedEnfant?.dateInscription || new Date().toISOString().split('T')[0]}
            required
          />
        </div>
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
  );
};
