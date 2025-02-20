
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

      // Récupérer les frais d'inscription pour l'année scolaire
      const debutAnneeScolaire = `${anneeDebut}-09-01`;
      const finAnneeScolaire = `${anneeFin}-07-31`;

      const { data: fraisInscription, error: fraisError } = await supabase
        .from('paiements_inscription')
        .select('*')
        .gte('date_paiement', debutAnneeScolaire)
        .lte('date_paiement', finAnneeScolaire)
        .order('date_paiement', { ascending: true });

      if (fraisError) {
        console.error("Erreur lors de la récupération des frais d'inscription:", fraisError);
      }

      for (const date of moisAGenerer) {
        if (date.getMonth() !== 7) {  // Exclure juillet
          const moisCourant = date.toISOString().slice(0, 7);

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
