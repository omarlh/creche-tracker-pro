
import { type Enfant } from "@/data/enfants";
import { useEnfantStore } from "@/data/enfants";
import { type Toast } from "@/hooks/use-toast";

export const handleEnfantSubmit = (
  e: React.FormEvent<HTMLFormElement>,
  selectedEnfant: Enfant | null,
  showPaiementForm: boolean,
  setIsSheetOpen: (isOpen: boolean) => void,
  setShowPaiementForm: (show: boolean) => void,
  toast: {
    (props: Omit<Toast, "id">): {
      id: string;
      dismiss: () => void;
      update: (props: Toast) => void;
    }
  }
) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  
  const ajouterEnfant = useEnfantStore.getState().ajouterEnfant;
  const modifierEnfant = useEnfantStore.getState().modifierEnfant;
  
  const montantTotal = Number(formData.get("montantTotal") || 300);
  const montantPaiement = Number(formData.get("montantPaiement") || 0);
  const methodePaiement = formData.get("methodePaiement") as "carte" | "especes" | "cheque";

  const nouveauPaiement = montantPaiement > 0 ? {
    id: Date.now(),
    montant: montantPaiement,
    datePaiement: new Date().toISOString().split('T')[0],
    methodePaiement,
  } : null;

  const nouvelEnfant = {
    nom: formData.get("nom") as string,
    prenom: formData.get("prenom") as string,
    dateNaissance: formData.get("dateNaissance") as string,
    dateInscription: formData.get("dateInscription") as string,
    dateFinInscription: formData.get("dateFinInscription") as string,
    classe: formData.get("classe") as "TPS" | "PS" | "MS" | "GS",
    gsmMaman: formData.get("gsmMaman") as string,
    gsmPapa: formData.get("gsmPapa") as string,
    fraisInscription: {
      montantTotal,
      montantPaye: montantPaiement,
      paiements: nouveauPaiement ? [nouveauPaiement] : [],
    },
    statut: (formData.get("statut") as "actif" | "inactif") || "actif",
    dernierPaiement: new Date().toISOString().split('T')[0],
  };

  if (selectedEnfant) {
    const paiementsExistants = selectedEnfant.fraisInscription?.paiements || [];
    const montantDejaRegle = selectedEnfant.fraisInscription?.montantPaye || 0;
    
    const enfantModifie = {
      ...nouvelEnfant,
      id: selectedEnfant.id,
      fraisInscription: {
        ...nouvelEnfant.fraisInscription,
        montantPaye: montantDejaRegle + (montantPaiement || 0),
        paiements: nouveauPaiement 
          ? [...paiementsExistants, nouveauPaiement]
          : paiementsExistants,
      },
    };

    modifierEnfant(enfantModifie);
    toast({
      title: "Modification réussie",
      description: `Les informations de ${nouvelEnfant.prenom} ont été mises à jour.`,
    });
  } else {
    ajouterEnfant(nouvelEnfant);
    toast({
      title: "Ajout réussi",
      description: `${nouvelEnfant.prenom} a été ajouté(e) à la liste.`,
    });
  }

  setIsSheetOpen(false);
  setShowPaiementForm(false);
};
