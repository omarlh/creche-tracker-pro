
import React from "react";
import { useState } from "react";
import { useEnfantStore, type Enfant } from "@/data/enfants";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { usePaiementStore } from "@/data/paiements";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StatisticsCards } from "@/components/rapports/StatisticsCards";
import { RapportsTable } from "@/components/rapports/RapportsTable";
import { InscriptionsStats } from "@/components/rapports/InscriptionsStats";
import { EnfantsTable } from "@/components/rapports/EnfantsTable";
import { RapportDetails } from "@/components/rapports/RapportDetails";
import { RapportsHeader } from "@/components/rapports/RapportsHeader";
import { useRapportGeneration } from "@/components/rapports/hooks/useRapportGeneration";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export type RapportMensuel = {
  mois: string;
  totalPaiements: number;
  totalFraisInscription: number;
  nombreEnfants: number;
  paiementsComplets: number;
  paiementsAttente: number;
  tauxRecouvrement: number;
  enfantsPaye: number[];
  enfantsNonPaye: number[];
};

const Rapports: React.FC = () => {
  const [anneeScolaireSelectionnee, setAnneeScolaireSelectionnee] = useState<string>("2024/2025");
  const [moisSelectionne, setMoisSelectionne] = useState<string>("Tous les mois");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [rapportSelectionne, setRapportSelectionne] = useState<RapportMensuel | null>(null);
  
  const { enfants } = useEnfantStore();
  const { paiements } = usePaiementStore();
  const { toast } = useToast();

  const rapportsMensuels = useRapportGeneration(
    anneeScolaireSelectionnee,
    moisSelectionne,
    enfants,
    paiements
  );

  const enfantsParAnneeScolaire = ["2023/2024", "2024/2025", "2025/2026"].reduce((acc, annee) => {
    acc[annee] = enfants.filter(enfant => enfant.anneeScolaire === annee);
    return acc;
  }, {} as Record<string, Enfant[]>);

  const getStatistiquesAnnee = (annee: string) => {
    const enfantsAnnee = enfantsParAnneeScolaire[annee] || [];
    const total = enfantsAnnee.length;
    const actifs = enfantsAnnee.filter(e => e.statut === "actif").length;
    const inactifs = total - actifs;
    
    return {
      total,
      actifs,
      inactifs
    };
  };

  const handleExportRapport = () => {
    try {
      const data = rapportsMensuels.map(rapport => ({
        "Mois": new Date(rapport.mois).toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric"
        }),
        "Total des paiements (DH)": rapport.totalPaiements,
        "Total des frais d'inscription (DH)": rapport.totalFraisInscription,
        "Nombre d'enfants": rapport.nombreEnfants,
        "Paiements complétés": rapport.paiementsComplets,
        "Paiements en attente": rapport.paiementsAttente,
        "Taux de recouvrement (%)": rapport.tauxRecouvrement
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rapports Mensuels");
      XLSX.writeFile(workbook, `rapport_mensuel_${new Date().toISOString().slice(0, 7)}.xlsx`);

      toast({
        title: "Export réussi",
        description: "Le rapport a été exporté avec succès au format Excel",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export du rapport",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handlePrintRapport = () => {
    window.print();
  };

  const handleDetailsClick = (rapport: RapportMensuel) => {
    setRapportSelectionne(rapport);
    setIsSheetOpen(true);
  };

  const getEnfantById = (id: number): Enfant | undefined => {
    return enfants.find(enfant => enfant.id === id);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              <div>
                <RapportsHeader
                  anneeScolaireSelectionnee={anneeScolaireSelectionnee}
                  moisSelectionne={moisSelectionne}
                  onAnneeChange={setAnneeScolaireSelectionnee}
                  onMoisChange={setMoisSelectionne}
                  onExport={handleExportRapport}
                />

                <StatisticsCards rapportsMensuels={rapportsMensuels} />
                <RapportsTable 
                  rapportsMensuels={rapportsMensuels}
                  onDetailsClick={handleDetailsClick}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Inscriptions par Année Scolaire</h2>
                </div>

                <InscriptionsStats
                  anneeScolaireSelectionnee={anneeScolaireSelectionnee}
                  getStatistiquesAnnee={getStatistiquesAnnee}
                />

                <EnfantsTable 
                  enfants={enfantsParAnneeScolaire[anneeScolaireSelectionnee] || []}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto print:w-full print:max-w-none print:overflow-visible">
          <SheetHeader>
            <SheetTitle>
              Détails du rapport - {rapportSelectionne && new Date(rapportSelectionne.mois).toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            {rapportSelectionne && (
              <RapportDetails
                rapport={rapportSelectionne}
                onPrint={handlePrintRapport}
                getEnfantById={getEnfantById}
                paiements={paiements}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
};

export default Rapports;
