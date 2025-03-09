
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableauCroiseTableHeaderProps {
  moisScolaires: string[];
}

export function TableauCroiseTableHeader({ moisScolaires }: TableauCroiseTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead rowSpan={2} className="bg-muted">Nom</TableHead>
        <TableHead rowSpan={2} className="bg-muted">Classe</TableHead>
        <TableHead rowSpan={2} className="bg-muted">Date d'inscription</TableHead>
        <TableHead rowSpan={2} className="bg-muted">Année scolaire</TableHead>
        <TableHead rowSpan={2} className="bg-muted text-right">
          Frais d'inscription
        </TableHead>
        <TableHead colSpan={10} className="text-center bg-muted">
          Paiements mensuels
        </TableHead>
        <TableHead rowSpan={2} className="bg-muted text-center">
          Historique
        </TableHead>
      </TableRow>
      <TableRow>
        {moisScolaires.map((mois) => (
          <TableHead key={mois} className="text-right bg-muted/50">
            {mois}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
