
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    moisConcerne: selectedPaiement?.moisConcerne?.split('-')[1] || "",
    anneeConcerne: selectedPaiement?.moisConcerne?.split('-')[0] || "",
    methodePaiement: selectedPaiement?.methodePaiement || "especes",
    statut: selectedPaiement?.statut || "en_attente",
    typePaiement: selectedPaiement?.typePaiement || "mensualite",
    commentaire: selectedPaiement?.commentaire || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      moisConcerne: `${formData.anneeConcerne}-${formData.moisConcerne}`
    };
    
    onSubmit(data);
  };

  const getMoisNumero = (mois: string): string => {
    const moisList = [
      "septembre", "octobre", "novembre", "décembre",
      "janvier", "février", "mars", "avril", "mai", "juin"
    ];
    const index = moisList.indexOf(mois.toLowerCase());
    return String(index < 4 ? index + 9 : index - 3 + 1).padStart(2, '0');
  };

  const handleMoisChange = (selectedMois: string) => {
    setFormData({
      ...formData,
      moisConcerne: getMoisNumero(selectedMois)
    });
  };

  const selectStyle = "bg-yellow-500 text-black hover:bg-yellow-600";

  return (
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
          anneeValue={formData.anneeConcerne}
          onMoisChange={handleMoisChange}
          onAnneeChange={(value) => setFormData({ ...formData, anneeConcerne: value })}
          anneeScolaire={formData.anneeScolaire}
          selectStyle={selectStyle}
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
