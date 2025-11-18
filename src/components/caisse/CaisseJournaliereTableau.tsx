
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

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Chargement des données...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <div className="text-destructive p-6 rounded-md bg-destructive/10 border border-destructive/20">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-destructive text-sm font-bold">!</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Erreur de connexion</h4>
                    <p className="text-sm">{error}</p>
                    <p className="text-sm mt-2 text-muted-foreground">
                      Vérifiez que votre instance Cloud est démarrée dans les paramètres.
                    </p>
                  </div>
                </div>
              </div>
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
