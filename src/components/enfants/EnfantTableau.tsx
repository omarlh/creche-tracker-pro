
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Wallet, Printer, Trash2 } from "lucide-react";
import { type Enfant } from "@/data/enfants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

interface EnfantTableauProps {
  enfants: Enfant[];
  onEdit: (enfant: Enfant) => void;
  onView: (enfant: Enfant) => void;
  calculerMontantRestant: (enfant: Enfant) => number;
}

export const EnfantTableau = ({ enfants, onEdit, onView, calculerMontantRestant }: EnfantTableauProps) => {
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

  const handleDelete = (enfant: Enfant) => {
    const { supprimerEnfant } = useEnfantStore.getState();
    supprimerEnfant(enfant.id);
    toast({
      title: "Suppression réussie",
      description: `${enfant.prenom} ${enfant.nom} a été supprimé(e) de la liste.`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Classe</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Frais d'inscription</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dernier paiement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
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
                <div className="flex flex-col gap-1">
                  <span className={`inline-flex items-center ${
                    enfant.fraisInscription?.montantPaye === enfant.fraisInscription?.montantTotal
                      ? "text-success"
                      : "text-warning"
                  }`}>
                    <Wallet className="w-4 h-4 mr-1" />
                    {enfant.fraisInscription?.montantPaye || 0} DH / {enfant.fraisInscription?.montantTotal || 0} DH
                  </span>
                  {calculerMontantRestant(enfant) > 0 && (
                    <span className="text-xs text-muted-foreground">
                      Reste à payer : {calculerMontantRestant(enfant)} DH
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    enfant.statut === "actif"
                      ? "bg-success/10 text-success"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {enfant.statut === "actif" ? "Actif" : "Inactif"}
                </span>
              </TableCell>
              <TableCell>
                {new Date(enfant.dernierPaiement || "").toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(enfant)}
                >
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrint(enfant)}
                >
                  <Printer className="w-4 h-4 mr-1" />
                  Imprimer
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet enfant ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes les informations concernant {enfant.prenom} {enfant.nom} seront définitivement supprimées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(enfant)}>
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
