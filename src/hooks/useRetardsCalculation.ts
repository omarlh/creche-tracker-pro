
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
    const retardParEnfant = new Map<number, RetardPaiement>();

    // Vérifier les retards de paiements mensuels
    paiements.forEach(paiement => {
      const enfant = enfants.find(e => e.id === paiement.enfantId);
      if (!enfant || paiement.statut !== "en_attente") return;

      const datePaiement = new Date(paiement.datePaiement);
      const joursRetard = Math.floor(
        (aujourdhui.getTime() - datePaiement.getTime()) / (1000 * 3600 * 24)
      );

      // Uniquement considérer les paiements mensuels avec plus de 30 jours de retard
      if (joursRetard > 30) {
        const retardExistant = retardParEnfant.get(enfant.id);
        
        if (!retardExistant || joursRetard > retardExistant.joursRetard) {
          const retard: RetardPaiement = {
            id: paiement.id,
            enfantId: enfant.id,
            enfantNom: enfant.nom,
            enfantPrenom: enfant.prenom,
            moisConcerne: paiement.moisConcerne,
            montantDu: enfant.fraisScolariteMensuel || 0,
            joursRetard,
            dernierRappel: paiement.dernierRappel,
            type: 'mensuel',
            telephone: enfant.gsmPapa || enfant.gsmMaman
          };

          retardParEnfant.set(enfant.id, retard);
        }
      }
    });

    // Vérifier les retards de paiements d'inscription
    enfants.forEach(enfant => {
      if (!enfant.fraisInscription) return;

      const { montantTotal, montantPaye } = enfant.fraisInscription;
      const montantRestant = montantTotal - montantPaye;

      if (montantRestant > 0) {
        const dateInscription = new Date(enfant.dateInscription || '');
        const joursRetard = Math.floor(
          (aujourdhui.getTime() - dateInscription.getTime()) / (1000 * 3600 * 24)
        );

        if (joursRetard > 30) {
          const retardExistant = retardParEnfant.get(enfant.id);
          
          // Si le retard d'inscription est plus critique que le retard mensuel
          if (!retardExistant || joursRetard > retardExistant.joursRetard) {
            const retard: RetardPaiement = {
              id: -enfant.id, // ID négatif pour différencier des paiements mensuels
              enfantId: enfant.id,
              enfantNom: enfant.nom,
              enfantPrenom: enfant.prenom,
              moisConcerne: enfant.dateInscription || '',
              montantDu: montantRestant,
              joursRetard,
              dernierRappel: null,
              type: 'inscription',
              telephone: enfant.gsmPapa || enfant.gsmMaman
            };

            retardParEnfant.set(enfant.id, retard);
          }
        }
      }
    });

    // Convertir la Map en tableau et appliquer les filtres
    const tousRetards = Array.from(retardParEnfant.values());
    
    return tousRetards.filter(retard => {
      const enfant = enfants.find(e => e.id === retard.enfantId);
      if (!enfant) return false;

      return (
        (filtreStatus === "tous" || 
         (filtreStatus === "rappel" && retard.dernierRappel) || 
         (filtreStatus === "non_rappele" && !retard.dernierRappel)) &&
        (filtreDelai === "tous" || 
         (filtreDelai === "court" && retard.joursRetard <= 45) ||
         (filtreDelai === "moyen" && retard.joursRetard > 45 && retard.joursRetard <= 60) ||
         (filtreDelai === "long" && retard.joursRetard > 60)) &&
        (filtreClasse === "toutes" || enfant.classe === filtreClasse) &&
        (filtreAnnee === "tous" || enfant.anneeScolaire === filtreAnnee)
      );
    });
  }, [paiements, enfants, filtreStatus, filtreDelai, filtreClasse, filtreAnnee]);

  const statistiques = useMemo(() => {
    const total = retardsPaiement.length;
    const totalMontant = retardsPaiement.reduce((sum, retard) => sum + retard.montantDu, 0);
    
    // Calculer les différentes catégories basées sur les jours de retard
    const critique = retardsPaiement.filter(r => r.joursRetard > 60).length;
    const enRetard = retardsPaiement.filter(r => r.joursRetard > 45 && r.joursRetard <= 60).length;
    const aJour = total - critique - enRetard;

    return {
      total,
      enRetard,
      critique,
      aJour,
      montantTotal: totalMontant
    };
  }, [retardsPaiement]);

  return { retardsPaiement, statistiques };
};

