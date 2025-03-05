
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableauHeader } from "./TableauHeader";
import { TableauLigne } from "./TableauLigne";
import { TableauActions } from "./TableauActions";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CaisseJournaliereTableauProps {
  onTotalUpdate?: (total: number) => void;
}

export function CaisseJournaliereTableau({ onTotalUpdate }: CaisseJournaliereTableauProps) {
  const [paiements, setPaiements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJour, setTotalJour] = useState(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    fetchPaiements();
  }, [startDate, endDate]);

  useEffect(() => {
    if (onTotalUpdate) {
      onTotalUpdate(totalJour);
    }
  }, [totalJour, onTotalUpdate]);

  const fetchPaiements = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching paiements...");
      
      // Format dates correctly for Supabase query
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      // Updated query to fetch payments between the selected date range
      const { data, error } = await supabase
        .from('paiements')
        .select('*')
        .gte('date_paiement', formattedStartDate)
        .lte('date_paiement', formattedEndDate);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log("Paiements récupérés:", data);
      setPaiements(data || []);
      
      // Calculate the correct total
      const total = (data || []).reduce((sum: number, paiement: any) => sum + (parseFloat(paiement.montant) || 0), 0);
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

  if (loading) return <div>Chargement...</div>;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-3xl font-bold tracking-tight">Caisse Journalière</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TableauHeader
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          {error ? (
            <div className="text-red-500 p-4 rounded-md bg-red-50">
              {error}
            </div>
          ) : (
            <>
              {paiements.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Aucun paiement trouvé pour cette période
                </div>
              ) : (
                paiements.map((paiement) => (
                  <TableauLigne
                    key={paiement.id}
                    methode={paiement.methode_paiement}
                    montant={paiement.montant}
                  />
                ))
              )}
              <TableauActions
                totalJour={totalJour}
                onExport={() => console.log("Export data")}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
