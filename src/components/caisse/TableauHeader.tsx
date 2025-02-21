
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableauHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Enfant</TableHead>
        <TableHead>Classe</TableHead>
        <TableHead>Montant</TableHead>
        <TableHead>Méthode de paiement</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
