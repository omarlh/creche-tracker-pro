
import { useState, useCallback, useEffect } from "react";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { DashboardData } from "@/types/dashboard.types";
import { calculateDashboardStats } from "@/utils/dashboardCalculations";
import { useFraisInscription } from "@/hooks/useFraisInscription";
import { usePaiementsMensuels } from "@/hooks/usePaiementsMensuels";

export function useDashboardData(): DashboardData {
  const { enfants, fetchEnfants } = useEnfantStore();
  const { paiements, fetchPaiements } = usePaiementStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // Get current school year for calculations
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed
  const currentAnneeScolaire = currentMonth >= 8 
    ? `${currentYear}-${currentYear + 1}` 
    : `${currentYear - 1}-${currentYear}`;
  
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
  
  // Calculate derived data with defensive coding
  const stats = calculateDashboardStats(enfants, paiementsMensuels, totalFraisInscription);

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
    enfantsFiltres: enfants,
    enfantsActifs: stats.enfantsActifs,
    totalMensualites: stats.totalMensualites,
    totalFraisInscription,
    totalPaiements: stats.totalPaiements,
    moyennePaiements: stats.moyennePaiements,
    paiementsMensuels,
    reloadData
  };
}
