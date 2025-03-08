
import { TableCell, TableRow } from "@/components/ui/table";

export interface TableauLigneProps {
  methode: string;
  montant: number;
}

export function TableauLigne({ methode, montant }: TableauLigneProps) {
  const formatMethode = (methode: string) => {
    switch (methode.toLowerCase()) {
      case "carte":
        return "Carte bancaire";
      case "especes":
        return "Espèces";
      case "cheque":
        return "Chèque";
      default:
        return methode.charAt(0).toUpperCase() + methode.slice(1);
    }
  };

  return (
    <TableRow>
      <TableCell>{formatMethode(methode)}</TableCell>
      <TableCell className="text-right">{montant.toFixed(2)} DH</TableCell>
    </TableRow>
  );
}
