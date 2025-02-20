
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
      
      const anneeScolaireFormatted = anneeScolaireSelectionnee.replace("/", "-");
      const [anneeDebut, anneeFin] = anneeScolaireSelectionnee.split("/");
      console.log("Génération des rapports pour l'année scolaire:", anneeDebut, "-", anneeFin);
      
      const moisAGenerer = [];
      
      if (moisSelectionne !== "Tous les mois") {
        // Conversion du nom du mois en index (0-11)
        const moisNoms = ["janvier", "février", "mars", "avril", "mai", "juin", 
                         "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        const moisIndex = moisNoms.findIndex(m => 
          m.toLowerCase() === moisSelectionne.toLowerCase()
        );
        
        if (moisIndex !== -1) {
          // Déterminer l'année en fonction du mois
          const annee = moisIndex >= 8 ? parseInt(anneeDebut) : parseInt(anneeFin);
          moisAGenerer.push(new Date(annee, moisIndex));
        }
      } else {
        // Septembre à Décembre de l'année de début
        for (let mois = 8; mois < 12; mois++) {
          moisAGenerer.push(new Date(parseInt(anneeDebut), mois));
        }
        // Janvier à Juin de l'année de fin
        for (let mois = 0; mois <= 6; mois++) {
          moisAGenerer.push(new Date(parseInt(anneeFin), mois));
        }
      }

      // Récupérer tous les frais d'inscription pour l'année scolaire
      const { data: fraisInscription, error: fraisError } = await supabase
        .from('paiements_inscription')
        .select('*')
        .gte('date_paiement', `${anneeDebut}-09-01`)
        .lte('date_paiement', `${anneeFin}-07-31`);

      if (fraisError) {
        console.error("Erreur lors de la récupération des frais d'inscription:", fraisError);
        return;
      }

      for (const date of moisAGenerer) {
        if (date.getMonth() !== 7) {  // Exclure août
          const moisCourant = date.toISOString().slice(0, 7);
          const premierJourMois = new Date(date.getFullYear(), date.getMonth(), 1)
            .toISOString().split('T')[0];
          const dernierJourMois = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            .toISOString().split('T')[0];

          // Filtrer les enfants actifs pour l'année scolaire
          const enfantsActifs = enfants.filter(enfant => 
            enfant.anneeScolaire === anneeScolaireFormatted &&
            enfant.statut === "actif"
          );

          // Filtrer les paiements mensuels pour le mois et l'année scolaire
          const paiementsMensuels = paiements.filter(paiement => {
            const moisConcerne = new Date(paiement.moisConcerne);
            return moisConcerne.getMonth() === date.getMonth() && 
                   moisConcerne.getFullYear() === date.getFullYear() &&
                   paiement.typePaiement === "mensualite" &&
                   paiement.anneeScolaire === anneeScolaireFormatted;
          });

          // Filtrer les frais d'inscription pour ce mois spécifique
          const fraisInscriptionMois = fraisInscription?.filter(frais => {
            const datePaiement = new Date(frais.date_paiement);
            return datePaiement >= new Date(premierJourMois) && 
                   datePaiement <= new Date(dernierJourMois);
          }) || [];

          console.log(`Mois ${moisCourant} - Frais d'inscription trouvés:`, 
            fraisInscriptionMois.map(f => ({
              date: f.date_paiement,
              montant: f.montant
            }))
          );

          // Calculer le total des frais d'inscription pour ce mois
          const totalFraisInscription = fraisInscriptionMois.reduce((sum, frais) => 
            sum + Number(frais.montant), 0
          );

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

      // Trier les rapports par date
      rapportsGeneres.sort((a, b) => a.mois.localeCompare(b.mois));
      setRapportsMensuels(rapportsGeneres);
    };

    genererRapportsMensuels();
  }, [anneeScolaireSelectionnee, moisSelectionne, enfants, paiements]);

  return rapportsMensuels;
};
