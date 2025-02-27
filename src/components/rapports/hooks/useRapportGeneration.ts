
import { useState, useEffect } from "react";
import { RapportMensuel } from "@/pages/Rapports";
import { Enfant } from "@/types/enfant.types";
import { Paiement } from "@/data/paiements";
import { supabase } from "@/integrations/supabase/client";

export const useRapportGeneration = (
  dateDebut: string,
  dateFin: string,
  enfants: Enfant[],
  paiements: Paiement[],
  anneeScolaire: string = "2024-2025"
) => {
  const [rapportsMensuels, setRapportsMensuels] = useState<RapportMensuel[]>([]);

  useEffect(() => {
    const genererRapports = async () => {
      // Filtrer les enfants par date d'inscription et année scolaire
      const enfantsInscrits = enfants.filter(enfant => {
        const dateInscription = enfant.dateInscription || '';
        const dateFinInscription = enfant.dateFinInscription || '';
        return (
          (dateInscription >= dateDebut && 
          (!dateFinInscription || dateFinInscription <= dateFin)) &&
          enfant.anneeScolaire === anneeScolaire
        );
      });

      // Récupérer tous les frais d'inscription pour la période
      const { data: fraisInscription, error: fraisError } = await supabase
        .from('paiements_inscription')
        .select('*')
        .in('enfant_id', enfantsInscrits.map(e => e.id))
        .order('date_paiement');

      if (fraisError) {
        console.error("Erreur lors de la récupération des frais d'inscription:", fraisError);
        return;
      }

      // Créer un map des paiements par date d'inscription
      const paiementsParDate = new Map<string, RapportMensuel>();

      // Initialiser les rapports pour chaque date d'inscription unique
      enfantsInscrits.forEach(enfant => {
        if (!enfant.dateInscription) return;

        if (!paiementsParDate.has(enfant.dateInscription)) {
          paiementsParDate.set(enfant.dateInscription, {
            mois: enfant.dateInscription,
            totalPaiements: 0,
            totalFraisInscription: 0,
            nombreEnfants: 0,
            paiementsComplets: 0,
            paiementsAttente: 0,
            tauxRecouvrement: 0,
            enfantsPaye: [],
            enfantsNonPaye: []
          });
        }

        const rapport = paiementsParDate.get(enfant.dateInscription)!;
        rapport.nombreEnfants++;
      });

      // Traiter les paiements mensuels
      paiements
        .filter(p => {
          const enfant = enfantsInscrits.find(e => e.id === p.enfantId);
          return enfant !== undefined && p.anneeScolaire === anneeScolaire;
        })
        .forEach(paiement => {
          const enfant = enfantsInscrits.find(e => e.id === paiement.enfantId);
          if (!enfant || !enfant.dateInscription) return;

          const rapport = paiementsParDate.get(enfant.dateInscription);
          if (!rapport) return;
          
          rapport.totalPaiements += paiement.montant;
          if (!rapport.enfantsPaye.includes(paiement.enfantId)) {
            rapport.enfantsPaye.push(paiement.enfantId);
          }
        });

      // Traiter les frais d'inscription
      fraisInscription?.forEach(frais => {
        const enfant = enfantsInscrits.find(e => e.id === frais.enfant_id);
        if (!enfant || !enfant.dateInscription) return;

        const rapport = paiementsParDate.get(enfant.dateInscription);
        if (!rapport) return;
        
        rapport.totalFraisInscription += Number(frais.montant);
      });

      // Convertir le Map en tableau et trier par date
      const rapports = Array.from(paiementsParDate.values()).sort((a, b) => 
        a.mois.localeCompare(b.mois)
      );

      setRapportsMensuels(rapports);
    };

    genererRapports();
  }, [dateDebut, dateFin, enfants, paiements, anneeScolaire]);

  return rapportsMensuels;
};
