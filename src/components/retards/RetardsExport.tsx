
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Printer, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import type { RetardPaiement } from "./RetardsTable";

interface RetardsExportProps {
  retards: RetardPaiement[];
  filtreAnnee: string;
}

export function RetardsExport({ retards, filtreAnnee }: RetardsExportProps) {
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    try {
      const data = retards.map(retard => ({
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
  );
}
