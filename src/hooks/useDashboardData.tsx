
import { useState, useEffect, useCallback } from "react";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { supabase } from "@/integrations/supabase/client";
import {
  getMoisAnneeScolaire,
  getSchoolYearDateRange,
  isDateInSchoolYear
} from "@/lib/dateUtils";

export interface PaiementMensuel {
  mois: string;
  total: number;
  fraisInscription: number;
  nbPaiements: number;
}

export function useDashboardData(anneeScolaire: string) {
  const { enfants, fetchEnfants } = useEnfantStore();
  const { paiements, fetchPaiements } = usePaiementStore();
  const [totalFraisInscription, setTotalFraisInscription] = useState(0);
  const [paiementsMensuels, setPaiementsMensuels] = useState<PaiementMensuel[]>([]);
  const [fraisInscriptionParMois, setFraisInscriptionParMois] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await Promise.all([fetchEnfants(), fetchPaiements()]);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(err instanceof Error ? err : new Error("Failed to load dashboard data"));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchEnfants, fetchPaiements]);

  // Calculate frais d'inscription based on anneeScolaire
  useEffect(() => {
    const getFraisInscription = async () => {
      try {
        console.log(`Fetching inscription fees for school year: ${anneeScolaire}`);
        setTotalFraisInscription(0);
        setFraisInscriptionParMois({});

        const enfantIds = enfants
          .filter(e => e.anneeScolaire === anneeScolaire)
          .map(e => e.id);

        console.log(`Found ${enfantIds.length} enfants for school year ${anneeScolaire}`);
        
        if (enfantIds.length === 0) {
          return;
        }

        const { data, error } = await supabase
          .from('paiements_inscription')
          .select('montant, date_paiement')
          .in('enfant_id', enfantIds);

        if (error) {
          console.error('Erreur lors de la récupération des frais d\'inscription:', error);
          throw error;
        }

        console.log(`Retrieved ${data.length} inscription payments`);
        
        const { start, end } = getSchoolYearDateRange(anneeScolaire);
        const filteredData = data.filter(p => {
          const paymentDate = new Date(p.date_paiement);
          return paymentDate >= start && paymentDate <= end;
        });

        console.log(`Filtered to ${filteredData.length} payments within school year ${anneeScolaire}`);
        
        const total = filteredData.reduce((sum, p) => sum + (Number(p.montant) || 0), 0);
        setTotalFraisInscription(total);

        console.log(`Total inscription fees: ${total}`);
        
        const parMois: Record<string, number> = {};
        const moisScolaires = getMoisAnneeScolaire();
        
        filteredData.forEach(p => {
          const date = new Date(p.date_paiement);
          let moisIndex;
          
          if (date.getMonth() >= 8) { // Septembre à Décembre
            moisIndex = date.getMonth() - 8;
          } else if (date.getMonth() <= 5) { // Janvier à Juin
            moisIndex = date.getMonth() + 4;
          } else {
            return; // Ignore July and August
          }
          
          if (moisIndex >= 0 && moisIndex < moisScolaires.length) {
            const moisNom = moisScolaires[moisIndex];
            parMois[moisNom] = (parMois[moisNom] || 0) + (Number(p.montant) || 0);
          }
        });
        
        setFraisInscriptionParMois(parMois);
        console.log("Frais inscription par mois:", parMois);
      } catch (err) {
        console.error("Error processing frais d'inscription:", err);
        setError(err instanceof Error ? err : new Error("Failed to process inscription fees"));
      }
    };

    if (enfants && enfants.length > 0) {
      getFraisInscription();
    }
  }, [anneeScolaire, enfants, lastFetchTime]);

  // Calculate paiements mensuels
  useEffect(() => {
    const calculerPaiementsMensuels = () => {
      try {
        console.log(`Calculating monthly payments for school year: ${anneeScolaire}`);
        const moisScolaires = getMoisAnneeScolaire();
        
        const paiementsAnnee = paiements.filter(p => {
          // Filter by explicit année scolaire if available
          if (p.anneeScolaire === anneeScolaire) {
            return true;
          }
          // Otherwise check if the date falls within the school year
          const datePaiement = new Date(p.datePaiement);
          return isDateInSchoolYear(datePaiement, anneeScolaire);
        });
        
        console.log(`Found ${paiementsAnnee.length} payments for school year ${anneeScolaire}`);
        
        const donneesParMois = moisScolaires.map((mois, index) => {
          const [anneeDebut, anneeFin] = anneeScolaire.split('-').map(y => parseInt(y));
          const moisNum = index <= 3 ? index + 8 : index - 4;
          const annee = index <= 3 ? anneeDebut : anneeFin;
          
          const dateDebut = new Date(annee, moisNum, 1);
          const dateFin = new Date(annee, moisNum + 1, 0);
          
          const paiementsMois = paiementsAnnee.filter(p => {
            const datePaiement = new Date(p.datePaiement);
            return datePaiement >= dateDebut && datePaiement <= dateFin;
          });
          
          const totalMois = paiementsMois.reduce((sum, p) => sum + Number(p.montant), 0);
          const fraisInscription = fraisInscriptionParMois[mois] || 0;
          
          return {
            mois,
            total: totalMois,
            fraisInscription,
            nbPaiements: paiementsMois.length
          };
        });
        
        console.log("Data per month calculated:", donneesParMois);
        setPaiementsMensuels(donneesParMois);
      } catch (err) {
        console.error("Error calculating paiements mensuels:", err);
        setError(err instanceof Error ? err : new Error("Failed to calculate monthly payments"));
        setPaiementsMensuels([]);
      }
    };
    
    if (paiements && paiements.length > 0) {
      calculerPaiementsMensuels();
    } else {
      setPaiementsMensuels([]);
    }
  }, [paiements, anneeScolaire, fraisInscriptionParMois, lastFetchTime]);

  // Calculate derived data with defensive coding
  const enfantsFiltres = enfants.filter(e => e.anneeScolaire === anneeScolaire);
  const enfantsActifs = enfantsFiltres.filter(e => e.statut === "actif").length;
  const totalMensualites = paiementsMensuels.reduce((sum, m) => sum + m.total, 0) || 0;
  const totalPaiements = totalMensualites + totalFraisInscription;
  const moyennePaiements = enfantsActifs ? (totalPaiements / enfantsActifs).toFixed(2) : "0";

  // Improved reloadData function with better error handling
  const reloadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Reset states to avoid stale data
      setPaiementsMensuels([]);
      setTotalFraisInscription(0);
      setFraisInscriptionParMois({});
      
      // Fetch fresh data
      await Promise.all([fetchEnfants(), fetchPaiements()]);
      
      // Update the lastFetchTime to trigger the useEffects
      setLastFetchTime(Date.now());
      console.log("Dashboard data reloaded for year:", anneeScolaire);
    } catch (err) {
      console.error("Error reloading dashboard data:", err);
      setError(err instanceof Error ? err : new Error("Failed to reload dashboard data"));
    } finally {
      setIsLoading(false);
    }
  }, [fetchEnfants, fetchPaiements, anneeScolaire]);

  return {
    isLoading,
    error,
    enfantsFiltres,
    enfantsActifs,
    totalMensualites,
    totalFraisInscription,
    totalPaiements,
    moyennePaiements,
    paiementsMensuels,
    reloadData
  };
}
