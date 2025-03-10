
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
  const { toast } = useToast();
  const currentYear = getCurrentSchoolYear();
  
  // Get dashboard data without date filters
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
  } = useDashboardData();

  const handleResetFilters = useCallback(() => {
    console.log("Resetting filters");
    
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
