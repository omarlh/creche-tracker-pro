
import { Paiement } from "@/data/paiements";
import { Enfant } from "@/types/enfant.types";

export const usePaiementFilter = () => {
  const filterPaiements = (
    paiements: Paiement[],
    enfants: Enfant[],
    searchTerm: string,
    selectedEnfant: string
  ) => {
    console.log("Filtering paiements:", { paiements, enfants, searchTerm, selectedEnfant });
    
    return paiements.filter(paiement => {
      const enfant = enfants.find(e => e.id === paiement.enfantId);
      const nomComplet = enfant ? `${enfant.prenom} ${enfant.nom}`.toLowerCase() : '';
      
      const matchesSearch = searchTerm === "" || nomComplet.includes(searchTerm.toLowerCase());
      const matchesEnfant = selectedEnfant === "all" ? true : paiement.enfantId === parseInt(selectedEnfant);

      return matchesSearch && matchesEnfant;
    });
  };

  const filterByDateRange = (
    paiements: Paiement[],
    startDate: string,
    endDate: string
  ) => {
    return paiements.filter(paiement => {
      const paiementDate = new Date(paiement.datePaiement);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Ajuster les dates pour ignorer l'heure
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      return paiementDate >= start && paiementDate <= end;
    });
  };

  return {
    filterPaiements,
    filterByDateRange
  };
};
