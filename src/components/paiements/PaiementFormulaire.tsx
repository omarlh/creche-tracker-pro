
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnfantSelect } from "./forms/EnfantSelect";
import { MoisConcerneSelect } from "./forms/MoisConcerneSelect";
import { PaiementDetails } from "./forms/PaiementDetails";
import type { Paiement } from "@/data/paiements";
import type { Enfant } from "@/types/enfant.types";

interface PaiementFormulaireProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  selectedEnfantId: number | null;
  onEnfantChange: (enfantId: number | null) => void;
  montant: number;
  onMontantChange: (montant: number) => void;
  datePaiement: string;
  onDatePaiementChange: (date: string) => void;
  moisConcerne: string;
  onMoisConcerneChange: (mois: string) => void;
  methodePaiement: "carte" | "especes" | "cheque";
  onMethodePaiementChange: (methode: "carte" | "especes" | "cheque") => void;
  commentaire: string;
  onCommentaireChange: (commentaire: string) => void;
  anneeScolaire: string;
  onAnneeScolaireChange: (annee: string) => void;
  selectedPaiement: Paiement | null;
  defaultMontant: number;
  enfants: Enfant[];
  onCancel: () => void;
}

export function PaiementFormulaire({
  open,
  onOpenChange,
  onSubmit,
  selectedEnfantId,
  onEnfantChange,
  montant,
  onMontantChange,
  datePaiement,
  onDatePaiementChange,
  moisConcerne,
  onMoisConcerneChange,
  methodePaiement,
  onMethodePaiementChange,
  commentaire,
  onCommentaireChange,
  anneeScolaire,
  onAnneeScolaireChange,
  selectedPaiement,
  defaultMontant,
  enfants,
  onCancel,
}: PaiementFormulaireProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedPaiement ? "Modifier un paiement" : "Nouveau paiement"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            enfantId: selectedEnfantId,
            montant,
            datePaiement,
            methodePaiement,
            commentaire,
            moisConcerne,
            anneeScolaire,
            statut: "complete"
          });
        }} className="space-y-4">
          <EnfantSelect
            selectedEnfantId={selectedEnfantId}
            onEnfantChange={onEnfantChange}
            enfants={enfants}
          />
          <MoisConcerneSelect
            moisConcerne={moisConcerne}
            onMoisConcerneChange={onMoisConcerneChange}
          />
          <PaiementDetails
            montant={montant}
            datePaiement={datePaiement}
            methodePaiement={methodePaiement}
            commentaire={commentaire}
            onMontantChange={onMontantChange}
            onDatePaiementChange={onDatePaiementChange}
            onMethodePaiementChange={onMethodePaiementChange}
            onCommentaireChange={onCommentaireChange}
          />
          <div className="pt-4 space-x-2 flex justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
