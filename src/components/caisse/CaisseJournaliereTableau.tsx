
import { Card, CardContent } from "@/components/ui/card";
import { CaisseJournaliereHeader } from "./CaisseJournaliereHeader";
import { TableauHeader } from "./TableauHeader";
import { TableauActions } from "./TableauActions";
import { PaiementsDetailParDate } from "./PaiementsDetailParDate";
import { CaisseSummaryTable } from "./CaisseSummaryTable";
import { useCaisseJournaliere } from "@/hooks/caisse/useCaisseJournaliere";
import { useState } from "react";

export function CaisseJournaliereTableau() {
  const [searchTerm, setSearchTerm] = useState("");
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="flex items-center justify-center p-8">Chargement...</div>;

  const caisseData = getCaisseData();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <CaisseJournaliereHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onPrint={handlePrint}
          />
          
          <TableauHeader
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          
          {error ? (
            <div className="text-destructive p-4 rounded-md bg-destructive/10 border border-destructive/20">
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
