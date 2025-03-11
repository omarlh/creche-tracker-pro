
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
          // Initialize with empty data for all months
          const moisScolaires = [
            "Septembre", "Octobre", "Novembre", "Décembre",
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
          ];
          
          const emptyData = moisScolaires.map(mois => ({
            mois,
            total: 0,
            fraisInscription: fraisInscriptionParMois[mois] || 0,
            nbPaiements: 0
          }));
          
          setPaiementsMensuels(emptyData);
          return;
        }
        
        // Make sure all paiements have correct numeric values
        const validatedPaiements = paiements.map(p => ({
          ...p,
          montant: typeof p.montant === 'number' ? p.montant : Number(p.montant) || 0,
          datePaiement: p.datePaiement || p.date_paiement
        }));
        
        // Normalize year format to handle both formats (2025-2026 and 2025/2026)
        const normalizedAnneeScolaire = anneeScolaire.replace('/', '-');
        
        const donneesParMois = calculerPaiementsMensuels(
          validatedPaiements,
          normalizedAnneeScolaire,
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
