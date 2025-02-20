
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
  const [selectedEnfant, setSelectedEnfant] = useState("all");
  const [selectedMois, setSelectedMois] = useState("all");

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

  const handleEnfantFilter = (enfantId: string) => {
    setSelectedEnfant(enfantId);
  };

  const handleMoisFilter = (mois: string) => {
    setSelectedMois(mois);
  };

  const handleSubmit = (data: any) => {
    const { enfantId, montant, datePaiement, methodePaiement, commentaire, moisConcerne, statut, typePaiement } = data;

    // Créer la date correcte pour le mois concerné
    const [year, month] = moisConcerne.split('-');
    const moisConcerneFinal = `${year}-${month}-01`;

    if (selectedPaiement) {
      const paiementModifie: Paiement = {
        ...selectedPaiement,
        enfantId: parseInt(enfantId),
        montant: parseFloat(montant),
        datePaiement,
        methodePaiement,
        commentaire,
        moisConcerne: moisConcerneFinal,
        statut,
        typePaiement
      };
      modifierPaiement(paiementModifie);
      toast({
        title: "Modification réussie",
        description: `Le paiement a été mis à jour.`,
      });
    } else {
      const nouveauPaiement = {
        enfantId: parseInt(enfantId),
        montant: parseFloat(montant),
        datePaiement,
        methodePaiement,
        commentaire,
        moisConcerne: moisConcerneFinal,
        statut,
        typePaiement
      };
      ajouterPaiement(nouveauPaiement);
      toast({
        title: "Ajout réussi",
        description: `Le paiement a été ajouté à la liste.`,
      });
    }

    setIsSheetOpen(false);
  };

  const handleAddMultiplePayments = (enfantId: number) => {
    const enfant = enfants.find(e => e.id === enfantId);
    if (!enfant) return;

    const currentYear = new Date().getFullYear();

    moisDisponibles.forEach((mois, index) => {
      // Déterminer la bonne année pour chaque mois
      const moisIndex = index + 9; // Septembre = 9
      const annee = moisIndex > 12 ? currentYear + 1 : currentYear;
      const moisNum = moisIndex > 12 ? moisIndex - 12 : moisIndex;
      const moisFormate = `${annee}-${String(moisNum).padStart(2, '0')}-01`;

      const nouveauPaiement = {
        enfantId,
        montant: defaultMontant,
        datePaiement: new Date().toISOString().split('T')[0],
        moisConcerne: moisFormate,
        methodePaiement: "especes" as const,
        statut: "en_attente" as const,
        typePaiement: "mensualite" as const,
        commentaire: `Paiement mensuel pour ${mois}`
      };
      ajouterPaiement(nouveauPaiement);
    });

    toast({
      title: "Paiements mensuels ajoutés",
      description: `Les paiements mensuels ont été créés pour ${enfant.prenom} ${enfant.nom}`,
    });
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
    
    const matchesSearch = nomComplet.includes(searchTerm.toLowerCase());
    const matchesEnfant = selectedEnfant === "all" ? true : paiement.enfantId === parseInt(selectedEnfant);
    const matchesMois = selectedMois === "all" ? true : paiement.moisConcerne === selectedMois;

    return matchesSearch && matchesEnfant && matchesMois;
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
    selectedEnfant,
    selectedMois,
    handleAddClick,
    handleEditClick,
    handleSearch,
    handleSubmit,
    handleEnfantFilter,
    handleMoisFilter,
    handleAddMultiplePayments,
    confirmDeletePaiement,
    cancelDeletePaiement,
    handleDeletePaiement,
    setDeletePassword,
    fetchPaiements,
    fetchEnfants,
  };
};
