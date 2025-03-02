
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { useToast } from "@/components/ui/use-toast";
import { TableauCroiseHeader } from "@/components/tableau-croise/TableauCroiseHeader";
import { TableauCroiseTable } from "@/components/tableau-croise/TableauCroiseTable";
import { moisScolaires, moisMapping, exportToExcel } from "@/utils/tableau-croise";
import type { Classe } from "@/types/enfant.types";

const classes: Classe[] = ["TPS", "PS", "MS", "GS"];

const TableauCroise = () => {
  const { enfants, fetchEnfants } = useEnfantStore();
  const { paiements, fetchPaiements } = usePaiementStore();
  const [selectedAnneeScolaire, setSelectedAnneeScolaire] = useState("2024-2025");
  const [selectedClasse, setSelectedClasse] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchEnfants();
    fetchPaiements();
  }, [fetchEnfants, fetchPaiements]);

  // Enrichir les enfants avec leurs paiements pour l'historique
  const enfantsWithPaiements = enfants.map(enfant => {
    const enfantPaiements = paiements.filter(p => p.enfantId === enfant.id);
    return {
      ...enfant,
      paiements: enfantPaiements
    };
  });

  const getPaiementMensuel = (enfantId: number, mois: string) => {
    const moisNum = moisMapping[mois as keyof typeof moisMapping];
    const [anneeDebut, anneeFin] = selectedAnneeScolaire.split("-");
    const annee = parseInt(moisNum) > 8 ? anneeDebut : anneeFin;
    const dateMois = `${annee}-${moisNum}-01`;

    // Récupère tous les paiements mensuels pour cet enfant et ce mois, sans filtre sur l'année scolaire
    return paiements.find(p => 
      p.enfantId === enfantId && 
      p.moisConcerne === dateMois
    );
  };

  const getMontantInscription = (enfantId: number) => {
    const enfant = enfants.find(e => e.id === enfantId);
    if (!enfant || !enfant.fraisInscription || enfant.anneeScolaire !== selectedAnneeScolaire) {
      return {
        montantTotal: 800,
        montantPaye: 0
      };
    }
    return {
      montantTotal: enfant.fraisInscription.montantTotal,
      montantPaye: enfant.fraisInscription.montantPaye
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    try {
      exportToExcel(
        enfants,
        selectedAnneeScolaire,
        selectedClasse,
        searchTerm,
        getMontantInscription,
        getPaiementMensuel
      );

      toast({
        title: "Export réussi",
        description: "Le tableau a été exporté avec succès en Excel",
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
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="w-full">
            <TableauCroiseHeader
              selectedAnneeScolaire={selectedAnneeScolaire}
              setSelectedAnneeScolaire={setSelectedAnneeScolaire}
              selectedClasse={selectedClasse}
              setSelectedClasse={setSelectedClasse}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onPrint={handlePrint}
              onExportExcel={handleExportExcel}
              classes={classes}
            />

            <Card>
              <CardHeader>
                <CardTitle>
                  Suivi des paiements par enfant - {selectedAnneeScolaire}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <TableauCroiseTable
                  enfants={enfantsWithPaiements}
                  selectedAnneeScolaire={selectedAnneeScolaire}
                  selectedClasse={selectedClasse}
                  searchTerm={searchTerm}
                  moisScolaires={moisScolaires}
                  getPaiementMensuel={getPaiementMensuel}
                  getMontantInscription={getMontantInscription}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TableauCroise;
