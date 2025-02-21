
import { Table, TableBody } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { TableauActions } from "./TableauActions";
import { TableauHeader } from "./TableauHeader";
import { TableauLigne } from "./TableauLigne";

interface CaisseJournaliereTableauProps {
  searchTerm: string;
}

export function CaisseJournaliereTableau({
  searchTerm
}: CaisseJournaliereTableauProps) {
  const { paiements } = usePaiementStore();
  const { enfants } = useEnfantStore();
  const { toast } = useToast();

  const totalPaiements = paiements.reduce((sum, p) => sum + p.montant, 0);

  const handlePrint = () => {
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

  const handleExportExcel = () => {
    try {
      const data = paiements.map((paiement) => {
        const enfant = enfants.find((e) => e.id === paiement.enfantId);
        return {
          Enfant: enfant ? `${enfant.prenom} ${enfant.nom}` : "Inconnu",
          Classe: enfant?.classe || "N/A",
          Montant: `${paiement.montant} DH`,
          "Méthode de paiement": paiement.methodePaiement,
          Date: new Date(paiement.datePaiement).toLocaleDateString("fr-FR"),
          Statut: paiement.statut,
        };
      });

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Paiements");
      XLSX.writeFile(wb, `paiements_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast({
        title: "Export réussi",
        description: "Le fichier a été exporté avec succès",
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

  const filteredPaiements = paiements.filter(paiement => {
    const enfant = enfants.find(e => e.id === paiement.enfantId);
    const searchTermLower = searchTerm.toLowerCase();
    return (
      enfant?.nom.toLowerCase().includes(searchTermLower) ||
      enfant?.prenom.toLowerCase().includes(searchTermLower) ||
      paiement.montant.toString().includes(searchTerm) ||
      paiement.methodePaiement.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <Card>
      <div className="p-6">
        <TableauActions
          totalPaiements={totalPaiements}
          onPrint={handlePrint}
          onExportExcel={handleExportExcel}
        />
        
        <div className="rounded-md border print-content">
          <Table>
            <TableauHeader />
            <TableBody>
              {filteredPaiements.map((paiement) => (
                <TableauLigne
                  key={paiement.id}
                  paiement={paiement}
                  enfant={enfants.find((e) => e.id === paiement.enfantId)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}

