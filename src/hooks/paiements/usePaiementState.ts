
import { useState } from "react";
import { Paiement } from "@/data/paiements";
import { getCurrentSchoolYear, getMoisAnneeScolaire } from "@/lib/dateUtils";

export const usePaiementState = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [anneeScolaire, setAnneeScolaire] = useState(getCurrentSchoolYear());
  const [deletePassword, setDeletePassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [paiementToDelete, setPaiementToDelete] = useState<Paiement | null>(null);
  const [moisDisponibles, setMoisDisponibles] = useState(getMoisAnneeScolaire());
  const [defaultMontant] = useState<number>(800);
  const [selectedEnfant, setSelectedEnfant] = useState("all");
  const [selectedMois, setSelectedMois] = useState("all");

  return {
    isSheetOpen,
    setIsSheetOpen,
    selectedPaiement,
    setSelectedPaiement,
    searchTerm,
    setSearchTerm,
    isSearchFocused,
    setIsSearchFocused,
    anneeScolaire,
    setAnneeScolaire,
    deletePassword,
    setDeletePassword,
    isPasswordError,
    setIsPasswordError,
    paiementToDelete,
    setPaiementToDelete,
    moisDisponibles,
    defaultMontant,
    selectedEnfant,
    setSelectedEnfant,
    selectedMois,
    setSelectedMois
  };
};
