
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { TableauLigne } from "./TableauLigne";

interface CaisseSummaryTableProps {
  paiementsByMethod: { methode: string; montant: number }[];
}

export function CaisseSummaryTable({ paiementsByMethod }: CaisseSummaryTableProps) {
  if (paiementsByMethod.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Aucun paiement trouvé pour cette période
      </div>
    );
  }

  return (
    <div className="border rounded-md mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Méthode de paiement</TableHead>
            <TableHead className="text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paiementsByMethod.map((item, index) => (
            <TableauLigne
              key={index}
              methode={item.methode}
              montant={item.montant}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
