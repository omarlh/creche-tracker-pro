
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
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const currentYear = getCurrentSchoolYear();
  
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

  // Force reload data when date filters change
  useEffect(() => {
    const loadData = async () => {
      console.log("Dashboard reloading data with date filters:", { dateDebut, dateFin });
      await reloadData();
    };
    
    loadData();
  }, [dateDebut, dateFin, reloadData]);

  const handleDateDebutChange = useCallback((date: Date | undefined) => {
    setDateDebut(date);
    
    toast({
      title: "Date de début modifiée",
      description: date ? `Les données sont maintenant filtrées à partir du ${date.toLocaleDateString()}` : "Filtre de date de début supprimé",
    });
  }, [toast]);

  const handleDateFinChange = useCallback((date: Date | undefined) => {
    setDateFin(date);
    
    toast({
      title: "Date de fin modifiée",
      description: date ? `Les données sont maintenant filtrées jusqu'au ${date.toLocaleDateString()}` : "Filtre de date de fin supprimé",
    });
  }, [toast]);

  const handleResetDates = useCallback(() => {
    setDateDebut(undefined);
    setDateFin(undefined);
    
    toast({
      title: "Filtres réinitialisés",
      description: "Les dates ont été réinitialisées, affichage de toutes les données",
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
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleManualRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <DateRangeFilter
              dateDebut={dateDebut}
              dateFin={dateFin}
              onDateDebutChange={handleDateDebutChange}
              onDateFinChange={handleDateFinChange}
              onResetDates={handleResetDates}
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
  )
}

export default Dashboard
