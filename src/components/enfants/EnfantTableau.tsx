import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { type Enfant, useEnfantStore } from "@/data/enfants";
import { EnfantTableHeader } from "./table/EnfantTableHeader";
import { EnfantStatut } from "./table/EnfantStatut";
import { EnfantActions } from "./table/EnfantActions";
import { EnfantFrais } from "./table/EnfantFrais";
import { useEffect } from "react";

interface EnfantTableauProps {
  onEdit: (enfant: Enfant) => void;
  onView: (enfant: Enfant) => void;
  calculerMontantRestant: (enfant: Enfant) => number;
}

export const EnfantTableau = ({ onEdit, onView, calculerMontantRestant }: EnfantTableauProps) => {
  const { enfants, supprimerEnfant, fetchEnfants } = useEnfantStore();

  useEffect(() => {
    fetchEnfants();
  }, []); // S'exécute une seule fois au montage du composant

  const handleDelete = async (enfantId: number) => {
    console.log("Suppression de l'enfant avec l'ID:", enfantId);
    await supprimerEnfant(enfantId);
  };

  const handlePrint = (enfant: Enfant) => {
    const printContent = `
      <html>
        <head>
          <title>Fiche d'inscription - ${enfant.prenom} ${enfant.nom}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            h1 { color: #333; margin-bottom: 20px; text-align: center; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
            .info-section { margin-bottom: 20px; }
            .info-title { font-weight: bold; color: #666; margin-bottom: 5px; }
            .info-value { margin-bottom: 10px; }
            .payment-info { margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
            .status { 
              display: inline-block;
              padding: 5px 10px;
              border-radius: 15px;
              font-size: 14px;
              font-weight: 500;
              background-color: ${enfant.statut === 'actif' ? '#dcfce7' : '#f3f4f6'};
              color: ${enfant.statut === 'actif' ? '#166534' : '#4b5563'};
            }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>Fiche d'inscription</h1>
          
          <div class="info-grid">
            <div class="info-section">
              <div class="info-title">Informations personnelles</div>
              <div class="info-value"><strong>Nom:</strong> ${enfant.nom}</div>
              <div class="info-value"><strong>Prénom:</strong> ${enfant.prenom}</div>
              <div class="info-value"><strong>Classe:</strong> ${enfant.classe || '-'}</div>
              <div class="info-value"><strong>Date d'inscription:</strong> ${new Date(enfant.dateInscription || "").toLocaleDateString("fr-FR")}</div>
              <div class="info-value">
                <strong>Statut:</strong> 
                <span class="status">${enfant.statut === 'actif' ? 'Actif' : 'Inactif'}</span>
              </div>
            </div>

            <div class="info-section">
              <div class="info-title">Contacts</div>
              <div class="info-value"><strong>GSM Maman:</strong> ${enfant.gsmMaman || '-'}</div>
              <div class="info-value"><strong>GSM Papa:</strong> ${enfant.gsmPapa || '-'}</div>
            </div>
          </div>

          <div class="payment-info">
            <div class="info-title">Informations de paiement</div>
            <div class="info-value">
              <strong>Frais d'inscription:</strong> 
              ${enfant.fraisInscription?.montantPaye || 0} DH / ${enfant.fraisInscription?.montantTotal || 0} DH
            </div>
            <div class="info-value">
              <strong>Reste à payer:</strong> ${calculerMontantRestant(enfant)} DH
            </div>
            <div class="info-value">
              <strong>Dernier paiement:</strong> 
              ${enfant.dernierPaiement ? new Date(enfant.dernierPaiement).toLocaleDateString("fr-FR") : '-'}
            </div>
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
      printWindow.close();
    }
  };

  if (!enfants) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <Table>
        <EnfantTableHeader />
        <TableBody>
          {enfants.map((enfant) => (
            <TableRow key={enfant.id}>
              <TableCell className="font-medium">{enfant.nom}</TableCell>
              <TableCell>{enfant.prenom}</TableCell>
              <TableCell>{enfant.classe}</TableCell>
              <TableCell>
                {new Date(enfant.dateInscription || "").toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>
                <EnfantFrais 
                  enfant={enfant}
                  calculerMontantRestant={calculerMontantRestant}
                />
              </TableCell>
              <TableCell>
                <EnfantStatut statut={enfant.statut} />
              </TableCell>
              <TableCell>
                {new Date(enfant.dernierPaiement || "").toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>
                <EnfantActions
                  enfant={enfant}
                  onEdit={onEdit}
                  onPrint={handlePrint}
                  onDelete={handleDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
