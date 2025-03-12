
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableauHeader } from "./TableauHeader";
import { TableauLigne } from "./TableauLigne";
import { TableauActions } from "./TableauActions";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { PaiementsDetailParDate } from "./PaiementsDetailParDate";

interface CaisseJournaliereTableauProps {
  onTotalUpdate?: (total: number) => void;
}

type Paiement = {
  id: number;
  montant: number;
  date_paiement: string;
  methode_paiement: string;
};

export function CaisseJournaliereTableau({ onTotalUpdate }: CaisseJournaliereTableauProps) {
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
                <div className="border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Méthode de paiement</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupPaiementsByMethod().map((item, index) => (
                        <TableauLigne
                          key={index}
                          methode={item.methode}
                          montant={item.montant}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <TableauActions
                totalJour={totalJour}
                onExport={() => console.log("Export data")}
              />
              
              {/* Detailed payments by date */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Détail des paiements par date</h3>
                <PaiementsDetailParDate paiementsParDate={groupPaiementsByDate()} />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
