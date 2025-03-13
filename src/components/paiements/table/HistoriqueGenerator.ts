
import type { Paiement } from "@/data/paiements";
import type { Enfant } from "@/data/enfants";

export function generateHistorique(
  enfantId: number, 
  startDate: string, 
  endDate: string,
  enfants: Enfant[],
  paiements: Paiement[]
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const enfant = enfants.find(e => e.id === enfantId);
  if (!enfant) return;

  const paiementsEnfant = paiements
    .filter(p => p.enfantId === enfantId)
    .filter(p => {
      const paiementDate = new Date(p.datePaiement);
      return paiementDate >= new Date(startDate) && paiementDate <= new Date(endDate);
    });

  const paiementsMensuels = paiementsEnfant.filter(p => !p.anneeScolaire);
  const paiementsInscription = paiementsEnfant.filter(p => p.anneeScolaire);

  const totalMensuel = paiementsMensuels.reduce((acc, curr) => acc + curr.montant, 0);
  const totalInscription = paiementsInscription.reduce((acc, curr) => acc + curr.montant, 0);

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Historique des paiements - ${enfant.prenom} ${enfant.nom}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; font-size: 24px; margin-bottom: 20px; }
          h2 { color: #666; font-size: 18px; margin: 15px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .total { font-weight: bold; margin-top: 10px; }
          .info-block { margin-bottom: 20px; }
          .date-block { 
            background-color: #f8f9fa; 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 20px;
            border: 1px solid #e9ecef;
          }
          .date-item {
            margin: 5px 0;
            color: #495057;
          }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="info-block">
          <h1>Historique des paiements</h1>
          <p><strong>Élève:</strong> ${enfant.prenom} ${enfant.nom}</p>
          <p><strong>Classe:</strong> ${enfant.classe || 'Non définie'}</p>
          <p><strong>Date d'inscription:</strong> ${new Date(enfant.dateInscription || '').toLocaleDateString('fr-FR')}</p>
        </div>

        <div class="date-block">
          <div class="date-item"><strong>Période sélectionnée:</strong></div>
          <div class="date-item"><strong>Du:</strong> ${new Date(startDate).toLocaleDateString('fr-FR')}</div>
          <div class="date-item"><strong>Au:</strong> ${new Date(endDate).toLocaleDateString('fr-FR')}</div>
        </div>

        <div class="paiements-section">
          <h2>Frais d'inscription</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Montant</th>
                <th>Méthode</th>
                <th>Année scolaire</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${paiementsInscription.map(p => `
                <tr>
                  <td>${new Date(p.datePaiement).toLocaleDateString('fr-FR')}</td>
                  <td>${p.montant} DH</td>
                  <td>${p.methodePaiement}</td>
                  <td>${p.anneeScolaire || '-'}</td>
                  <td>${p.statut}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p class="total">Total des frais d'inscription payés: ${totalInscription} DH</p>

          <h2>Frais de scolarité mensuels</h2>
          <table>
            <thead>
              <tr>
                <th>Mois concerné</th>
                <th>Date de paiement</th>
                <th>Montant</th>
                <th>Méthode</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${paiementsMensuels.map(p => `
                <tr>
                  <td>${new Date(p.moisConcerne).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</td>
                  <td>${new Date(p.datePaiement).toLocaleDateString('fr-FR')}</td>
                  <td>${p.montant} DH</td>
                  <td>${p.methodePaiement}</td>
                  <td>${p.statut}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p class="total">Total des frais mensuels payés: ${totalMensuel} DH</p>
          <p class="total">Total général: ${totalMensuel + totalInscription} DH</p>
        </div>

        <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px;">
          Imprimer
        </button>
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
}
