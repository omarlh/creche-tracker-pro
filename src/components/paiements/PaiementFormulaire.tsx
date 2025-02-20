
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Paiement } from "@/data/paiements";
import type { Enfant } from "@/data/enfants";
import { EnfantSelect } from "./forms/EnfantSelect";
import { AnneeScolaireSelect } from "./forms/AnneeScolaireSelect";
import { MoisConcerneSelect } from "./forms/MoisConcerneSelect";
import { PaiementDetails } from "./forms/PaiementDetails";

interface PaiementFormulaireProps {
  selectedPaiement: Paiement | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  anneeScolaire: string;
  moisDisponibles: string[];
  defaultMontant: number;
  enfants: Enfant[];
}

export const PaiementFormulaire = ({
  selectedPaiement,
  onSubmit,
  onCancel,
  anneeScolaire,
  moisDisponibles,
  defaultMontant,
  enfants,
}: PaiementFormulaireProps) => {
  const [formData, setFormData] = useState({
    enfantId: selectedPaiement?.enfantId?.toString() || "",
    anneeScolaire: selectedPaiement?.anneeScolaire || anneeScolaire,
    montant: selectedPaiement?.montant || defaultMontant,
    datePaiement: selectedPaiement?.datePaiement || new Date().toISOString().split('T')[0],
    moisConcerne: selectedPaiement?.moisConcerne 
      ? new Date(selectedPaiement.moisConcerne).toLocaleDateString('fr-FR', { month: 'long' }).toLowerCase()
      : "",
    methodePaiement: selectedPaiement?.methodePaiement || "especes",
    commentaire: selectedPaiement?.commentaire || "",
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmPaiement = () => {
    const mois = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    
    const getMoisNumero = (moisNom: string): number => {
      return mois.indexOf(moisNom.toLowerCase()) + 1;
    };

    const annee = formData.anneeScolaire.split('-')[0];
    const moisNum = getMoisNumero(formData.moisConcerne);
    const moisFormate = moisNum < 10 ? `0${moisNum}` : `${moisNum}`;
    
    // Ajuster l'année en fonction du mois scolaire
    const anneeFinale = moisNum >= 9 ? annee : String(parseInt(annee) + 1);
    const moisConcerneFinal = `${anneeFinale}-${moisFormate}-01`;

    const data = {
      ...formData,
      moisConcerne: moisConcerneFinal,
      statut: "complete"
    };
    
    setShowConfirmDialog(false);
    onSubmit(data);
  };

  const selectStyle = "bg-yellow-500 text-black hover:bg-yellow-600";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <EnfantSelect
            value={formData.enfantId}
            onChange={(value) => setFormData({ ...formData, enfantId: value })}
            enfants={enfants}
            selectStyle={selectStyle}
          />

          <AnneeScolaireSelect
            value={formData.anneeScolaire}
            onChange={(value) => setFormData({ ...formData, anneeScolaire: value })}
          />

          <MoisConcerneSelect
            moisValue={formData.moisConcerne}
            onMoisChange={(value) => setFormData({ ...formData, moisConcerne: value })}
            selectStyle={selectStyle}
          />

          <PaiementDetails
            montant={formData.montant}
            datePaiement={formData.datePaiement}
            methodePaiement={formData.methodePaiement}
            commentaire={formData.commentaire}
            onMontantChange={(value) => setFormData({ ...formData, montant: value })}
            onDatePaiementChange={(value) => setFormData({ ...formData, datePaiement: value })}
            onMethodePaiementChange={(value) => setFormData({ ...formData, methodePaiement: value })}
            onCommentaireChange={(value) => setFormData({ ...formData, commentaire: value })}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Annuler
          </Button>
          <Button type="submit">
            {selectedPaiement ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </form>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation du paiement</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <strong>Mois concerné:</strong> {formData.moisConcerne}
            </div>
            <div>
              <strong>Année scolaire:</strong> {formData.anneeScolaire}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmPaiement}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
