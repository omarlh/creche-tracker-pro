
import { Table, TableBody } from "@/components/ui/table";
import type { Paiement } from "@/data/paiements";
import type { Enfant } from "@/data/enfants";
import { useState } from "react";
import { PaiementTableHeader } from "./table/PaiementTableHeader";
import { PaiementRow } from "./table/PaiementRow";
import { DateRangeDialog } from "./table/DateRangeDialog";
import { generateHistorique } from "./table/HistoriqueGenerator";

interface PaiementTableauProps {
  paiements: Paiement[];
  enfants: Enfant[];
  onEdit: (paiement: Paiement) => void;
  confirmDeletePaiement: (paiement: Paiement) => void;
}

export const PaiementTableau = ({ paiements, enfants, onEdit, confirmDeletePaiement }: PaiementTableauProps) => {
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [selectedEnfantId, setSelectedEnfantId] = useState<number | null>(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const handlePrintClick = (enfantId: number) => {
    setSelectedEnfantId(enfantId);
    setDateDebut("");
    setDateFin("");
    setDateDialogOpen(true);
  };

  const handleConfirmDates = () => {
    if (selectedEnfantId && dateDebut && dateFin) {
      generateHistorique(selectedEnfantId, dateDebut, dateFin, enfants, paiements);
      setDateDialogOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <Table>
          <PaiementTableHeader />
          <TableBody>
            {paiements.map((paiement) => {
              const enfant = enfants.find(e => e.id === paiement.enfantId);
              return (
                <PaiementRow
                  key={paiement.id}
                  paiement={paiement}
                  enfant={enfant}
                  onEdit={onEdit}
                  confirmDeletePaiement={confirmDeletePaiement}
                  onPrintClick={handlePrintClick}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      <DateRangeDialog 
        open={dateDialogOpen}
        onOpenChange={setDateDialogOpen}
        dateDebut={dateDebut}
        dateFin={dateFin}
        onDateDebutChange={setDateDebut}
        onDateFinChange={setDateFin}
        onConfirm={handleConfirmDates}
      />
    </>
  );
};
