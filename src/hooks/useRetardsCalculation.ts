
import { useCallback, useMemo } from "react";
import { useEnfantStore } from "@/data/enfants";
import type { RetardPaiement } from "@/components/retards/RetardsTable";

export const useRetardsCalculation = (
  filtreStatus: string,
  filtreDelai: string,
  filtreClasse: string,
  filtreAnnee: string
) => {
  const enfants = useEnfantStore((state) => state.enfants);

  const calculerRetard = useCallback((dernierPaiement: string | null) => {
    if (!dernierPaiement) return Infinity;
    const dateRetard = new Date(dernierPaiement);
    const aujourdhui = new Date();
    const differenceEnJours = Math.floor(
      (aujourdhui.getTime() - dateRetard.getTime()) / (1000 * 60 * 60 * 24)
    );
    return differenceEnJours;
  }, []);

  const retardsPaiement = useMemo((): RetardPaiement[] => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const enfantsFiltres = enfants
      .filter((enfant) => enfant.statut === "actif")
      .filter((enfant) => filtreClasse === "toutes" || enfant.classe === filtreClasse)
      .filter((enfant) => enfant.anneeScolaire === filtreAnnee);

    const retardsParEnfant = new Map<number, RetardPaiement>();

    enfantsFiltres.forEach((enfant) => {
      const joursRetard = calculerRetard(enfant.dernierPaiement);
      const montantDu = (enfant.fraisScolariteMensuel || 0) * Math.ceil(joursRetard / 30);
      
      const retardMensuel: RetardPaiement = {
        id: enfant.id * 1000,
        enfantId: enfant.id,
        enfantNom: enfant.nom,
        enfantPrenom: enfant.prenom,
        moisConcerne: currentMonth,
        montantDu: joursRetard === Infinity ? 0 : montantDu,
        joursRetard,
        dernierRappel: null,
        type: 'mensuel' as const
      };

      retardsParEnfant.set(enfant.id, retardMensuel);
    });

    enfantsFiltres
      .filter((enfant) => {
        const montantPaye = enfant.fraisInscription?.montantPaye || 0;
        const montantTotal = enfant.fraisInscription?.montantTotal || 0;
        return montantPaye < montantTotal;
      })
      .forEach((enfant) => {
        const montantPaye = enfant.fraisInscription?.montantPaye || 0;
        const montantTotal = enfant.fraisInscription?.montantTotal || 0;
        const joursRetardInscription = calculerRetard(enfant.dateInscription || null);
        const montantDuInscription = montantTotal - montantPaye;

        const retardExistant = retardsParEnfant.get(enfant.id);
        if (!retardExistant || joursRetardInscription > retardExistant.joursRetard) {
          const retardInscription: RetardPaiement = {
            id: enfant.id,
            enfantId: enfant.id,
            enfantNom: enfant.nom,
            enfantPrenom: enfant.prenom,
            moisConcerne: enfant.dateInscription || currentMonth,
            montantDu: montantDuInscription,
            joursRetard: joursRetardInscription,
            dernierRappel: null,
            type: 'inscription' as const
          };
          retardsParEnfant.set(enfant.id, retardInscription);
        }
      });

    const tousLesRetards = Array.from(retardsParEnfant.values())
      .filter((retard) => {
        if (filtreStatus === "tous") return true;
        const status = retard.joursRetard <= 0 ? "à jour" : retard.joursRetard <= 30 ? "en retard" : "critique";
        return status === filtreStatus;
      })
      .filter((retard) => {
        if (filtreDelai === "tous") return true;
        switch (filtreDelai) {
          case "moins30":
            return retard.joursRetard <= 30;
          case "30a60":
            return retard.joursRetard > 30 && retard.joursRetard <= 60;
          case "plus60":
            return retard.joursRetard > 60;
          default:
            return true;
        }
      })
      .sort((a, b) => b.joursRetard - a.joursRetard);

    return tousLesRetards;
  }, [enfants, calculerRetard, filtreStatus, filtreDelai, filtreClasse, filtreAnnee]);

  const statistiques = useMemo(() => {
    const total = retardsPaiement.length;
    const enRetard = retardsPaiement.filter(r => r.joursRetard > 0 && r.joursRetard <= 30).length;
    const critique = retardsPaiement.filter(r => r.joursRetard > 30).length;
    const aJour = retardsPaiement.filter(r => r.joursRetard <= 0).length;
    const montantTotal = retardsPaiement.reduce((acc, curr) => acc + curr.montantDu, 0);

    return {
      total,
      enRetard,
      critique,
      aJour,
      montantTotal
    };
  }, [retardsPaiement]);

  return {
    retardsPaiement,
    statistiques
  };
};
