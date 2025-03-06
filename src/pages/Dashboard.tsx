
import { useState, useEffect } from "react"
import { getCurrentSchoolYear } from "@/lib/dateUtils"
import { AnneeScolaireSelect } from "@/components/paiements/forms/AnneeScolaireSelect"
import { DashboardCards } from "@/components/dashboard/DashboardCards"
import { PaiementsChart } from "@/components/dashboard/PaiementsChart"
import { PaiementsTable } from "@/components/dashboard/PaiementsTable"
import { useDashboardData } from "@/hooks/useDashboardData"
import { useToast } from "@/components/ui/use-toast"

const Dashboard = () => {
  const [anneeScolaire, setAnneeScolaire] = useState(getCurrentSchoolYear())
  const { toast } = useToast();
  
  const {
    isLoading,
    enfantsFiltres,
    enfantsActifs,
    totalMensualites,
    totalFraisInscription,
    totalPaiements,
    moyennePaiements,
    paiementsMensuels,
    reloadData
  } = useDashboardData(anneeScolaire);

  // Effect to reload data when anneeScolaire changes
  useEffect(() => {
    const loadDataForYear = async () => {
      await reloadData();
    };
    
    loadDataForYear();
  }, [anneeScolaire, reloadData]);

  const handleAnneeScolaireChange = async (value: string) => {
    if (value === anneeScolaire) return;
    
    setAnneeScolaire(value);
    toast({
      title: "Année scolaire modifiée",
      description: `Les données sont maintenant filtrées pour l'année ${value}`,
    });
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <div className="w-64">
            <AnneeScolaireSelect
              value={anneeScolaire}
              onChange={handleAnneeScolaireChange}
            />
          </div>
        </div>

        <DashboardCards
          enfantsTotal={enfantsFiltres.length}
          enfantsActifs={enfantsActifs}
          totalPaiements={totalPaiements}
          totalMensualites={totalMensualites}
          totalFraisInscription={totalFraisInscription}
          moyennePaiements={moyennePaiements}
          anneeScolaire={anneeScolaire}
          isLoading={isLoading}
        />

        <PaiementsChart 
          paiementsMensuels={paiementsMensuels}
          anneeScolaire={anneeScolaire}
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
