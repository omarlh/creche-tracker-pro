
import { useToast } from "@/components/ui/use-toast";
import { usePaiementStore, type Paiement } from "@/data/paiements";
import { useEnfantStore } from "@/data/enfants";

export const extractSchoolYearFromDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-11 -> 1-12
    
    if (month >= 9) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  } catch (error) {
    console.error("Erreur lors de l'extraction de l'année scolaire:", error);
    return `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  }
};

export const usePaiementSubmit = (
  selectedPaiement: Paiement | null,
  setIsSheetOpen: (isOpen: boolean) => void,
  defaultMontant: number
) => {
  const { toast } = useToast();
  const { ajouterPaiement, modifierPaiement } = usePaiementStore();
  const { enfants } = useEnfantStore();

  const handleSubmit = (data: any) => {
    const { enfantId, montant, datePaiement, methodePaiement, commentaire, moisConcerne, statut } = data;

    if (selectedPaiement) {
      const paiementModifie: Paiement = {
        ...selectedPaiement,
        enfantId: parseInt(enfantId),
        montant: parseFloat(montant),
        datePaiement,
        methodePaiement,
        commentaire,
        moisConcerne,
        statut,
        anneeScolaire: extractSchoolYearFromDate(moisConcerne)
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
        moisConcerne,
        statut,
        anneeScolaire: extractSchoolYearFromDate(moisConcerne)
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
    const moisDisponibles = ["Septembre", "Octobre", "Novembre", "Décembre", 
                            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"];

    moisDisponibles.forEach((mois, index) => {
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
        commentaire: `Paiement mensuel pour ${mois}`,
        anneeScolaire: extractSchoolYearFromDate(moisFormate)
      };
      ajouterPaiement(nouveauPaiement);
    });

    toast({
      title: "Paiements mensuels ajoutés",
      description: `Les paiements mensuels ont été créés pour ${enfant.prenom} ${enfant.nom}`,
    });
  };

  return {
    handleSubmit,
    handleAddMultiplePayments
  };
};
