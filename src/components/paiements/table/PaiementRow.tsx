
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, CreditCard, Receipt, BadgeCheck, Pencil, Trash2 } from "lucide-react";
import type { Paiement } from "@/data/paiements";
import type { Enfant } from "@/data/enfants";

interface PaiementRowProps {
  paiement: Paiement;
  enfant: Enfant | undefined;
  onEdit: (paiement: Paiement) => void;
  confirmDeletePaiement: (paiement: Paiement) => void;
  onPrintClick: (enfantId: number) => void;
}

export const PaiementRow = ({ 
  paiement, 
  enfant, 
  onEdit, 
  confirmDeletePaiement,
  onPrintClick
}: PaiementRowProps) => {
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
          onClick={() => onPrintClick(paiement.enfantId)}
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
};
