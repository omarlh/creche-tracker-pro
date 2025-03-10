
import { useState } from "react";
import { Table } from "@/components/ui/table";
import type { Enfant } from "@/types/enfant.types";
import { DateRangeDialog } from "./DateRangeDialog";
import { TableauCroiseHeader } from "./TableauCroiseHeader";
import { TableauCroiseTableContent } from "./TableauCroiseTableContent";
import { TableauCroiseTableHeader } from "./TableauCroiseTableHeader";
import { printEnfantHistorique } from "./PrintHistorique";

interface TableauCroiseTableProps {
  enfants: Enfant[];
  selectedAnneeScolaire: string;
  selectedClasse: string;
  searchTerm: string;
  moisScolaires: string[];
  getPaiementMensuel: (enfantId: number, mois: string) => any;
  getMontantInscription: (enfantId: number) => { montantTotal: number; montantPaye: number };
}

export function TableauCroiseTable({
  enfants,
  selectedAnneeScolaire,
  selectedClasse,
  searchTerm,
  moisScolaires,
  getPaiementMensuel,
  getMontantInscription,
}: TableauCroiseTableProps) {
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [selectedEnfantId, setSelectedEnfantId] = useState<number | null>(null);

  const filteredEnfants = enfants
    .filter(e => selectedAnneeScolaire === "all" || e.anneeScolaire === selectedAnneeScolaire)
    .filter(e => selectedClasse === "all" || e.classe === selectedClasse)
    .filter(e => {
      const fullName = `${e.prenom} ${e.nom}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });

  const handleHistoriqueClick = (enfantId: number) => {
    setSelectedEnfantId(enfantId);
    setDateDialogOpen(true);
  };

  const handleConfirmSchoolYear = (anneeScolaire: string) => {
    if (selectedEnfantId) {
      // Generate start and end dates based on school year
      const [yearStart, yearEnd] = anneeScolaire.split('-');
      const dateDebut = `${yearStart}-09-01`; // September 1st of start year
      const dateFin = `${yearEnd}-06-30`;    // June 30th of end year
      
      printEnfantHistorique(
        selectedEnfantId, 
        dateDebut, 
        dateFin, 
        enfants, 
        getMontantInscription
      );
    }
  };

  return (
    <>
      <Table>
        <TableauCroiseTableHeader moisScolaires={moisScolaires} />
        <TableauCroiseTableContent
          filteredEnfants={filteredEnfants}
          moisScolaires={moisScolaires}
          getPaiementMensuel={getPaiementMensuel}
          getMontantInscription={getMontantInscription}
          onHistoriqueClick={handleHistoriqueClick}
        />
      </Table>

      <DateRangeDialog 
        open={dateDialogOpen}
        onOpenChange={setDateDialogOpen}
        onConfirm={handleConfirmSchoolYear}
      />
    </>
  );
}
