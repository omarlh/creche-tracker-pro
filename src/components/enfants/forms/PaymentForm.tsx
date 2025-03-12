
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Enfant } from "@/types/enfant.types";
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
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const defaultAnneeScolaire = `${currentYear}-${nextYear}`;

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
          defaultValue={selectedEnfant?.fraisInscription?.montantTotal || 800}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="fraisScolariteMensuel" className="text-sm font-medium">
          Frais de scolarité mensuel à payer négocié
        </label>
        <Input
          id="fraisScolariteMensuel"
          name="fraisScolariteMensuel"
          type="number"
          min="0"
          step="0.01"
          defaultValue={selectedEnfant?.fraisScolariteMensuel || 800}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="anneeScolaire" className="text-sm font-medium">
            Année scolaire
          </label>
          <Select 
            name="anneeScolaire" 
            defaultValue={selectedEnfant?.anneeScolaire || defaultAnneeScolaire}
          >
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

      {/* Always show payment fields for new enfants or when showPaiementForm is true */}
      {(!selectedEnfant || showPaiementForm) && (
        <div className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="montantPaiement" className="text-sm font-medium">
                Montant payé des Frais d'inscription & Assurances & Fournitures
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
              <label htmlFor="datePaiement" className="text-sm font-medium">
                Date de paiement
              </label>
              <Input
                id="datePaiement"
                name="datePaiement"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="methodePaiement" className="text-sm font-medium">
              Méthode de paiement
            </label>
            <Select
              name="methodePaiement"
              defaultValue="carte"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carte">Carte bancaire</SelectItem>
                <SelectItem value="especes">Espèces</SelectItem>
                <SelectItem value="cheque">Chèque</SelectItem>
                <SelectItem value="virement">Virement bancaire</SelectItem>
              </SelectContent>
            </Select>
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
