
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Printer, FileText } from "lucide-react";
import { type RapportMensuel } from "@/pages/Rapports";
import * as XLSX from 'xlsx';

interface RapportsTableProps {
  rapportsMensuels: RapportMensuel[];
  onDetailsClick: (rapport: RapportMensuel) => void;
}

export function RapportsTable({ rapportsMensuels, onDetailsClick }: RapportsTableProps) {
  const handlePrint = (rapport: RapportMensuel) => {
    window.print();
  };

  const handleExportExcel = (rapport: RapportMensuel) => {
    try {
      const data = [
        {
          "Date": new Date(rapport.mois).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric"
          }),
          "Total des frais de scolarité": rapport.totalPaiements,
          "Total des frais d'inscription": rapport.totalFraisInscription,
          "Total général": rapport.totalPaiements + rapport.totalFraisInscription
        }
      ];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rapport Journalier");
      XLSX.writeFile(workbook, `rapport_${rapport.mois}.xlsx`);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total des frais de scolarité</TableHead>
            <TableHead className="text-right">Total des frais d'inscription</TableHead>
            <TableHead className="text-right">Total général</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rapportsMensuels.map((rapport) => (
            <TableRow key={rapport.mois}>
              <TableCell>
                {new Date(rapport.mois).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </TableCell>
              <TableCell className="text-right">{rapport.totalPaiements} DH</TableCell>
              <TableCell className="text-right">{rapport.totalFraisInscription} DH</TableCell>
              <TableCell className="text-right">{rapport.totalPaiements + rapport.totalFraisInscription} DH</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDetailsClick(rapport)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePrint(rapport)}
                    title="Imprimer"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleExportExcel(rapport)}
                    title="Exporter en Excel"
                  >
                    <FileText className="h-4 w-4" />
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
