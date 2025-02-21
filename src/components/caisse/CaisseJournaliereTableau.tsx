
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { usePaiementStore } from "@/data/paiements";
import { useEnfantStore } from "@/data/enfants";
import { useEffect } from "react";

interface CaisseJournaliereTableauProps {
  dateSelectionnee: string;
}

export const CaisseJournaliereTableau = ({ dateSelectionnee }: CaisseJournaliereTableauProps) => {
  const { paiements, fetchPaiements } = usePaiementStore();
  const { enfants, fetchEnfants } = useEnfantStore();

  useEffect(() => {
    fetchPaiements();
    fetchEnfants();
  }, [fetchPaiements, fetchEnfants]);

  // Filter paiements for selected date
  const paiementsDuJour = paiements.filter(
    (paiement) => paiement.datePaiement === dateSelectionnee
  );

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Caisse Journalière</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; margin-bottom: 20px; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; }
            .total { font-weight: bold; margin-top: 20px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Caisse Journalière - ${new Date(dateSelectionnee).toLocaleDateString('fr-FR')}</h1>
          <table>
            <thead>
              <tr>
                <th>Enfant</th>
                <th>Montant</th>
                <th>Méthode</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${paiementsDuJour.map(paiement => {
                const enfant = enfants.find(e => e.id === paiement.enfantId);
                return `
                  <tr>
                    <td>${enfant ? `${enfant.prenom} ${enfant.nom}` : 'Inconnu'}</td>
                    <td>${paiement.montant} DH</td>
                    <td>${paiement.methodePaiement}</td>
                    <td>${paiement.statut}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="total">
            Total: ${paiementsDuJour.reduce((sum, p) => sum + p.montant, 0)} DH
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">
          Total: {paiementsDuJour.reduce((sum, p) => sum + p.montant, 0)} DH
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="print:hidden"
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enfant</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paiementsDuJour.map((paiement) => {
              const enfant = enfants.find(e => e.id === paiement.enfantId);
              return (
                <TableRow key={paiement.id}>
                  <TableCell>{enfant ? `${enfant.prenom} ${enfant.nom}` : "Inconnu"}</TableCell>
                  <TableCell>{paiement.montant} DH</TableCell>
                  <TableCell>{paiement.methodePaiement}</TableCell>
                  <TableCell>{paiement.statut}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

