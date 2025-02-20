
import { useState, useEffect } from "react";
import { RapportMensuel } from "@/pages/Rapports";
import { Enfant } from "@/data/enfants";
import { Paiement } from "@/data/paiements";
import { supabase } from "@/integrations/supabase/client";

export const useRapportGeneration = (
  dateDebut: string,
  dateFin: string,
  enfants: Enfant[],
  paiements: Paiement[]
) => {
  const [rapportsMensuels, setRapportsMensuels] = useState<RapportMensuel[]>([]);

  useEffect(() => {
    const genererRapports = async () => {
      // Récupérer tous les frais d'inscription pour la période
      const { data: fraisInscription, error: fraisError } = await supabase
        .from('paiements_inscription')
        .select('*')
        .gte('date_paiement', dateDebut)
        .lte('date_paiement', dateFin)
        .order('date_paiement');

      if (fraisError) {
        console.error("Erreur lors de la récupération des frais d'inscription:", fraisError);
        return;
      }

      // Créer un map des paiements par date
      const paiementsParDate = new Map<string, RapportMensuel>();

      // Traiter les paiements mensuels
      paiements
        .filter(p => p.datePaiement >= dateDebut && p.datePaiement <= dateFin)
        .forEach(paiement => {
          const date = paiement.datePaiement;
          if (!paiementsParDate.has(date)) {
            paiementsParDate.set(date, {
              mois: date,
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
          
          const rapport = paiementsParDate.get(date)!;
          rapport.totalPaiements += paiement.montant;
          if (!rapport.enfantsPaye.includes(paiement.enfantId)) {
            rapport.enfantsPaye.push(paiement.enfantId);
          }
        });

      // Traiter les frais d'inscription
      fraisInscription?.forEach(frais => {
        const date = frais.date_paiement;
        if (!paiementsParDate.has(date)) {
          paiementsParDate.set(date, {
            mois: date,
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
        
        const rapport = paiementsParDate.get(date)!;
        rapport.totalFraisInscription += Number(frais.montant);
      });

      // Convertir le Map en tableau et trier par date
      const rapports = Array.from(paiementsParDate.values()).sort((a, b) => 
        a.mois.localeCompare(b.mois)
      );

      setRapportsMensuels(rapports);
    };

    genererRapports();
  }, [dateDebut, dateFin, enfants, paiements]);

  return rapportsMensuels;
};
