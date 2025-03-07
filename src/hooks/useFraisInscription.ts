
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
        
        const parMois = getFraisInscriptionParMois(filteredData, anneeScolaire);
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
