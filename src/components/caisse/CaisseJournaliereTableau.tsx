
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableauHeader } from "./TableauHeader";
import { TableauActions } from "./TableauActions";
import { PaiementsDetailParDate } from "./PaiementsDetailParDate";
import { CaisseSummaryTable } from "./CaisseSummaryTable";
import { useCaisseJournaliere } from "@/hooks/caisse/useCaisseJournaliere";

interface CaisseJournaliereTableauProps {
  onTotalUpdate?: (total: number) => void;
}

export function CaisseJournaliereTableau({ onTotalUpdate }: CaisseJournaliereTableauProps) {
  const {
    loading,
    error,
    totalJour,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    getCaisseData,
  } = useCaisseJournaliere();

  // Pass total to parent component if needed
  if (onTotalUpdate) {
    onTotalUpdate(totalJour);
  }

  if (loading) return <div>Chargement...</div>;

  const caisseData = getCaisseData();

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
              <CaisseSummaryTable paiementsByMethod={caisseData.paiementsByMethod} />
              
              <TableauActions
                totalJour={caisseData.totalGeneral}
                onExport={() => console.log("Export data")}
              />
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Détail des paiements par date</h3>
                <PaiementsDetailParDate paiementsParDate={caisseData.paiementsByDate} />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
