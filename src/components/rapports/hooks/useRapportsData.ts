
import { useState, useEffect } from "react";
import { useEnfantStore, type Enfant } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { RapportMensuel } from "@/pages/Rapports";
import { useRapportGeneration } from "./useRapportGeneration";

export function useRapportsData() {
  const today = new Date().toISOString().split('T')[0];
  const [dateDebut, setDateDebut] = useState<string>(today);
  const [dateFin, setDateFin] = useState<string>(today);
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
    console.log("Dates changed, refreshing data:", { dateDebut, dateFin });
    setRefreshTrigger(prev => prev + 1);
  }, [dateDebut, dateFin]);

  const rapportsMensuels = useRapportGeneration(dateDebut, dateFin, enfants, paiements, undefined, refreshTrigger);

  const handleDateDebutChange = (date: string) => {
    if (!date) return;
    
    console.log("Setting date début:", date);
    setDateDebut(date);
  };

  const handleDateFinChange = (date: string) => {
    if (!date) return;
    
    console.log("Setting date fin:", date);
    setDateFin(date);
  };

  const handleExportRapport = () => {
    try {
      if (rapportsMensuels.length === 0) {
        toast({
          title: "Aucune donnée à exporter",
          description: "Veuillez sélectionner une période contenant des données",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
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

  const getEnfantById = (id: number): Enfant | undefined => {
    return enfants.find(enfant => enfant.id === id);
  };

  return {
    dateDebut,
    dateFin,
    rapportsMensuels,
    paiements,
    handleDateDebutChange,
    handleDateFinChange,
    handleExportRapport,
    getEnfantById
  };
}
