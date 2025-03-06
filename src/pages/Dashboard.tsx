
import { useState } from "react"
import { getCurrentSchoolYear } from "@/lib/dateUtils"
import { AnneeScolaireSelect } from "@/components/paiements/forms/AnneeScolaireSelect"
import { DashboardCards } from "@/components/dashboard/DashboardCards"
import { PaiementsChart } from "@/components/dashboard/PaiementsChart"
import { PaiementsTable } from "@/components/dashboard/PaiementsTable"
import { useDashboardData } from "@/hooks/useDashboardData"

const Dashboard = () => {
  const [anneeScolaire, setAnneeScolaire] = useState(getCurrentSchoolYear())
  
  const {
    enfantsFiltres,
    enfantsActifs,
    totalMensualites,
    totalFraisInscription,
    totalPaiements,
    moyennePaiements,
    paiementsMensuels,
    reloadData
  } = useDashboardData(anneeScolaire);

  const handleAnneeScolaireChange = async (value: string) => {
    setAnneeScolaire(value);
    await reloadData();
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
        />

        <PaiementsChart 
          paiementsMensuels={paiementsMensuels}
          anneeScolaire={anneeScolaire}
        />

        <PaiementsTable
          paiementsMensuels={paiementsMensuels}
        />
      </div>
    </main>
  )
}

export default Dashboard
