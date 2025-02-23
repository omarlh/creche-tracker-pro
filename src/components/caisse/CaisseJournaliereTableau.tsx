
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableauHeader } from "./TableauHeader";
import { TableauLigne } from "./TableauLigne";
import { TableauActions } from "./TableauActions";
import { CaisseWhatsAppButton } from "./CaisseWhatsAppButton";

export function CaisseJournaliereTableau() {
  const [paiements, setPaiements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJour, setTotalJour] = useState(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchPaiements();
  }, [startDate, endDate]);

  const fetchPaiements = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('paiements')
        .select('*')
        .eq('date_paiement', today);

      if (error) throw error;

      setPaiements(data || []);
      const total = (data || []).reduce((sum: number, paiement: any) => sum + (paiement.montant || 0), 0);
      setTotalJour(total);
    } catch (err) {
      setError('Erreur lors du chargement des paiements');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    // Implement Excel export functionality
    console.log("Export to Excel");
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight">Caisse Journalière</h2>
          <CaisseWhatsAppButton totalJour={totalJour} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TableauHeader
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          {paiements.map((paiement) => (
            <TableauLigne
              key={paiement.id}
              methode={paiement.methode_paiement}
              montant={paiement.montant}
            />
          ))}
          <TableauActions
            totalPaiements={totalJour}
            onPrint={handlePrint}
            onExportExcel={handleExportExcel}
          />
        </div>
      </CardContent>
    </Card>
  );
}
