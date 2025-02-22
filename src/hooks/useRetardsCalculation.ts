
import { useMemo } from "react";
import { usePaiementStore } from "@/data/paiements";
import { useEnfantStore } from "@/data/enfants";
import type { RetardPaiement } from "@/components/retards/RetardsTable";

export const useRetardsCalculation = (
  filtreStatus: string,
  filtreDelai: string,
  filtreClasse: string,
  filtreAnnee: string
) => {
  const { paiements } = usePaiementStore();
  const { enfants } = useEnfantStore();

  const retardsPaiement = useMemo(() => {
    const aujourdhui = new Date();
    const retards: RetardPaiement[] = [];

    paiements.forEach(paiement => {
      if (paiement.statut === "en_attente") {
        const enfant = enfants.find(e => e.id === paiement.enfantId);
        if (!enfant) return;

        const datePaiement = new Date(paiement.datePaiement);
        const joursRetard = Math.floor(
          (aujourdhui.getTime() - datePaiement.getTime()) / (1000 * 3600 * 24)
        );

        // Apply filters
        if (
          (filtreStatus === "tous" || 
           (filtreStatus === "rappel" && paiement.dernierRappel) || 
           (filtreStatus === "non_rappele" && !paiement.dernierRappel)) &&
          (filtreDelai === "tous" || 
           (filtreDelai === "court" && joursRetard <= 10) ||
           (filtreDelai === "moyen" && joursRetard > 10 && joursRetard <= 20) ||
           (filtreDelai === "long" && joursRetard > 20)) &&
          (filtreClasse === "toutes" || enfant.classe === filtreClasse) &&
          (filtreAnnee === "tous" || paiement.anneeScolaire === filtreAnnee)
        ) {
          retards.push({
            id: paiement.id,
            enfantId: enfant.id,
            enfantNom: enfant.nom,
            enfantPrenom: enfant.prenom,
            moisConcerne: paiement.moisConcerne,
            montantDu: paiement.montant,
            joursRetard,
            dernierRappel: paiement.dernierRappel,
            type: 'mensuel',
            telephone: enfant.telephone
          });
        }
      }
    });

    return retards;
  }, [paiements, enfants, filtreStatus, filtreDelai, filtreClasse, filtreAnnee]);

  const statistiques = useMemo(() => {
    const total = retardsPaiement.length;
    const totalMontant = retardsPaiement.reduce((sum, retard) => sum + retard.montantDu, 0);
    const retardsParDelai = {
      court: retardsPaiement.filter(r => r.joursRetard <= 10).length,
      moyen: retardsPaiement.filter(r => r.joursRetard > 10 && r.joursRetard <= 20).length,
      long: retardsPaiement.filter(r => r.joursRetard > 20).length
    };

    return {
      total,
      totalMontant,
      retardsParDelai
    };
  }, [retardsPaiement]);

  return { retardsPaiement, statistiques };
};

