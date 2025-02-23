
import { TableCell, TableRow } from "@/components/ui/table";

export interface TableauLigneProps {
  methode: string;
  montant: number;
}

export function TableauLigne({ methode, montant }: TableauLigneProps) {
  const formatMethode = (methode: string) => {
    switch (methode) {
      case "carte":
        return "Carte bancaire";
      case "especes":
        return "Espèces";
      case "cheque":
        return "Chèque";
      default:
        return methode;
    }
  };

  return (
    <TableRow>
      <TableCell>{formatMethode(methode)}</TableCell>
      <TableCell className="text-right">{montant.toFixed(2)} DH</TableCell>
    </TableRow>
  );
}
