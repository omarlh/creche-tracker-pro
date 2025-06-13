
import { type Enfant } from "@/types/enfant.types";
import { useEnfantStore } from "@/data/enfants";
import { type ToasterToast } from "@/hooks/use-toast";

export const handleEnfantSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  selectedEnfant: Enfant | null,
  showPaiementForm: boolean,
  setIsSheetOpen: (isOpen: boolean) => void,
  setShowPaiementForm: (show: boolean) => void,
  toast: {
    (props: Omit<ToasterToast, "id">): {
      id: string;
      dismiss: () => void;
      update: (props: ToasterToast) => void;
    }
  }
) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  
  const ajouterEnfant = useEnfantStore.getState().ajouterEnfant;
  const modifierEnfant = useEnfantStore.getState().modifierEnfant;
  
  try {
    const montantTotal = Number(formData.get("montantTotal") || 300);
    const montantPaiement = Number(formData.get("montantPaiement") || 0);
    const methodePaiement = formData.get("methodePaiement") as "carte" | "especes" | "cheque" | "virement";
    const anneeScolaire = formData.get("anneeScolaire") as string || "2024-2025";
    const datePaiementSaisie = formData.get("datePaiement") as string || new Date().toISOString().split('T')[0];

    // Only create a new payment if there's a valid amount
    const nouveauPaiement = montantPaiement > 0 ? {
      id: Date.now(),
      montant: montantPaiement,
      datePaiement: datePaiementSaisie,
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
      anneeScolaire: anneeScolaire,
      fraisScolariteMensuel: Number(formData.get("fraisScolariteMensuel") || 800),
      fraisInscription: {
        montantTotal,
        montantPaye: montantPaiement,
        paiements: nouveauPaiement ? [nouveauPaiement] : [],
      },
      statut: (formData.get("statut") as "actif" | "inactif") || "actif",
      dernierPaiement: datePaiementSaisie,
    };

    console.log("Form data:", nouvelEnfant);

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

      await modifierEnfant(enfantModifie);
      toast({
        title: "Modification réussie",
        description: `Les informations de ${nouvelEnfant.prenom} ont été mises à jour.`,
      });
    } else {
      await ajouterEnfant(nouvelEnfant);
      toast({
        title: "Ajout réussi",
        description: `${nouvelEnfant.prenom} a été ajouté(e) à la liste.`,
      });
    }

    setIsSheetOpen(false);
    setShowPaiementForm(false);
  } catch (error) {
    console.error("Erreur lors de l'ajout/modification de l'enfant:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'enregistrement. Veuillez vérifier votre connexion Internet et réessayer.",
      variant: "destructive",
    });
  }
};
