
import { useState, useEffect } from "react";
import { PaiementMensuel } from "@/types/dashboard.types";
import { calculerPaiementsMensuels } from "@/utils/dashboardCalculations";

export function usePaiementsMensuels(
  paiements: any[],
  anneeScolaire: string,
  fraisInscriptionParMois: Record<string, number>,
  refreshTrigger: number
) {
  const [paiementsMensuels, setPaiementsMensuels] = useState<PaiementMensuel[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const processPaiementsMensuels = () => {
      try {
        console.log(`Calculating monthly payments for school year: ${anneeScolaire}`);
        
        if (!paiements || paiements.length === 0) {
          setPaiementsMensuels([]);
          return;
        }
        
        const donneesParMois = calculerPaiementsMensuels(
          paiements,
          anneeScolaire,
          fraisInscriptionParMois
        );
        
        console.log("Data per month calculated:", donneesParMois);
        setPaiementsMensuels(donneesParMois);
      } catch (err) {
        console.error("Error calculating paiements mensuels:", err);
        setError(err instanceof Error ? err : new Error("Failed to calculate monthly payments"));
        setPaiementsMensuels([]);
      }
    };
    
    processPaiementsMensuels();
  }, [paiements, anneeScolaire, fraisInscriptionParMois, refreshTrigger]);

  return { paiementsMensuels, error };
}
