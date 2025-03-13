
import { useToast } from "@/components/ui/use-toast";
import { usePaiementStore, type Paiement } from "@/data/paiements";

export const usePaiementActions = (
  setSelectedPaiement: (paiement: Paiement | null) => void,
  setIsSheetOpen: (isOpen: boolean) => void,
  setSearchTerm: (term: string) => void,
  setSelectedEnfant: (enfantId: string) => void,
  setSelectedMois: (mois: string) => void,
  setPaiementToDelete: (paiement: Paiement | null) => void,
  setDeletePassword: (password: string) => void,
  setIsPasswordError: (isError: boolean) => void
) => {
  const { toast } = useToast();
  const { ajouterPaiement, modifierPaiement, supprimerPaiement, fetchPaiements } = usePaiementStore();
  
  const handleAddClick = () => {
    setSelectedPaiement(null);
    setIsSheetOpen(true);
  };

  const handleEditClick = (paiement: Paiement) => {
    setSelectedPaiement(paiement);
    setIsSheetOpen(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleEnfantFilter = (enfantId: string) => {
    setSelectedEnfant(enfantId);
  };

  const handleMoisFilter = (mois: string) => {
    setSelectedMois(mois);
  };

  const confirmDeletePaiement = (paiement: Paiement) => {
    setPaiementToDelete(paiement);
  };

  const cancelDeletePaiement = () => {
    setPaiementToDelete(null);
    setDeletePassword("");
    setIsPasswordError(false);
  };

  const handleDeletePaiement = async (deletePassword: string, paiementToDelete: Paiement | null) => {
    if (deletePassword === "delete") {
      if (paiementToDelete) {
        await supprimerPaiement(paiementToDelete.id);
        toast({
          title: "Suppression réussie",
          description: "Le paiement a été supprimé avec succès.",
        });
      }
      cancelDeletePaiement();
    } else {
      setIsPasswordError(true);
    }
  };

  return {
    handleAddClick,
    handleEditClick,
    handleSearch,
    handleEnfantFilter,
    handleMoisFilter,
    confirmDeletePaiement,
    cancelDeletePaiement,
    handleDeletePaiement,
    fetchPaiements
  };
};
