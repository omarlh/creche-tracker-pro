
import { useState, useCallback, useEffect } from "react";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { DashboardData } from "@/types/dashboard.types";
import { calculateDashboardStats } from "@/utils/dashboardCalculations";
import { useFraisInscription } from "@/hooks/useFraisInscription";
import { usePaiementsMensuels } from "@/hooks/usePaiementsMensuels";
import { getCurrentSchoolYear } from "@/lib/dateUtils";

// Fonction utilitaire pour normaliser les années scolaires
const normalizeSchoolYear = (year: string | undefined): string => {
  if (!year) return "";
  // Remplacer les / par des - et s'assurer qu'il n'y a pas d'espaces
  return year.trim().replace('/', '-');
};

export function useDashboardData(anneeScolaire?: string): DashboardData {
  const { enfants, fetchEnfants } = useEnfantStore();
  const { paiements, fetchPaiements } = usePaiementStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // Get current school year for calculations if not provided
  const currentAnneeScolaire = anneeScolaire || getCurrentSchoolYear();
  
  // Normaliser l'année scolaire sélectionnée pour les comparaisons
  const normalizedSelectedYear = normalizeSchoolYear(currentAnneeScolaire);
  
  // Get frais d'inscription data
  const { 
    totalFraisInscription, 
    fraisInscriptionParMois, 
    error: fraisInscriptionError 
  } = useFraisInscription(enfants, normalizedSelectedYear, lastFetchTime);

  // Get paiements mensuels data
  const { 
    paiementsMensuels, 
    error: paiementsMensuelsError 
  } = usePaiementsMensuels(paiements, normalizedSelectedYear, fraisInscriptionParMois, lastFetchTime);
  
  // Filter enfants by the selected school year with proper normalization
  const enfantsFiltres = enfants.filter(enfant => {
    if (!normalizedSelectedYear) return true;
    
    // Normaliser l'année scolaire de l'enfant pour la comparaison
    const normalizedEnfantAnnee = normalizeSchoolYear(enfant.anneeScolaire);
    
    console.log(`Comparing years - Enfant ${enfant.id} (${enfant.prenom} ${enfant.nom}):`, {
      enfantYear: enfant.anneeScolaire,
      normalizedEnfantYear: normalizedEnfantAnnee,
      selectedYear: normalizedSelectedYear,
      matches: normalizedEnfantAnnee === normalizedSelectedYear
    });
    
    return normalizedEnfantAnnee === normalizedSelectedYear;
  });

  console.log(`Total enfants: ${enfants.length}, Filtered enfants: ${enfantsFiltres.length} for year ${normalizedSelectedYear}`);

  // Calculate derived data with defensive coding
  const stats = calculateDashboardStats(enfantsFiltres, paiementsMensuels, totalFraisInscription);

  // Log values for debugging
  useEffect(() => {
    console.log("Dashboard data calculated:", {
      totalFraisInscription,
      paiementsMensuels,
      enfantsActifs: stats.enfantsActifs,
      totalMensualites: stats.totalMensualites,
      totalPaiements: stats.totalPaiements,
      enfantsFiltres: enfantsFiltres.map(e => ({ 
        id: e.id, 
        nom: e.nom, 
        prenom: e.prenom, 
        anneeScolaire: e.anneeScolaire 
      }))
    });
  }, [totalFraisInscription, paiementsMensuels, stats, enfantsFiltres]);

  // Combine errors
  const combinedError = fraisInscriptionError || paiementsMensuelsError || error;

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

  // Improved reloadData function with better error handling
  const reloadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch fresh data
      await Promise.all([fetchEnfants(), fetchPaiements()]);
      
      // Update the lastFetchTime to trigger the useEffects
      setLastFetchTime(Date.now());
      console.log("Dashboard data reloaded");
    } catch (err) {
      console.error("Error reloading dashboard data:", err);
      setError(err instanceof Error ? err : new Error("Failed to reload dashboard data"));
    } finally {
      setIsLoading(false);
    }
  }, [fetchEnfants, fetchPaiements]);

  return {
    isLoading,
    error: combinedError,
    enfantsFiltres,
    enfantsActifs: stats.enfantsActifs,
    totalMensualites: stats.totalMensualites,
    totalFraisInscription,
    totalPaiements: stats.totalPaiements,
    moyennePaiements: stats.moyennePaiements,
    paiementsMensuels,
    reloadData
  };
}
