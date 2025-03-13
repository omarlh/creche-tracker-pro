
import { useEffect } from "react";
import { usePaiementState } from "./paiements/usePaiementState";
import { usePaiementActions } from "./paiements/usePaiementActions";
import { usePaiementSubmit } from "./paiements/usePaiementSubmit";
import { usePaiementFilter } from "./paiements/usePaiementFilter";
import { usePaiementStore } from "@/data/paiements";
import { useEnfantStore } from "@/data/enfants";

export const usePaiementManager = () => {
  const paiementState = usePaiementState();
  const {
    isSheetOpen, setIsSheetOpen,
    selectedPaiement, setSelectedPaiement,
    searchTerm, setSearchTerm,
    isSearchFocused, setIsSearchFocused,
    anneeScolaire, setAnneeScolaire,
    deletePassword, setDeletePassword,
    isPasswordError, setIsPasswordError,
    paiementToDelete, setPaiementToDelete,
    moisDisponibles, defaultMontant,
    selectedEnfant, setSelectedEnfant,
    selectedMois, setSelectedMois
  } = paiementState;

  const paiementActions = usePaiementActions(
    setSelectedPaiement,
    setIsSheetOpen,
    setSearchTerm,
    setSelectedEnfant,
    setSelectedMois,
    setPaiementToDelete,
    setDeletePassword,
    setIsPasswordError
  );

  const {
    handleAddClick,
    handleEditClick,
    handleSearch,
    handleEnfantFilter,
    handleMoisFilter,
    confirmDeletePaiement,
    cancelDeletePaiement,
    handleDeletePaiement,
    fetchPaiements
  } = paiementActions;

  const { handleSubmit, handleAddMultiplePayments } = usePaiementSubmit(
    selectedPaiement,
    setIsSheetOpen,
    defaultMontant
  );

  const { filterPaiements } = usePaiementFilter();

  const { paiements } = usePaiementStore();
  const { enfants, fetchEnfants } = useEnfantStore();

  const filteredPaiements = filterPaiements(paiements, enfants, searchTerm, selectedEnfant);

  const handleDeletePaiementWithState = async () => {
    await handleDeletePaiement(deletePassword, paiementToDelete);
  };

  return {
    // State properties
    isSheetOpen,
    setIsSheetOpen,
    selectedPaiement,
    searchTerm,
    isSearchFocused,
    setIsSearchFocused,
    anneeScolaire,
    setAnneeScolaire,
    deletePassword,
    isPasswordError,
    paiementToDelete,
    moisDisponibles,
    defaultMontant,
    enfants,
    filteredPaiements,
    selectedEnfant,
    selectedMois,
    
    // Actions
    handleAddClick,
    handleEditClick,
    handleSearch,
    handleSubmit,
    handleEnfantFilter,
    handleMoisFilter,
    handleAddMultiplePayments,
    confirmDeletePaiement,
    cancelDeletePaiement,
    handleDeletePaiement: handleDeletePaiementWithState,
    setDeletePassword,
    fetchPaiements,
    fetchEnfants,
  };
};
