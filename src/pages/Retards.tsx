
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RetardsHeader } from "@/components/retards/RetardsHeader";
import { RetardsStats } from "@/components/retards/RetardsStats";
import { RetardsTable, type RetardPaiement } from "@/components/retards/RetardsTable";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { Printer, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';

export default function Retards() {
  const { toast } = useToast();
  const [filtreStatus, setFiltreStatus] = useState<string>("tous");
  const [filtreDelai, setFiltreDelai] = useState<string>("tous");
  const [filtreClasse, setFiltreClasse] = useState<string>("toutes");
  const [filtreAnnee, setFiltreAnnee] = useState<string>("2024-2025");
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

  const retardsPaiement = useMemo((): RetardPaiement[] => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const enfantsFiltres = enfants
      .filter((enfant) => enfant.statut === "actif")
      .filter((enfant) => filtreClasse === "toutes" || enfant.classe === filtreClasse)
      .filter((enfant) => enfant.anneeScolaire === filtreAnnee);

    const retardsMensuels = enfantsFiltres.map((enfant) => {
      const joursRetard = calculerRetard(enfant.dernierPaiement);
      const montantDu = (enfant.fraisScolariteMensuel || 0) * Math.ceil(joursRetard / 30);
      
      return {
        id: enfant.id * 1000, // Pour éviter les conflits d'ID avec les retards d'inscription
        enfantId: enfant.id,
        enfantNom: enfant.nom,
        enfantPrenom: enfant.prenom,
        moisConcerne: currentMonth,
        montantDu: joursRetard === Infinity ? 0 : montantDu,
        joursRetard,
        dernierRappel: null,
        type: 'mensuel' as const
      };
    });

    // Ajout des retards de frais d'inscription
    const retardsInscription = enfantsFiltres
      .filter((enfant) => {
        const montantPaye = enfant.fraisInscription?.montantPaye || 0;
        const montantTotal = enfant.fraisInscription?.montantTotal || 0;
        return montantPaye < montantTotal;
      })
      .map((enfant) => {
        const montantPaye = enfant.fraisInscription?.montantPaye || 0;
        const montantTotal = enfant.fraisInscription?.montantTotal || 0;
        
        return {
          id: enfant.id,
          enfantId: enfant.id,
          enfantNom: enfant.nom,
          enfantPrenom: enfant.prenom,
          moisConcerne: enfant.dateInscription || currentMonth,
          montantDu: montantTotal - montantPaye,
          joursRetard: calculerRetard(enfant.dateInscription || null),
          dernierRappel: null,
          type: 'inscription' as const
        };
      });

    const tousLesRetards = [...retardsMensuels, ...retardsInscription]
      .filter((retard) => {
        if (filtreStatus === "tous") return true;
        const status = retard.joursRetard <= 0 ? "à jour" : retard.joursRetard <= 30 ? "en retard" : "critique";
        return status === filtreStatus;
      })
      .filter((retard) => {
        if (filtreDelai === "tous") return true;
        switch (filtreDelai) {
          case "moins30":
            return retard.joursRetard <= 30;
          case "30a60":
            return retard.joursRetard > 30 && retard.joursRetard <= 60;
          case "plus60":
            return retard.joursRetard > 60;
          default:
            return true;
        }
      })
      .sort((a, b) => b.joursRetard - a.joursRetard);

    return tousLesRetards;
  }, [enfants, calculerRetard, filtreStatus, filtreDelai, filtreClasse, filtreAnnee]);

  const statistiques = useMemo(() => {
    const total = retardsPaiement.length;
    const enRetard = retardsPaiement.filter(r => r.joursRetard > 0 && r.joursRetard <= 30).length;
    const critique = retardsPaiement.filter(r => r.joursRetard > 30).length;
    const aJour = retardsPaiement.filter(r => r.joursRetard <= 0).length;
    const montantTotal = retardsPaiement.reduce((acc, curr) => acc + curr.montantDu, 0);

    return {
      total,
      enRetard,
      critique,
      aJour,
      montantTotal
    };
  }, [retardsPaiement]);

  const handleEnvoyerRappel = useCallback((retardId: number) => {
    toast({
      title: "Rappel envoyé",
      description: "Le rappel de paiement a été envoyé avec succès.",
    });
  }, [toast]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    try {
      const data = retardsPaiement.map(retard => ({
        "Nom": retard.enfantNom,
        "Prénom": retard.enfantPrenom,
        "Type": retard.type === 'inscription' ? "Frais d'inscription" : "Mensualité",
        "Mois concerné": new Date(retard.moisConcerne).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }),
        "Montant dû": `${retard.montantDu} DH`,
        "Jours de retard": retard.joursRetard === Infinity ? "Jamais payé" : retard.joursRetard,
        "Dernier rappel": retard.dernierRappel ? new Date(retard.dernierRappel).toLocaleDateString('fr-FR') : "Aucun rappel"
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Retards de paiement");
      XLSX.writeFile(wb, `retards_paiement_${filtreAnnee}.xlsx`);

      toast({
        title: "Export réussi",
        description: "Le rapport de retards a été exporté avec succès en Excel",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'export",
        description: "Une erreur s'est produite pendant l'export",
        variant: "destructive",
      });
      console.error("Erreur d'export:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="grid lg:grid-cols-5 min-h-screen w-full">
        <AppSidebar />
        <div className="col-span-4 bg-background overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Retards de Paiement</h1>
              <div className="flex items-center gap-2 print:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportExcel}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exporter Excel
                </Button>
              </div>
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
                onEnvoyerRappel={handleEnvoyerRappel}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
