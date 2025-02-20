
import { useState, useEffect } from "react";
import { moisDisponibles } from "../RapportsHeader";
import { RapportMensuel } from "@/pages/Rapports";
import { Enfant } from "@/data/enfants";
import { Paiement } from "@/data/paiements";

export const useRapportGeneration = (
  anneeScolaireSelectionnee: string,
  moisSelectionne: string,
  enfants: Enfant[],
  paiements: Paiement[]
) => {
  const [rapportsMensuels, setRapportsMensuels] = useState<RapportMensuel[]>([]);

  useEffect(() => {
    const genererRapportsMensuels = () => {
      const rapportsGeneres: RapportMensuel[] = [];
      
      const [anneeDebut, anneeFin] = anneeScolaireSelectionnee.split("/");
      console.log("Génération des rapports pour l'année scolaire:", anneeDebut, "-", anneeFin);
      
      const moisAGenerer = [];
      
      // Générer les mois de septembre à décembre de l'année de début
      for (let mois = 8; mois < 12; mois++) {
        const date = new Date(parseInt(anneeDebut), mois);
        moisAGenerer.push(date);
      }
      
      // Générer les mois de janvier à juin de l'année de fin
      for (let mois = 0; mois <= 6; mois++) {
        const date = new Date(parseInt(anneeFin), mois);
        moisAGenerer.push(date);
      }

      moisAGenerer.forEach(date => {
        if (date.getMonth() !== 7) { // Exclure août
          const moisCourant = date.toISOString().slice(0, 7);
          
          // Filtrer les paiements mensuels pour ce mois
          const paiementsMensuels = paiements.filter(paiement => {
            const moisConcerne = new Date(paiement.moisConcerne);
            return moisConcerne.getMonth() === date.getMonth() && 
                   moisConcerne.getFullYear() === date.getFullYear() &&
                   paiement.typePaiement === "mensualite";
          });

          // Calculer le total des paiements mensuels
          const totalPaiementsMensuels = paiementsMensuels.reduce((sum, paiement) => 
            sum + paiement.montant, 0
          );

          // Filtrer les paiements d'inscription pour ce mois
          const paiementsInscription = paiements.filter(paiement => {
            const datePaiement = new Date(paiement.datePaiement);
            return datePaiement.getMonth() === date.getMonth() && 
                   datePaiement.getFullYear() === date.getFullYear() &&
                   paiement.typePaiement === "inscription";
          });

          // Calculer le total des frais d'inscription
          const totalFraisInscription = paiementsInscription.reduce((sum, paiement) => 
            sum + paiement.montant, 0
          );

          const enfantsActifs = enfants.filter(enfant => 
            enfant.anneeScolaire === anneeScolaireSelectionnee.replace("/", "-") &&
            enfant.statut === "actif"
          );

          const enfantsAvecPaiement = new Set(paiementsMensuels.map(p => p.enfantId));
          const enfantsPaye = Array.from(enfantsAvecPaiement);
          const enfantsNonPaye = enfantsActifs
            .filter(enfant => !enfantsAvecPaiement.has(enfant.id))
            .map(enfant => enfant.id);

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
      });

      rapportsGeneres.sort((a, b) => a.mois.localeCompare(b.mois));
      
      if (moisSelectionne !== "Tous les mois") {
        const moisIndex = moisDisponibles.indexOf(moisSelectionne) - 1;
        const moisAjuste = moisIndex >= 3 ? moisIndex - 3 : moisIndex + 9;
        setRapportsMensuels(rapportsGeneres.filter(rapport => 
          new Date(rapport.mois).getMonth() === moisAjuste
        ));
      } else {
        setRapportsMensuels(rapportsGeneres);
      }
    };

    genererRapportsMensuels();
  }, [anneeScolaireSelectionnee, moisSelectionne, enfants, paiements]);

  return rapportsMensuels;
};
