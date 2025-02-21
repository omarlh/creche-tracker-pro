
import { type Enfant } from "@/data/enfants";

interface EnfantPrintPreviewProps {
  enfant: Enfant;
  calculerMontantRestant: (enfant: Enfant) => number;
}

export const generatePrintContent = ({ enfant, calculerMontantRestant }: EnfantPrintPreviewProps): string => {
  return `
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
};

export const printEnfant = (enfant: Enfant, calculerMontantRestant: (enfant: Enfant) => number) => {
  const printContent = generatePrintContent({ enfant, calculerMontantRestant });
  const printWindow = window.open('', '', 'height=600,width=800');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};

