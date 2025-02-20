
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, CreditCard, Receipt, BadgeCheck, Pencil, Trash2, Calendar } from "lucide-react";
import type { Paiement } from "@/data/paiements";
import type { Enfant } from "@/data/enfants";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PaiementTableauProps {
  paiements: Paiement[];
  enfants: Enfant[];
  onEdit: (paiement: Paiement) => void;
  confirmDeletePaiement: (paiement: Paiement) => void;
}

export const PaiementTableau = ({ paiements, enfants, onEdit, confirmDeletePaiement }: PaiementTableauProps) => {
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [selectedEnfantId, setSelectedEnfantId] = useState<number | null>(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const handlePrintEnfant = (enfantId: number, dateDebut: string, dateFin: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const enfant = enfants.find(e => e.id === enfantId);
    if (!enfant) return;

    const paiementsEnfant = paiements
      .filter(p => p.enfantId === enfantId)
      .filter(p => {
        const paiementDate = new Date(p.datePaiement);
        return paiementDate >= new Date(dateDebut) && paiementDate <= new Date(dateFin);
      });

    const paiementsMensuels = paiementsEnfant.filter(p => !p.anneeScolaire);
    const paiementsInscription = paiementsEnfant.filter(p => p.anneeScolaire);

    const totalMensuel = paiementsMensuels.reduce((acc, curr) => acc + curr.montant, 0);
    const totalInscription = paiementsInscription.reduce((acc, curr) => acc + curr.montant, 0);

    // Trouver les dates de début et de fin de paiement
    const datesPaiements = paiementsEnfant.map(p => new Date(p.datePaiement));
    const dateDebut = datesPaiements.length > 0 ? new Date(Math.min(...datesPaiements.map(d => d.getTime()))) : null;
    const dateFin = datesPaiements.length > 0 ? new Date(Math.max(...datesPaiements.map(d => d.getTime()))) : null;

    // Créer le contenu HTML pour l'impression
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
            <div class="date-item"><strong>Du:</strong> ${new Date(dateDebut).toLocaleDateString('fr-FR')}</div>
            <div class="date-item"><strong>Au:</strong> ${new Date(dateFin).toLocaleDateString('fr-FR')}</div>
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
  };

  const handlePrintClick = (enfantId: number) => {
    setSelectedEnfantId(enfantId);
    setDateDebut("");
    setDateFin("");
    setDateDialogOpen(true);
  };

  const handleConfirmDates = () => {
    if (selectedEnfantId && dateDebut && dateFin) {
      handlePrintEnfant(selectedEnfantId, dateDebut, dateFin);
      setDateDialogOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enfant</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date de paiement</TableHead>
              <TableHead>Mois concerné</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right print:hidden">Actions</TableHead>
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
                  <TableCell>
                    {new Date(paiement.moisConcerne).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center">
                      {paiement.methodePaiement === "carte" && <CreditCard className="w-4 h-4 mr-1" />}
                      {paiement.methodePaiement === "especes" && <Receipt className="w-4 h-4 mr-1" />}
                      {paiement.methodePaiement === "cheque" && <Receipt className="w-4 h-4 mr-1" />}
                      {paiement.methodePaiement.charAt(0).toUpperCase() + paiement.methodePaiement.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        paiement.statut === "complete"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {paiement.statut === "complete" ? (
                        <>
                          <BadgeCheck className="w-4 h-4 mr-1" />
                          Complété
                        </>
                      ) : (
                        "En attente"
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2 print:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrintClick(paiement.enfantId)}
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Historique détaillé
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(paiement)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDeletePaiement(paiement)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sélectionner la période</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut">Date de début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFin">Date de fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDateDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmDates}
              disabled={!dateDebut || !dateFin}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Générer l'historique
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
