
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RetardsHeader } from "@/components/retards/RetardsHeader";
import { RetardsStats } from "@/components/retards/RetardsStats";
import { RetardsTable } from "@/components/retards/RetardsTable";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";

export default function Retards() {
  const { toast } = useToast();
  const [filtreStatus, setFiltreStatus] = useState<string>("tous");
  const [filtreDelai, setFiltreDelai] = useState<string>("tous");
  const enfants = useEnfantStore((state) => state.enfants);
  const paiements = usePaiementStore((state) => state.paiements);
  const { fetchPaiements } = usePaiementStore();

  useEffect(() => {
    fetchPaiements();
  }, [fetchPaiements]);

  const calculerRetard = useCallback((dernierPaiement: string | null) => {
    if (!dernierPaiement) return Infinity;
    const dateRetard = new Date(dernierPaiement);
    const aujourdhui = new Date();
    const differenceEnJours = Math.floor(
      (aujourdhui.getTime() - dateRetard.getTime()) / (1000 * 60 * 60 * 24)
    );
    return differenceEnJours;
  }, []);

  const enfantsAvecRetard = useMemo(() => {
    return enfants
      .filter((enfant) => enfant.statut === "actif")
      .map((enfant) => {
        const dernierPaiement = enfant.dernierPaiement;
        const joursRetard = calculerRetard(dernierPaiement);
        const montantDu = (enfant.fraisScolariteMensuel || 0) * Math.ceil(joursRetard / 30);
        
        return {
          ...enfant,
          joursRetard,
          montantDu: joursRetard === Infinity ? 0 : montantDu,
          status: joursRetard <= 0 ? "à jour" : joursRetard <= 30 ? "en retard" : "critique"
        };
      })
      .filter((enfant) => {
        if (filtreStatus === "tous") return true;
        return enfant.status === filtreStatus;
      })
      .filter((enfant) => {
        if (filtreDelai === "tous") return true;
        const retard = enfant.joursRetard;
        switch (filtreDelai) {
          case "moins30":
            return retard <= 30;
          case "30a60":
            return retard > 30 && retard <= 60;
          case "plus60":
            return retard > 60;
          default:
            return true;
        }
      })
      .sort((a, b) => b.joursRetard - a.joursRetard);
  }, [enfants, calculerRetard, filtreStatus, filtreDelai]);

  const statistiques = useMemo(() => {
    const total = enfantsAvecRetard.length;
    const enRetard = enfantsAvecRetard.filter(e => e.status === "en retard").length;
    const critique = enfantsAvecRetard.filter(e => e.status === "critique").length;
    const aJour = enfantsAvecRetard.filter(e => e.status === "à jour").length;
    const montantTotal = enfantsAvecRetard.reduce((acc, curr) => acc + curr.montantDu, 0);

    return {
      total,
      enRetard,
      critique,
      aJour,
      montantTotal
    };
  }, [enfantsAvecRetard]);

  const handleEnvoyerRappel = useCallback((enfantId: number) => {
    toast({
      title: "Rappel envoyé",
      description: "Le rappel de paiement a été envoyé avec succès.",
    });
  }, [toast]);

  return (
    <SidebarProvider>
      <div className="grid lg:grid-cols-5 h-screen w-full">
        <AppSidebar />
        <div className="col-span-4 bg-background">
          <div className="h-full px-4 py-6 lg:px-8">
            <RetardsHeader
              filtreStatus={filtreStatus}
              setFiltreStatus={setFiltreStatus}
              filtreDelai={filtreDelai}
              setFiltreDelai={setFiltreDelai}
            />
            
            <div className="mt-8">
              <RetardsStats statistiques={statistiques} />
            </div>

            <div className="mt-8">
              <RetardsTable
                retards={enfantsAvecRetard}
                onEnvoyerRappel={handleEnvoyerRappel}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
