
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

      moisAGenerer.forEach(date => {
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

          // Trouver les enfants avec paiement pour ce mois
          const enfantsAvecPaiement = new Set(paiementsMensuels.map(p => p.enfantId));
          const enfantsPaye = Array.from(enfantsAvecPaiement);
          const enfantsNonPaye = enfantsActifs
            .filter(enfant => !enfantsAvecPaiement.has(enfant.id))
            .map(enfant => enfant.id);

          // Calculer les totaux
          const totalPaiementsMensuels = paiementsMensuels.reduce((sum, paiement) => 
            sum + paiement.montant, 0
          );

          // Calculer les frais d'inscription pour ce mois
          const fraisInscriptionMois = paiements.filter(paiement => {
            const datePaiement = new Date(paiement.datePaiement);
            return datePaiement.getMonth() === date.getMonth() && 
                   datePaiement.getFullYear() === date.getFullYear() &&
                   paiement.typePaiement === "inscription" &&
                   paiement.anneeScolaire === anneeScolaireFormatted;
          });

          const totalFraisInscription = fraisInscriptionMois.reduce((sum, paiement) => 
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
      });

      rapportsGeneres.sort((a, b) => a.mois.localeCompare(b.mois));
      setRapportsMensuels(rapportsGeneres);
    };

    genererRapportsMensuels();
  }, [anneeScolaireSelectionnee, moisSelectionne, enfants, paiements]);

  return rapportsMensuels;
};
