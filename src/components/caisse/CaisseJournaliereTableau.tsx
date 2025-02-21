
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
  dateSelectionnee: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function CaisseJournaliereTableau({
  dateSelectionnee,
  onEdit,
  onDelete,
}: CaisseJournaliereTableauProps) {
  const { paiements } = usePaiementStore();
  const { enfants } = useEnfantStore();
  const { toast } = useToast();

  const paiementsDuJour = paiements.filter(
    (paiement) => paiement.datePaiement === dateSelectionnee
  );

  const totalPaiements = paiementsDuJour.reduce((sum, p) => sum + p.montant, 0);

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
      const data = paiementsDuJour.map((paiement) => {
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
      XLSX.writeFile(wb, `paiements_${dateSelectionnee}.xlsx`);

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
              {paiementsDuJour.map((paiement) => (
                <TableauLigne
                  key={paiement.id}
                  paiement={paiement}
                  enfant={enfants.find((e) => e.id === paiement.enfantId)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
