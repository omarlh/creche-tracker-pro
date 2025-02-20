
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

      // Récupérer tous les frais d'inscription pour l'année scolaire
      const { data: allFraisInscription, error: fraisError } = await supabase
        .from('paiements_inscription')
        .select('*')
        .order('date_paiement', { ascending: true });

      if (fraisError) {
        console.error("Erreur lors de la récupération des frais d'inscription:", fraisError);
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

          // Calculer les frais d'inscription pour ce mois spécifique
          const fraisInscriptionMois = allFraisInscription?.filter(frais => {
            const datePaiement = new Date(frais.date_paiement);
            return datePaiement.getMonth() === date.getMonth() &&
                   datePaiement.getFullYear() === date.getFullYear();
          }) || [];

          const totalFraisInscription = fraisInscriptionMois.reduce((sum, frais) => {
            return sum + Number(frais.montant);
          }, 0);

          console.log(`Mois: ${moisCourant} - Frais d'inscription trouvés:`, fraisInscriptionMois);
          console.log(`Total frais d'inscription pour ${moisCourant}:`, totalFraisInscription);

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
