
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePaiementStore, type Paiement } from "@/data/paiements";
import { useEnfantStore } from "@/data/enfants";
import { getCurrentSchoolYear, getMoisAnneeScolaire } from "@/lib/dateUtils";

export const usePaiementManager = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [anneeScolaire, setAnneeScolaire] = useState(getCurrentSchoolYear());
  const [deletePassword, setDeletePassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [paiementToDelete, setPaiementToDelete] = useState<Paiement | null>(null);
  const [moisDisponibles, setMoisDisponibles] = useState(getMoisAnneeScolaire(anneeScolaire));
  const [defaultMontant] = useState<number>(800);

  const { toast } = useToast();
  const { paiements, ajouterPaiement, modifierPaiement, supprimerPaiement, fetchPaiements } = usePaiementStore();
  const { enfants, fetchEnfants } = useEnfantStore();

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

  const handleSubmit = (data: any) => {
    const { enfantId, anneeScolaire, mois, montant, datePaiement, methodePaiement, commentaire, moisConcerne, statut } = data;

    const nouveauPaiement = {
      enfantId: parseInt(enfantId),
      anneeScolaire,
      mois,
      montant: parseFloat(montant),
      datePaiement,
      methodePaiement,
      commentaire,
      moisConcerne,
      statut
    };

    if (selectedPaiement) {
      const paiementModifie = {
        ...nouveauPaiement,
        id: selectedPaiement.id,
      };
      modifierPaiement(paiementModifie);
      toast({
        title: "Modification réussie",
        description: `Le paiement a été mis à jour.`,
      });
    } else {
      ajouterPaiement(nouveauPaiement);
      toast({
        title: "Ajout réussi",
        description: `Le paiement a été ajouté à la liste.`,
      });
    }

    setIsSheetOpen(false);
  };

  const confirmDeletePaiement = (paiement: Paiement) => {
    setPaiementToDelete(paiement);
  };

  const cancelDeletePaiement = () => {
    setPaiementToDelete(null);
    setDeletePassword("");
    setIsPasswordError(false);
  };

  const handleDeletePaiement = async () => {
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

  const filteredPaiements = paiements.filter(paiement => {
    const enfant = enfants.find(e => e.id === paiement.enfantId);
    const nomComplet = enfant ? `${enfant.prenom} ${enfant.nom}`.toLowerCase() : '';
    return nomComplet.includes(searchTerm.toLowerCase());
  });

  return {
    isSheetOpen,
    setIsSheetOpen,
    selectedPaiement,
    searchTerm,
    isSearchFocused,
    setIsSearchFocused,
    anneeScolaire,
    deletePassword,
    isPasswordError,
    paiementToDelete,
    moisDisponibles,
    defaultMontant,
    enfants,
    filteredPaiements,
    handleAddClick,
    handleEditClick,
    handleSearch,
    handleSubmit,
    confirmDeletePaiement,
    cancelDeletePaiement,
    handleDeletePaiement,
    setDeletePassword,
    fetchPaiements,
    fetchEnfants,
  };
};
