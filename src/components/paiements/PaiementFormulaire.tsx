
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Paiement } from "@/data/paiements";
import type { Enfant } from "@/data/enfants";
import { EnfantSelect } from "./forms/EnfantSelect";
import { AnneeScolaireSelect } from "./forms/AnneeScolaireSelect";
import { MoisConcerneSelect } from "./forms/MoisConcerneSelect";
import { PaiementDetails } from "./forms/PaiementDetails";
import { getFormattedMoisConcerne } from "./utils/dateUtils";

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
    moisConcerne: selectedPaiement?.moisConcerne || new Date().toISOString().slice(0, 7),
    methodePaiement: selectedPaiement?.methodePaiement || "especes",
    statut: selectedPaiement?.statut || "en_attente",
    typePaiement: selectedPaiement?.typePaiement || "mensualite",
    commentaire: selectedPaiement?.commentaire || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mois = [
      "Septembre", "Octobre", "Novembre", "Décembre",
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
    ];
    
    const data = {
      ...formData,
      moisConcerne: getFormattedMoisConcerne(formData.anneeScolaire, formData.moisConcerne, mois)
    };
    
    onSubmit(data);
  };

  const handleMoisChange = (selectedMois: string) => {
    setFormData({ ...formData, moisConcerne: selectedMois });
  };

  const selectTriggerStyle = "bg-[#8E9196] text-white hover:bg-[#8E9196]/90";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <EnfantSelect
          value={formData.enfantId}
          onChange={(value) => setFormData({ ...formData, enfantId: value })}
          enfants={enfants}
          selectStyle={selectTriggerStyle}
        />

        <AnneeScolaireSelect
          value={formData.anneeScolaire}
          onChange={(value) => setFormData({ ...formData, anneeScolaire: value })}
        />

        <MoisConcerneSelect
          value={formData.moisConcerne.split('-')[1]}
          onChange={handleMoisChange}
          selectStyle={selectTriggerStyle}
        />

        <PaiementDetails
          montant={formData.montant}
          datePaiement={formData.datePaiement}
          methodePaiement={formData.methodePaiement}
          typePaiement={formData.typePaiement}
          statut={formData.statut}
          commentaire={formData.commentaire}
          onMontantChange={(value) => setFormData({ ...formData, montant: value })}
          onDatePaiementChange={(value) => setFormData({ ...formData, datePaiement: value })}
          onMethodePaiementChange={(value) => setFormData({ ...formData, methodePaiement: value })}
          onTypePaiementChange={(value) => setFormData({ ...formData, typePaiement: value })}
          onStatutChange={(value) => setFormData({ ...formData, statut: value })}
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
  );
};
