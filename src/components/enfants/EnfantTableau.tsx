
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { type Enfant } from "@/data/enfants";

interface EnfantTableauProps {
  enfants: Enfant[];
  onEdit: (enfant: Enfant) => void;
  onView: (enfant: Enfant) => void;
  calculerMontantRestant: (enfant: Enfant) => number;
}

export const EnfantTableau = ({ enfants, onEdit, onView, calculerMontantRestant }: EnfantTableauProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Classe</TableHead>
            <TableHead>Date de naissance</TableHead>
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
                {new Date(enfant.dateNaissance || "").toLocaleDateString("fr-FR")}
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
                  variant="ghost" 
                  size="sm"
                  onClick={() => onView(enfant)}
                >
                  Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
