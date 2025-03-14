
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CaissePaiement, CaisseReportData } from "@/types/caisse.types";

export function useCaisseJournaliere() {
  const [paiements, setPaiements] = useState<CaissePaiement[]>([]);
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
      
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      console.log("Date range for paiements:", { formattedStartDate, formattedEndDate });
      
      // Get regular payments (scolarite)
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

      // Format all payments and add type information
      const formattedPaiements: CaissePaiement[] = [
        ...(paiementsData?.map(p => ({ ...p, type: 'scolarite' as const })) || []),
        ...(inscriptionsData?.map(p => ({ ...p, type: 'inscription' as const })) || [])
      ];

      console.log("Paiements récupérés:", formattedPaiements);
      setPaiements(formattedPaiements);
      
      const total = formattedPaiements.reduce((sum, paiement) => {
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
      
      if (paiement.type === 'inscription') {
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

  const getCaisseData = (): CaisseReportData => {
    const paiementsByDate = groupPaiementsByDate();
    const paiementsByMethod = groupPaiementsByMethod();
    
    const totalScolarite = paiements
      .filter(p => p.type === 'scolarite')
      .reduce((sum, p) => sum + (typeof p.montant === 'number' ? p.montant : 0), 0);
      
    const totalInscription = paiements
      .filter(p => p.type === 'inscription')
      .reduce((sum, p) => sum + (typeof p.montant === 'number' ? p.montant : 0), 0);

    return {
      paiements,
      totalScolarite,
      totalInscription,
      totalGeneral: totalJour,
      paiementsByMethod,
      paiementsByDate
    };
  };

  return {
    loading,
    error,
    totalJour,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    groupPaiementsByMethod,
    groupPaiementsByDate,
    getCaisseData
  };
}
