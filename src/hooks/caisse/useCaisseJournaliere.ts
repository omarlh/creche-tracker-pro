
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Paiement = {
  id: number;
  montant: number;
  date_paiement: string;
  methode_paiement: string;
};

export function useCaisseJournaliere() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJour, setTotalJour] = useState(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    fetchPaiements();
  }, [startDate, endDate]);

  const fetchPaiements = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching paiements...");
      
      // Format dates correctly for Supabase query
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      // Add one day to end date to make it inclusive
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      console.log("Date range for paiements:", { formattedStartDate, formattedEndDate });
      
      // Get regular payments
      const { data: paiementsData, error: paiementsError } = await supabase
        .from('paiements')
        .select('id, montant, date_paiement, methode_paiement')
        .gte('date_paiement', formattedStartDate)
        .lte('date_paiement', formattedEndDate);

      if (paiementsError) {
        console.error('Erreur Supabase (paiements):', paiementsError);
        throw paiementsError;
      }

      // Get inscription payments
      const { data: inscriptionsData, error: inscriptionsError } = await supabase
        .from('paiements_inscription')
        .select('id, montant, date_paiement, methode_paiement')
        .gte('date_paiement', formattedStartDate)
        .lte('date_paiement', formattedEndDate);

      if (inscriptionsError) {
        console.error('Erreur Supabase (paiements_inscription):', inscriptionsError);
        throw inscriptionsError;
      }

      // Combine all payments
      const allPaiements = [
        ...(paiementsData || []),
        ...(inscriptionsData || [])
      ];

      console.log("Paiements récupérés:", allPaiements);
      setPaiements(allPaiements);
      
      // Calculate the total correctly
      const total = allPaiements.reduce((sum, paiement) => {
        const montant = typeof paiement.montant === 'number' 
          ? paiement.montant 
          : parseFloat(paiement.montant as any) || 0;
        return sum + montant;
      }, 0);
      
      console.log("Total calculé:", total);
      setTotalJour(total);
      
    } catch (err: any) {
      console.error('Erreur complète:', err);
      setError('Erreur lors du chargement des paiements');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les paiements. Veuillez réessayer."
      });
    } finally {
      setLoading(false);
    }
  };

  // Utility functions for grouping payments
  const groupPaiementsByMethod = () => {
    const grouped: Record<string, number> = {};
    
    paiements.forEach(paiement => {
      const method = paiement.methode_paiement || 'Autre';
      const montant = typeof paiement.montant === 'number' 
        ? paiement.montant 
        : parseFloat(paiement.montant as any) || 0;
      
      if (!grouped[method]) {
        grouped[method] = 0;
      }
      grouped[method] += montant;
    });
    
    return Object.entries(grouped).map(([methode, montant]) => ({
      methode,
      montant
    }));
  };

  // Group paiements by date for the detailed view
  const groupPaiementsByDate = () => {
    const grouped: Record<string, {
      totalScolarite: number,
      totalInscription: number,
      totalGeneral: number,
      date: string
    }> = {};
    
    paiements.forEach(paiement => {
      const date = paiement.date_paiement;
      const montant = typeof paiement.montant === 'number' 
        ? paiement.montant 
        : parseFloat(paiement.montant as any) || 0;
      
      if (!grouped[date]) {
        grouped[date] = {
          totalScolarite: 0,
          totalInscription: 0,
          totalGeneral: 0,
          date: date
        };
      }
      
      // Assuming payments from 'paiements' table are school fees
      // and payments from 'paiements_inscription' are registration fees
      // We'll determine which is which by checking if the payment has a specific property
      const isInscription = !paiement.hasOwnProperty('mois_concerne');
      
      if (isInscription) {
        grouped[date].totalInscription += montant;
      } else {
        grouped[date].totalScolarite += montant;
      }
      
      grouped[date].totalGeneral += montant;
    });
    
    return Object.values(grouped).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  return {
    paiements,
    loading,
    error,
    totalJour,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    groupPaiementsByMethod,
    groupPaiementsByDate
  };
}
