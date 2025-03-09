
import type { Enfant } from "@/types/enfant.types";

export function printEnfantHistorique(
  enfantId: number, 
  startDate: string, 
  endDate: string,
  enfants: Enfant[],
  getMontantInscription: (enfantId: number) => { montantTotal: number; montantPaye: number }
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const enfant = enfants.find(e => e.id === enfantId);
  if (!enfant) return;

  const paiementsEnfant = enfant.paiements || [];
  const paiementsFiltres = paiementsEnfant.filter(p => {
    const paiementDate = new Date(p.datePaiement);
    return paiementDate >= new Date(startDate) && paiementDate <= new Date(endDate);
  });

  // Récupérer les frais d'inscription de l'enfant
  const inscriptionInfo = getMontantInscription(enfant.id);
  
  // Séparer les paiements mensuels de ceux liés à l'inscription
  // On considère qu'un paiement est pour l'inscription s'il a une année scolaire
  const paiementsMensuels = paiementsFiltres.filter(p => !p.anneeScolaire);
  const paiementsInscription = paiementsFiltres.filter(p => p.anneeScolaire);

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
          .frais-inscription {
            background-color: #e9f7ef;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #d5f5e3;
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
          <p><strong>Date d'inscription:</strong> ${enfant.dateInscription ? new Date(enfant.dateInscription).toLocaleDateString('fr-FR') : 'Non définie'}</p>
        </div>

        <div class="date-block">
          <div class="date-item"><strong>Période sélectionnée:</strong></div>
          <div class="date-item"><strong>Du:</strong> ${new Date(startDate).toLocaleDateString('fr-FR')}</div>
          <div class="date-item"><strong>Au:</strong> ${new Date(endDate).toLocaleDateString('fr-FR')}</div>
        </div>

        <div class="frais-inscription">
          <h2>Frais d'inscription</h2>
          <p><strong>Montant total:</strong> ${inscriptionInfo.montantTotal} DH</p>
          <p><strong>Montant payé:</strong> ${inscriptionInfo.montantPaye} DH</p>
          <p><strong>Reste à payer:</strong> ${inscriptionInfo.montantTotal - inscriptionInfo.montantPaye} DH</p>
        </div>

        <div class="paiements-section">
          <h2>Détail des paiements d'inscription</h2>
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
              ${paiementsInscription.length > 0 ? paiementsInscription.map(p => `
                <tr>
                  <td>${new Date(p.datePaiement).toLocaleDateString('fr-FR')}</td>
                  <td>${p.montant} DH</td>
                  <td>${p.methodePaiement}</td>
                  <td>${p.anneeScolaire || '-'}</td>
                  <td>${p.statut}</td>
                </tr>
              `).join('') : '<tr><td colspan="5" style="text-align: center;">Aucun paiement d\'inscription trouvé pour cette période</td></tr>'}
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
              ${paiementsMensuels.length > 0 ? paiementsMensuels.map(p => `
                <tr>
                  <td>${new Date(p.moisConcerne).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</td>
                  <td>${new Date(p.datePaiement).toLocaleDateString('fr-FR')}</td>
                  <td>${p.montant} DH</td>
                  <td>${p.methodePaiement}</td>
                  <td>${p.statut}</td>
                </tr>
              `).join('') : '<tr><td colspan="5" style="text-align: center;">Aucun paiement mensuel trouvé pour cette période</td></tr>'}
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
