
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSchoolYearDateRange } from "@/lib/dateUtils";
import { getFraisInscriptionParMois } from "@/utils/dashboardCalculations";

export function useFraisInscription(
  enfants: any[],
  anneeScolaire: string,
  refreshTrigger: number
) {
  const [totalFraisInscription, setTotalFraisInscription] = useState(0);
  const [fraisInscriptionParMois, setFraisInscriptionParMois] = useState<Record<string, number>>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getFraisInscription = async () => {
      try {
        console.log(`Fetching inscription fees for school year: ${anneeScolaire}`);
        setTotalFraisInscription(0);
        setFraisInscriptionParMois({});

        // Normalize year format to handle both formats (2025-2026 and 2025/2026)
        const normalizedAnneeScolaire = anneeScolaire.replace('/', '-');

        // Get all enfant IDs for the current school year
        const enfantIds = enfants
          .filter(e => {
            const normalizedEnfantAnnee = e.anneeScolaire?.replace('/', '-') || '';
            return normalizedEnfantAnnee === normalizedAnneeScolaire || !e.anneeScolaire;
          })
          .map(e => e.id);

        console.log(`Found ${enfantIds.length} enfants for school year ${anneeScolaire}`);
        
        if (enfantIds.length === 0) {
          return;
        }

        // Fetch all paiements_inscription for these enfants
        const { data, error } = await supabase
          .from('paiements_inscription')
          .select('montant, date_paiement')
          .in('enfant_id', enfantIds);

        if (error) {
          console.error('Erreur lors de la récupération des frais d\'inscription:', error);
          throw error;
        }

        console.log(`Retrieved ${data?.length || 0} inscription payments`);
        
        // Ensure all data has numeric montant values
        const validatedData = data?.map(item => ({
          ...item,
          montant: typeof item.montant === 'number' ? item.montant : Number(item.montant) || 0
        })) || [];
        
        // Filter to only include payments within this school year
        const { start, end } = getSchoolYearDateRange(normalizedAnneeScolaire);
        const filteredData = validatedData.filter(p => {
          if (!p.date_paiement) return false;
          const paymentDate = new Date(p.date_paiement);
          return paymentDate >= start && paymentDate <= end;
        });

        console.log(`Filtered to ${filteredData.length} payments within school year ${anneeScolaire}`);
        
        // Calculate total inscription fees
        const total = filteredData.reduce((sum, p) => sum + p.montant, 0);
        setTotalFraisInscription(total);
        console.log(`Total inscription fees: ${total}`);
        
        // Calculate fees by month
        const parMois = getFraisInscriptionParMois(filteredData, normalizedAnneeScolaire);
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
  }, [anneeScolaire, enfants, refreshTrigger]);

  return { totalFraisInscription, fraisInscriptionParMois, error };
}
