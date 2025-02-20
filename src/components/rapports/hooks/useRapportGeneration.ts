
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
      
      // Si un mois spécifique est sélectionné
      if (moisSelectionne !== "Tous les mois") {
        const moisIndex = Object.keys(moisDisponibles).indexOf(moisSelectionne);
        const annee = moisIndex >= 8 ? parseInt(anneeDebut) : parseInt(anneeFin);
        moisAGenerer.push(new Date(annee, moisIndex));
      } else {
        // Générer les mois de septembre à décembre de l'année de début
        for (let mois = 8; mois < 12; mois++) {
          moisAGenerer.push(new Date(parseInt(anneeDebut), mois));
        }
        
        // Générer les mois de janvier à juin de l'année de fin
        for (let mois = 0; mois <= 6; mois++) {
          moisAGenerer.push(new Date(parseInt(anneeFin), mois));
        }
      }

      for (const date of moisAGenerer) {
        if (date.getMonth() !== 7) { // Exclure août
          const moisCourant = date.toISOString().slice(0, 7);
          const anneeScolaireFormatted = anneeScolaireSelectionnee.replace("/", "-");

          // Filtrer les enfants actifs pour cette année scolaire
          const enfantsActifs = enfants.filter(enfant => 
            enfant.anneeScolaire === anneeScolaireFormatted &&
            enfant.statut === "actif"
          );

          // Filtrer les paiements pour ce mois et cette année scolaire
          const paiementsMensuels = paiements.filter(paiement => {
            const moisConcerne = new Date(paiement.moisConcerne);
            return moisConcerne.getMonth() === date.getMonth() && 
                   moisConcerne.getFullYear() === date.getFullYear() &&
                   paiement.typePaiement === "mensualite" &&
                   paiement.anneeScolaire === anneeScolaireFormatted;
          });

          // Récupérer les frais d'inscription pour ce mois depuis la table paiements_inscription
          const { data: fraisInscriptionMois, error } = await supabase
            .from('paiements_inscription')
            .select('montant')
            .gte('date_paiement', `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`)
            .lt('date_paiement', `${date.getFullYear()}-${String(date.getMonth() + 2).padStart(2, '0')}-01`);

          if (error) {
            console.error("Erreur lors de la récupération des frais d'inscription:", error);
          }

          // Calculer le total des frais d'inscription pour ce mois
          const totalFraisInscription = fraisInscriptionMois
            ? fraisInscriptionMois.reduce((sum, paiement) => sum + Number(paiement.montant), 0)
            : 0;

          // Trouver les enfants avec paiement pour ce mois
          const enfantsAvecPaiement = new Set(paiementsMensuels.map(p => p.enfantId));
          const enfantsPaye = Array.from(enfantsAvecPaiement);
          const enfantsNonPaye = enfantsActifs
            .filter(enfant => !enfantsAvecPaiement.has(enfant.id))
            .map(enfant => enfant.id);

          // Calculer le total des paiements mensuels
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
