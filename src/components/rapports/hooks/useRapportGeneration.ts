
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
  anneeScolaire: string = "2024-2025",
  refreshTrigger: number = 0
) => {
  const [rapportsMensuels, setRapportsMensuels] = useState<RapportMensuel[]>([]);

  useEffect(() => {
    const genererRapports = async () => {
      console.log("Générant rapports avec dates:", { dateDebut, dateFin });
      
      // Convert string dates to Date objects for comparison
      const dateDebutObj = new Date(dateDebut);
      // Set dateFin to end of day for inclusive comparison
      const dateFinObj = new Date(dateFin);
      dateFinObj.setHours(23, 59, 59, 999);
      
      // Filtrer les enfants par date d'inscription et année scolaire
      const enfantsInscrits = enfants.filter(enfant => {
        const dateInscription = enfant.dateInscription ? new Date(enfant.dateInscription) : null;
        const dateFinInscription = enfant.dateFinInscription ? new Date(enfant.dateFinInscription) : null;
        
        if (!dateInscription) return false;
        
        const isWithinDateRange = dateInscription >= dateDebutObj && 
                                 (!dateFinObj || dateInscription <= dateFinObj);
        
        const isCorrectYear = enfant.anneeScolaire === anneeScolaire;
        
        return isWithinDateRange && isCorrectYear;
      });

      console.log(`Filtered to ${enfantsInscrits.length} enfants within date range`);

      // Récupérer tous les frais d'inscription pour la période
      const { data: fraisInscription, error: fraisError } = await supabase
        .from('paiements_inscription')
        .select('*')
        .in('enfant_id', enfantsInscrits.map(e => e.id))
        .gte('date_paiement', dateDebut)
        .lte('date_paiement', dateFin);

      if (fraisError) {
        console.error("Erreur lors de la récupération des frais d'inscription:", fraisError);
        return;
      }

      console.log(`Retrieved ${fraisInscription?.length || 0} frais d'inscription`);

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

      // Filtrer les paiements par date
      const paiementsFiltres = paiements.filter(p => {
        const datePaiement = p.datePaiement ? new Date(p.datePaiement) : null;
        if (!datePaiement) return false;
        
        return datePaiement >= dateDebutObj && datePaiement <= dateFinObj && 
               p.anneeScolaire === anneeScolaire;
      });

      console.log(`Filtered to ${paiementsFiltres.length} paiements within date range`);

      // Traiter les paiements mensuels
      paiementsFiltres.forEach(paiement => {
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
        
        // Ensure montant is treated as a number
        const montant = typeof frais.montant === 'number' 
          ? frais.montant 
          : parseFloat(frais.montant as any) || 0;
          
        rapport.totalFraisInscription += montant;
      });

      // Calculer les statistiques finales
      paiementsParDate.forEach(rapport => {
        rapport.enfantsNonPaye = enfantsInscrits
          .filter(e => e.dateInscription === rapport.mois && !rapport.enfantsPaye.includes(e.id))
          .map(e => e.id);
          
        rapport.paiementsComplets = rapport.enfantsPaye.length;
        rapport.paiementsAttente = rapport.enfantsNonPaye.length;
        rapport.tauxRecouvrement = rapport.nombreEnfants > 0
          ? (rapport.paiementsComplets / rapport.nombreEnfants) * 100
          : 0;
      });

      // Convertir le Map en tableau et trier par date
      const rapports = Array.from(paiementsParDate.values()).sort((a, b) => 
        new Date(a.mois).getTime() - new Date(b.mois).getTime()
      );

      console.log("Generated reports:", rapports);
      setRapportsMensuels(rapports);
    };

    genererRapports();
  }, [dateDebut, dateFin, enfants, paiements, anneeScolaire, refreshTrigger]);

  return rapportsMensuels;
};
