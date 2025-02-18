
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const EnfantTableHeader = () => {
  return (
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
  );
};
