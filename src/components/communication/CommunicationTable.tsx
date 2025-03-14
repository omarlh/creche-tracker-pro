
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone } from "lucide-react";
import type { Enfant } from "@/types/enfant.types";
import { CommunicationTableActions } from "./CommunicationTableActions";

interface CommunicationTableProps {
  enfants: Enfant[];
}

export function CommunicationTable({ enfants }: CommunicationTableProps) {
  if (enfants.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        Aucun contact trouvé pour les critères sélectionnés.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Classe</TableHead>
            <TableHead>GSM Papa</TableHead>
            <TableHead>GSM Maman</TableHead>
            <TableHead>Année scolaire</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enfants.map((enfant) => (
            <TableRow key={enfant.id}>
              <TableCell className="font-medium">{enfant.nom}</TableCell>
              <TableCell>{enfant.prenom}</TableCell>
              <TableCell>{enfant.classe || "-"}</TableCell>
              <TableCell>
                {enfant.gsmPapa ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {enfant.gsmPapa}
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                {enfant.gsmMaman ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {enfant.gsmMaman}
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{enfant.anneeScolaire || "2024-2025"}</TableCell>
              <TableCell className="text-right">
                <CommunicationTableActions enfant={enfant} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
