
import React from "react";
import { useState, useEffect } from "react";
import { useEnfantStore, type Enfant } from "@/data/enfants";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { usePaiementStore } from "@/data/paiements";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StatisticsCards } from "@/components/rapports/StatisticsCards";
import { RapportsTable } from "@/components/rapports/RapportsTable";
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
  const today = new Date().toISOString().split('T')[0];
  const [dateDebut, setDateDebut] = useState<string>(today);
  const [dateFin, setDateFin] = useState<string>(today);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [rapportSelectionne, setRapportSelectionne] = useState<RapportMensuel | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const { enfants, fetchEnfants } = useEnfantStore();
  const { paiements, fetchPaiements } = usePaiementStore();
  const { toast } = useToast();

  // Fetch data on initial load
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchEnfants(), fetchPaiements()]);
    };
    loadData();
  }, [fetchEnfants, fetchPaiements]);

  // Refresh data when date filters change
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [dateDebut, dateFin]);

  const rapportsMensuels = useRapportGeneration(dateDebut, dateFin, enfants, paiements, undefined, refreshTrigger);

  const handleDateDebutChange = (date: string) => {
    console.log("Setting date début:", date);
    setDateDebut(date);
  };

  const handleDateFinChange = (date: string) => {
    console.log("Setting date fin:", date);
    setDateFin(date);
  };

  const handleExportRapport = () => {
    try {
      const data = rapportsMensuels.map(rapport => ({
        "Date": new Date(rapport.mois).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        "Total des frais de scolarité": rapport.totalPaiements,
        "Total des frais d'inscription": rapport.totalFraisInscription,
        "Total général": rapport.totalPaiements + rapport.totalFraisInscription
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rapports Journaliers");
      XLSX.writeFile(workbook, `rapport_${dateDebut}_${dateFin}.xlsx`);

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
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-content, .print-content * {
          visibility: visible;
        }
        .print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    window.print();

    document.head.removeChild(style);
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
                  dateDebut={dateDebut}
                  dateFin={dateFin}
                  onDateDebutChange={handleDateDebutChange}
                  onDateFinChange={handleDateFinChange}
                  onExport={handleExportRapport}
                  titre="Caisse Journalière"
                />

                <StatisticsCards rapportsMensuels={rapportsMensuels} />
                <RapportsTable 
                  rapportsMensuels={rapportsMensuels}
                  onDetailsClick={handleDetailsClick}
                  onPrint={handlePrintRapport}
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
                day: "numeric",
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
