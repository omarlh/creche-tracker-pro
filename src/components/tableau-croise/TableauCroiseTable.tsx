import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Enfant } from "@/types/enfant.types";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TableauCroiseTableProps {
  enfants: Enfant[];
  selectedAnneeScolaire: string;
  selectedClasse: string;
  searchTerm: string;
  moisScolaires: string[];
  getPaiementMensuel: (enfantId: number, mois: string) => any;
  getMontantInscription: (enfantId: number) => { montantTotal: number; montantPaye: number };
}

export function TableauCroiseTable({
  enfants,
  selectedAnneeScolaire,
  selectedClasse,
  searchTerm,
  moisScolaires,
  getPaiementMensuel,
  getMontantInscription,
}: TableauCroiseTableProps) {
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [selectedEnfantId, setSelectedEnfantId] = useState<number | null>(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const filteredEnfants = enfants
    .filter(e => selectedAnneeScolaire === "all" || e.anneeScolaire === selectedAnneeScolaire)
    .filter(e => selectedClasse === "all" || e.classe === selectedClasse)
    .filter(e => {
      const fullName = `${e.prenom} ${e.nom}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });

  const handlePrintEnfant = (enfantId: number, startDate: string, endDate: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const enfant = enfants.find(e => e.id === enfantId);
    if (!enfant) return;

    const paiementsEnfant = enfant.paiements || [];
    const paiementsFiltres = paiementsEnfant.filter(p => {
      const paiementDate = new Date(p.datePaiement);
      return paiementDate >= new Date(startDate) && paiementDate <= new Date(endDate);
    });

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
  };

  const handleHistoriqueClick = (enfantId: number) => {
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="bg-muted">Nom</TableHead>
            <TableHead rowSpan={2} className="bg-muted">Classe</TableHead>
            <TableHead rowSpan={2} className="bg-muted">Date d'inscription</TableHead>
            <TableHead rowSpan={2} className="bg-muted">Année scolaire</TableHead>
            <TableHead rowSpan={2} className="bg-muted text-right">
              Frais d'inscription
            </TableHead>
            <TableHead colSpan={10} className="text-center bg-muted">
              Paiements mensuels
            </TableHead>
            <TableHead rowSpan={2} className="bg-muted text-center">
              Historique
            </TableHead>
          </TableRow>
          <TableRow>
            {moisScolaires.map((mois) => (
              <TableHead key={mois} className="text-right bg-muted/50">
                {mois}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEnfants.map((enfant) => {
            const inscription = getMontantInscription(enfant.id);
            return (
              <TableRow key={enfant.id}>
                <TableCell className="font-medium">
                  {enfant.prenom} {enfant.nom}
                </TableCell>
                <TableCell>
                  {enfant.classe || "-"}
                </TableCell>
                <TableCell>
                  {enfant.dateInscription ? new Date(enfant.dateInscription).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>
                  {enfant.anneeScolaire || "-"}
                </TableCell>
                <TableCell className={`text-right ${
                  inscription.montantPaye >= inscription.montantTotal 
                    ? "bg-green-50" 
                    : "bg-red-50"
                }`}>
                  {inscription.montantPaye}/{inscription.montantTotal} DH
                </TableCell>
                {moisScolaires.map((mois) => {
                  const paiement = getPaiementMensuel(enfant.id, mois);
                  return (
                    <TableCell 
                      key={`${enfant.id}-${mois}`} 
                      className={`text-right ${paiement ? "bg-green-50" : "bg-red-50"}`}
                    >
                      {paiement ? `${paiement.montant} DH` : "-"}
                    </TableCell>
                  );
                })}
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHistoriqueClick(enfant.id)}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sélectionner la période</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut">Date début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFin">Date fin</Label>
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
              <Clock className="w-4 h-4 mr-2" />
              Générer l'historique
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
