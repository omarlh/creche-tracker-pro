
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RetardsWhatsApp } from "./RetardsWhatsApp";

export interface RetardPaiement {
  id: number;
  enfantId: number;
  enfantNom: string;
  enfantPrenom: string;
  moisConcerne: string;
  montantDu: number;
  joursRetard: number;
  dernierRappel: string | null;
  type: 'inscription' | 'mensuel';
  telephone?: string;
}

interface RetardsTableProps {
  retards: RetardPaiement[];
}

export const RetardsTable = ({ retards }: RetardsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Enfant</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Mois concerné</TableHead>
            <TableHead>Montant dû</TableHead>
            <TableHead>Jours de retard</TableHead>
            <TableHead>Dernier rappel</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {retards.map((retard) => (
            <TableRow key={retard.id}>
              <TableCell>
                {retard.enfantPrenom} {retard.enfantNom}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  retard.type === 'inscription'
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}>
                  {retard.type === 'inscription' ? 'Inscription' : 'Mensuel'}
                </span>
              </TableCell>
              <TableCell>
                {format(new Date(retard.moisConcerne), 'MMMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell>{retard.montantDu} DH</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  retard.joursRetard > 20
                    ? "bg-destructive/10 text-destructive"
                    : retard.joursRetard > 10
                    ? "bg-warning/10 text-warning"
                    : "bg-muted/10 text-muted-foreground"
                }`}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {retard.joursRetard} jours
                </span>
              </TableCell>
              <TableCell>
                {retard.dernierRappel ? (
                  new Date(retard.dernierRappel).toLocaleDateString("fr-FR")
                ) : (
                  <span className="text-muted-foreground">Aucun rappel</span>
                )}
              </TableCell>
              <TableCell>
                <RetardsWhatsApp retard={retard} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

