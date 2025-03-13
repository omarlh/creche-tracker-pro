
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PaiementTableHeader = () => {
  return (
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
  );
};
