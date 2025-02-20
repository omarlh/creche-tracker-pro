
import { useState, useEffect } from "react";
import { moisDisponibles } from "../RapportsHeader";
import { RapportMensuel } from "@/pages/Rapports";
import { Enfant } from "@/data/enfants";
import { Paiement } from "@/data/paiements";
import { supabase } from "@/integrations/supabase/client";

export const useRapportGeneration = (
  anneeScolaireSelectionnee: string,
  moisSelectionne: string,
  enfants: Enfant[],
  paiements: Paiement[]
) => {
  const [rapportsMensuels, setRapportsMensuels] = useState<RapportMensuel[]>([]);

  useEffect(() => {
    const genererRapportsMensuels = async () => {
      const rapportsGeneres: RapportMensuel[] = [];
      
      const [anneeDebut, anneeFin] = anneeScolaireSelectionnee.split("/");
      console.log("Génération des rapports pour l'année scolaire:", anneeDebut, "-", anneeFin);
      
      const moisAGenerer = [];
      
      if (moisSelectionne !== "Tous les mois") {
        const moisIndex = Object.keys(moisDisponibles).indexOf(moisSelectionne);
        const annee = moisIndex >= 8 ? parseInt(anneeDebut) : parseInt(anneeFin);
        moisAGenerer.push(new Date(annee, moisIndex));
      } else {
        for (let mois = 8; mois < 12; mois++) {
          moisAGenerer.push(new Date(parseInt(anneeDebut), mois));
        }
        
        for (let mois = 0; mois <= 6; mois++) {
          moisAGenerer.push(new Date(parseInt(anneeFin), mois));
        }
      }

      for (const date of moisAGenerer) {
        if (date.getMonth() !== 7) {
          const moisCourant = date.toISOString().slice(0, 7);
          const anneeScolaireFormatted = anneeScolaireSelectionnee.replace("/", "-");

          const enfantsActifs = enfants.filter(enfant => 
            enfant.anneeScolaire === anneeScolaireFormatted &&
            enfant.statut === "actif"
          );

          const paiementsMensuels = paiements.filter(paiement => {
            const moisConcerne = new Date(paiement.moisConcerne);
            return moisConcerne.getMonth() === date.getMonth() && 
                   moisConcerne.getFullYear() === date.getFullYear() &&
                   paiement.typePaiement === "mensualite" &&
                   paiement.anneeScolaire === anneeScolaireFormatted;
          });

          // Calcul des frais d'inscription pour le mois spécifique
          let totalFraisInscription = 0;
          try {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const { data: fraisInscriptionMois, error } = await supabase
              .from('paiements_inscription')
              .select('montant')
              .gte('date_paiement', startOfMonth.toISOString().split('T')[0])
              .lte('date_paiement', endOfMonth.toISOString().split('T')[0])
              .order('date_paiement', { ascending: true });

            if (error) {
              console.error("Erreur lors de la récupération des frais d'inscription:", error);
            } else {
              if (fraisInscriptionMois) {
                totalFraisInscription = fraisInscriptionMois.reduce((sum, p) => {
                  const montant = typeof p.montant === 'number' ? p.montant : parseFloat(p.montant);
                  return !isNaN(montant) ? sum + montant : sum;
                }, 0);
                console.log(`Total frais d'inscription pour ${moisCourant}:`, totalFraisInscription);
              }
            }
          } catch (error) {
            console.error("Erreur lors du calcul des frais d'inscription:", error);
          }

          const enfantsAvecPaiement = new Set(paiementsMensuels.map(p => p.enfantId));
          const enfantsPaye = Array.from(enfantsAvecPaiement);
          const enfantsNonPaye = enfantsActifs
            .filter(enfant => !enfantsAvecPaiement.has(enfant.id))
            .map(enfant => enfant.id);

          const totalPaiementsMensuels = paiementsMensuels.reduce((sum, paiement) => 
            sum + paiement.montant, 0
          );

          rapportsGeneres.push({
            mois: moisCourant,
            totalPaiements: totalPaiementsMensuels,
            totalFraisInscription,
            nombreEnfants: enfantsActifs.length,
            paiementsComplets: enfantsPaye.length,
            paiementsAttente: enfantsActifs.length - enfantsPaye.length,
            tauxRecouvrement: enfantsActifs.length ? 
              (enfantsPaye.length / enfantsActifs.length) * 100 : 0,
            enfantsPaye,
            enfantsNonPaye,
          });
        }
      }

      rapportsGeneres.sort((a, b) => a.mois.localeCompare(b.mois));
      setRapportsMensuels(rapportsGeneres);
    };

    genererRapportsMensuels();
  }, [anneeScolaireSelectionnee, moisSelectionne, enfants, paiements]);

  return rapportsMensuels;
};
