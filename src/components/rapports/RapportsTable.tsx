
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";
import { type RapportMensuel } from "@/pages/Rapports";

interface RapportsTableProps {
  rapportsMensuels: RapportMensuel[];
  onDetailsClick: (rapport: RapportMensuel) => void;
}

export function RapportsTable({ rapportsMensuels, onDetailsClick }: RapportsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mois</TableHead>
            <TableHead>Paiements Mensuels</TableHead>
            <TableHead>Frais d'inscription</TableHead>
            <TableHead>Nombre d'enfants</TableHead>
            <TableHead>Paiements complétés</TableHead>
            <TableHead>Paiements en attente</TableHead>
            <TableHead>Taux de recouvrement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rapportsMensuels.map((rapport) => (
            <TableRow key={rapport.mois}>
              <TableCell>
                {new Date(rapport.mois).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>{rapport.totalPaiements} DH</TableCell>
              <TableCell>{rapport.totalFraisInscription} DH</TableCell>
              <TableCell>{rapport.nombreEnfants}</TableCell>
              <TableCell>
                <span className="text-success">{rapport.paiementsComplets}</span>
              </TableCell>
              <TableCell>
                <span className="text-warning">{rapport.paiementsAttente}</span>
              </TableCell>
              <TableCell>{rapport.tauxRecouvrement.toFixed(1)}%</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDetailsClick(rapport)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Détails
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
