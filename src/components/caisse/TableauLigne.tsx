
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { type Enfant } from "@/data/enfants";
import { type Paiement } from "@/data/paiements";

interface TableauLigneProps {
  paiement: Paiement;
  enfant: Enfant | undefined;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TableauLigne({ paiement, enfant, onEdit, onDelete }: TableauLigneProps) {
  return (
    <TableRow key={paiement.id}>
      <TableCell>{enfant ? `${enfant.prenom} ${enfant.nom}` : "Inconnu"}</TableCell>
      <TableCell>{enfant?.classe || "N/A"}</TableCell>
      <TableCell>{paiement.montant} DH</TableCell>
      <TableCell>{paiement.methodePaiement}</TableCell>
      <TableCell>
        {new Date(paiement.datePaiement).toLocaleDateString("fr-FR")}
      </TableCell>
      <TableCell>{paiement.statut}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(paiement.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(paiement.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
