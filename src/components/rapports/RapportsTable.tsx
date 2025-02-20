
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Printer, FileSpreadsheet } from "lucide-react";
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
          "Mois": new Date(rapport.mois).toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric"
          }),
          "Total mensualités": rapport.totalPaiements,
          "Total inscriptions": rapport.totalFraisInscription,
          "Total général": rapport.totalPaiements + rapport.totalFraisInscription,
          "Paiements complétés": rapport.paiementsComplets,
          "Paiements en attente": rapport.paiementsAttente
        }
      ];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rapport Mensuel");
      XLSX.writeFile(workbook, `rapport_${new Date(rapport.mois).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}.xlsx`);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mois</TableHead>
            <TableHead className="text-right">Total mensualités</TableHead>
            <TableHead className="text-right">Total inscriptions</TableHead>
            <TableHead className="text-right">Total général</TableHead>
            <TableHead className="text-right">Paiements complétés</TableHead>
            <TableHead className="text-right">Paiements en attente</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rapportsMensuels.map((rapport) => (
            <TableRow key={rapport.mois}>
              <TableCell>
                {new Date(rapport.mois).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric"
                })}
              </TableCell>
              <TableCell className="text-right">{rapport.totalPaiements} DH</TableCell>
              <TableCell className="text-right">{rapport.totalFraisInscription} DH</TableCell>
              <TableCell className="text-right">{rapport.totalPaiements + rapport.totalFraisInscription} DH</TableCell>
              <TableCell className="text-right text-success">{rapport.paiementsComplets}</TableCell>
              <TableCell className="text-right text-warning">{rapport.paiementsAttente}</TableCell>
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
                    <FileSpreadsheet className="h-4 w-4" />
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
