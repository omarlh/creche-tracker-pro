
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Enfant } from "@/data/enfants";

interface EnfantsTableProps {
  enfants: Enfant[];
}

export function EnfantsTable({ enfants }: EnfantsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Classe</TableHead>
            <TableHead>Date de naissance</TableHead>
            <TableHead>GSM Maman</TableHead>
            <TableHead>GSM Papa</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enfants?.map((enfant) => (
            <TableRow key={enfant.id}>
              <TableCell>{enfant.nom}</TableCell>
              <TableCell>{enfant.prenom}</TableCell>
              <TableCell>{enfant.classe}</TableCell>
              <TableCell>
                {new Date(enfant.dateNaissance || "").toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>{enfant.gsmMaman || "-"}</TableCell>
              <TableCell>{enfant.gsmPapa || "-"}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    enfant.statut === "actif"
                      ? "bg-success/10 text-success"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {enfant.statut === "actif" ? "Actif" : "Inactif"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
