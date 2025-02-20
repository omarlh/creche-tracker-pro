
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
}

interface RetardsTableProps {
  retards: RetardPaiement[];
  onEnvoyerRappel: (retardId: number, gsmMaman?: string, gsmPapa?: string) => void;
}

export const RetardsTable = ({ retards, onEnvoyerRappel }: RetardsTableProps) => {
  const formatMessage = (retard: RetardPaiement) => {
    const typeRetard = retard.type === 'inscription' ? "frais d'inscription" : "mensualité";
    const periode = retard.type === 'inscription' 
      ? "l'inscription" 
      : format(new Date(retard.moisConcerne), 'MMMM yyyy', { locale: fr });
    
    return encodeURIComponent(
      `Bonjour, nous vous rappelons que le paiement de ${typeRetard} pour ${retard.enfantPrenom} ${retard.enfantNom} ` +
      `pour ${periode} d'un montant de ${retard.montantDu} DH est en retard de ${retard.joursRetard} jours. ` +
      `Merci de régulariser la situation dès que possible.`
    );
  };

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
            <TableHead className="text-right print:hidden">Actions</TableHead>
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
              <TableCell className="text-right print:hidden">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onEnvoyerRappel(retard.id);
                      const whatsappUrl = `https://wa.me/send?text=${formatMessage(retard)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer rappel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
