
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface CaisseJournaliereTableauProps {
  paiements: {
    id: number;
    montant: number;
    datePaiement: string;
    methodePaiement: string;
    statut: string;
    enfantId: number;
  }[];
  enfants: {
    id: number;
    nom: string;
    prenom: string;
  }[];
}

export const CaisseJournaliereTableau = ({ paiements, enfants }: CaisseJournaliereTableauProps) => {
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
          <h1>Caisse Journalière - ${new Date().toLocaleDateString('fr-FR')}</h1>
          <table>
            <thead>
              <tr>
                <th>Enfant</th>
                <th>Montant</th>
                <th>Date de paiement</th>
                <th>Méthode</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${paiements.map(paiement => {
                const enfant = enfants.find(e => e.id === paiement.enfantId);
                return `
                  <tr>
                    <td>${enfant ? `${enfant.prenom} ${enfant.nom}` : 'Inconnu'}</td>
                    <td>${paiement.montant} DH</td>
                    <td>${new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}</td>
                    <td>${paiement.methodePaiement}</td>
                    <td>${paiement.statut}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="total">
            Total: ${paiements.reduce((sum, p) => sum + p.montant, 0)} DH
          </div>
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px;">
            Imprimer
          </button>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="print:hidden"
        >
          <Printer className="w-4 h-4 mr-2" />
          Imprimer
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enfant</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date de paiement</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paiements.map((paiement) => {
              const enfant = enfants.find(e => e.id === paiement.enfantId);
              return (
                <TableRow key={paiement.id}>
                  <TableCell>{enfant ? `${enfant.prenom} ${enfant.nom}` : "Inconnu"}</TableCell>
                  <TableCell>{paiement.montant} DH</TableCell>
                  <TableCell>{new Date(paiement.datePaiement).toLocaleDateString("fr-FR")}</TableCell>
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
