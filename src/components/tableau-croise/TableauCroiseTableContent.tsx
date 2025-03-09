
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import type { Enfant } from "@/types/enfant.types";

interface TableauCroiseTableContentProps {
  filteredEnfants: Enfant[];
  moisScolaires: string[];
  getPaiementMensuel: (enfantId: number, mois: string) => any;
  getMontantInscription: (enfantId: number) => { montantTotal: number; montantPaye: number };
  onHistoriqueClick: (enfantId: number) => void;
}

export function TableauCroiseTableContent({
  filteredEnfants,
  moisScolaires,
  getPaiementMensuel,
  getMontantInscription,
  onHistoriqueClick
}: TableauCroiseTableContentProps) {
  return (
    <TableBody>
      {filteredEnfants.map((enfant) => {
        const inscription = getMontantInscription(enfant.id);
        return (
          <TableRow key={enfant.id}>
            <TableCell className="font-medium">
              {enfant.prenom} {enfant.nom}
            </TableCell>
            <TableCell>
              {enfant.classe || "-"}
            </TableCell>
            <TableCell>
              {enfant.dateInscription ? new Date(enfant.dateInscription).toLocaleDateString() : "-"}
            </TableCell>
            <TableCell>
              {enfant.anneeScolaire || "-"}
            </TableCell>
            <TableCell className={`text-right ${
              inscription.montantPaye >= inscription.montantTotal 
                ? "bg-green-50" 
                : "bg-red-50"
            }`}>
              {inscription.montantPaye}/{inscription.montantTotal} DH
            </TableCell>
            {moisScolaires.map((mois) => {
              const paiement = getPaiementMensuel(enfant.id, mois);
              return (
                <TableCell 
                  key={`${enfant.id}-${mois}`} 
                  className={`text-right ${paiement ? "bg-green-50" : "bg-red-50"}`}
                >
                  {paiement ? `${paiement.montant} DH` : "-"}
                </TableCell>
              );
            })}
            <TableCell className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onHistoriqueClick(enfant.id)}
              >
                <Clock className="w-4 h-4 mr-1" />
                Voir
              </Button>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
