
import { useState, useCallback, useEffect } from "react";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { DashboardData } from "@/types/dashboard.types";
import { calculateDashboardStats } from "@/utils/dashboardCalculations";
import { useFraisInscription } from "@/hooks/useFraisInscription";
import { usePaiementsMensuels } from "@/hooks/usePaiementsMensuels";

export function useDashboardData(dateDebut?: Date, dateFin?: Date): DashboardData {
  const { enfants, fetchEnfants } = useEnfantStore();
  const { paiements, fetchPaiements } = usePaiementStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // For backwards compatibility - use current school year for frais d'inscription calculation
  const currentAnneeScolaire = new Date().getFullYear() + "-" + (new Date().getFullYear() + 1);
  
  // Get frais d'inscription data
  const { 
    totalFraisInscription, 
    fraisInscriptionParMois, 
    error: fraisInscriptionError 
  } = useFraisInscription(enfants, currentAnneeScolaire, lastFetchTime);

  // Get paiements mensuels data
  const { 
    paiementsMensuels, 
    error: paiementsMensuelsError 
  } = usePaiementsMensuels(paiements, currentAnneeScolaire, fraisInscriptionParMois, lastFetchTime);

  // Filter enfants based on date range
  const enfantsFiltres = useCallback(() => {
    console.log("Filtering enfants with dates:", { dateDebut, dateFin });
    
    return enfants.filter(enfant => {
      if (!dateDebut && !dateFin) return true;
      
      const dateInscription = enfant.dateInscription ? new Date(enfant.dateInscription) : null;
      
      if (!dateInscription) return true;
      
      if (dateDebut && dateFin) {
        return dateInscription >= dateDebut && dateInscription <= dateFin;
      } else if (dateDebut) {
        return dateInscription >= dateDebut;
      } else if (dateFin) {
        return dateInscription <= dateFin;
      }
      
      return true;
    });
  }, [enfants, dateDebut, dateFin]);

  const filteredEnfants = enfantsFiltres();
  
  // Calculate derived data with defensive coding
  const stats = calculateDashboardStats(filteredEnfants, paiementsMensuels, totalFraisInscription);

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
      console.log("Dashboard data reloaded with date filters:", { dateDebut, dateFin });
    } catch (err) {
      console.error("Error reloading dashboard data:", err);
      setError(err instanceof Error ? err : new Error("Failed to reload dashboard data"));
    } finally {
      setIsLoading(false);
    }
  }, [fetchEnfants, fetchPaiements, dateDebut, dateFin]);

  return {
    isLoading,
    error: combinedError,
    enfantsFiltres: filteredEnfants,
    enfantsActifs: stats.enfantsActifs,
    totalMensualites: stats.totalMensualites,
    totalFraisInscription,
    totalPaiements: stats.totalPaiements,
    moyennePaiements: stats.moyennePaiements,
    paiementsMensuels,
    reloadData
  };
}
