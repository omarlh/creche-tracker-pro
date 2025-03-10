
import { useState, useEffect, useCallback } from "react"
import { DashboardCards } from "@/components/dashboard/DashboardCards"
import { PaiementsChart } from "@/components/dashboard/PaiementsChart"
import { PaiementsTable } from "@/components/dashboard/PaiementsTable"
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter"
import { useDashboardData } from "@/hooks/useDashboardData"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentSchoolYear } from "@/lib/dateUtils"

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const { toast } = useToast();
  const currentYear = getCurrentSchoolYear();
  
  // Calculate date range based on month/year selection
  const getDateRange = useCallback(() => {
    let dateDebut: Date | undefined = undefined;
    let dateFin: Date | undefined = undefined;
    
    if (selectedMonth !== "all" || selectedYear !== "all") {
      const year = selectedYear === "all" ? new Date().getFullYear() : parseInt(selectedYear);
      
      if (selectedMonth !== "all") {
        // If month is selected, set date range to that month
        const month = parseInt(selectedMonth) - 1; // JS months are 0-based
        dateDebut = new Date(year, month, 1);
        dateFin = new Date(year, month + 1, 0); // Last day of the month
      } else {
        // If only year is selected, set date range to that year
        dateDebut = new Date(year, 0, 1);
        dateFin = new Date(year, 11, 31);
      }
    }
    
    return { dateDebut, dateFin };
  }, [selectedMonth, selectedYear]);
  
  const { dateDebut, dateFin } = getDateRange();
  
  // Get dashboard data with date filters
  const {
    isLoading,
    error,
    enfantsFiltres,
    enfantsActifs,
    totalMensualites,
    totalFraisInscription,
    totalPaiements,
    moyennePaiements,
    paiementsMensuels,
    reloadData
  } = useDashboardData(dateDebut, dateFin);

  // Reload data when filters change
  useEffect(() => {
    console.log("Filters changed:", { selectedMonth, selectedYear, dateDebut, dateFin });
    reloadData();
  }, [selectedMonth, selectedYear, dateDebut, dateFin, reloadData]);

  const handleMonthChange = useCallback((month: string) => {
    console.log("Month selected:", month);
    setSelectedMonth(month);
    
    toast({
      title: month === "all" ? "Tous les mois sélectionnés" : "Mois sélectionné",
      description: month === "all" 
        ? "Affichage des données pour tous les mois" 
        : `Affichage des données pour le mois ${new Date(2000, parseInt(month) - 1).toLocaleString('fr-FR', { month: 'long' })}`,
    });
  }, [toast]);

  const handleYearChange = useCallback((year: string) => {
    console.log("Year selected:", year);
    setSelectedYear(year);
    
    toast({
      title: year === "all" ? "Toutes les années sélectionnées" : "Année sélectionnée",
      description: year === "all" 
        ? "Affichage des données pour toutes les années" 
        : `Affichage des données pour l'année ${year}`,
    });
  }, [toast]);

  const handleResetFilters = useCallback(() => {
    console.log("Resetting filters");
    setSelectedMonth("all");
    setSelectedYear("all");
    
    toast({
      title: "Filtres réinitialisés",
      description: "Affichage de toutes les données",
    });
  }, [toast]);

  const handleManualRefresh = async () => {
    toast({
      title: "Actualisation en cours",
      description: "Chargement des données les plus récentes...",
    });
    
    await reloadData();
    
    toast({
      title: "Données actualisées",
      description: "Le tableau de bord a été mis à jour avec succès",
    });
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 bg-white dark:bg-slate-950"
              onClick={handleManualRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <DateRangeFilter
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              onReset={handleResetFilters}
              isLoading={isLoading}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Une erreur est survenue lors du chargement des données. Veuillez réessayer.
              {error.message && <div className="mt-2 text-sm">{error.message}</div>}
            </AlertDescription>
          </Alert>
        )}

        <DashboardCards
          enfantsTotal={enfantsFiltres.length}
          enfantsActifs={enfantsActifs}
          totalPaiements={totalPaiements}
          totalMensualites={totalMensualites}
          totalFraisInscription={totalFraisInscription}
          moyennePaiements={moyennePaiements}
          anneeScolaire={currentYear}
          isLoading={isLoading}
        />

        <PaiementsChart 
          paiementsMensuels={paiementsMensuels}
          anneeScolaire={currentYear}
          isLoading={isLoading}
        />

        <PaiementsTable
          paiementsMensuels={paiementsMensuels}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
};

export default Dashboard;
