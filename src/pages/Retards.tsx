
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { RetardsHeader } from "@/components/retards/RetardsHeader";
import { RetardsStats } from "@/components/retards/RetardsStats";
import { RetardsTable } from "@/components/retards/RetardsTable";
import { RetardsExport } from "@/components/retards/RetardsExport";
import { useRetardsCalculation } from "@/hooks/useRetardsCalculation";
import { usePaiementStore } from "@/data/paiements";

export default function Retards() {
  const [filtreStatus, setFiltreStatus] = useState<string>("tous");
  const [filtreDelai, setFiltreDelai] = useState<string>("tous");
  const [filtreClasse, setFiltreClasse] = useState<string>("toutes");
  const [filtreAnnee, setFiltreAnnee] = useState<string>("2024-2025");
  const { fetchPaiements } = usePaiementStore();

  useEffect(() => {
    fetchPaiements();
  }, [fetchPaiements]);

  const { retardsPaiement, statistiques } = useRetardsCalculation(
    filtreStatus,
    filtreDelai,
    filtreClasse,
    filtreAnnee
  );

  return (
    <div className="grid lg:grid-cols-5 min-h-screen w-full">
      <AppSidebar />
      <div className="col-span-4 bg-background overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Retards de Paiement</h1>
            <RetardsExport 
              retards={retardsPaiement}
              filtreAnnee={filtreAnnee}
            />
          </div>

          <div className="space-y-4">
            <RetardsHeader
              filtreStatus={filtreStatus}
              setFiltreStatus={setFiltreStatus}
              filtreDelai={filtreDelai}
              setFiltreDelai={setFiltreDelai}
              filtreClasse={filtreClasse}
              setFiltreClasse={setFiltreClasse}
              filtreAnnee={filtreAnnee}
              setFiltreAnnee={setFiltreAnnee}
            />
            
            <RetardsStats statistiques={statistiques} />

            <RetardsTable
              retards={retardsPaiement}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
