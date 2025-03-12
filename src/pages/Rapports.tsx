
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StatisticsCards } from "@/components/rapports/StatisticsCards";
import { RapportsTable } from "@/components/rapports/RapportsTable";
import { RapportsHeader } from "@/components/rapports/RapportsHeader";
import { RapportDetailSheet } from "@/components/rapports/RapportDetailSheet";
import { useRapportsData } from "@/components/rapports/hooks/useRapportsData";

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [rapportSelectionne, setRapportSelectionne] = useState<RapportMensuel | null>(null);
  
  const {
    dateDebut,
    dateFin,
    rapportsMensuels,
    paiements,
    handleDateDebutChange,
    handleDateFinChange,
    handleExportRapport,
    getEnfantById
  } = useRapportsData();

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

      <RapportDetailSheet 
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        rapport={rapportSelectionne}
        getEnfantById={getEnfantById}
        paiements={paiements}
        onPrint={handlePrintRapport}
      />
    </SidebarProvider>
  );
};

export default Rapports;
