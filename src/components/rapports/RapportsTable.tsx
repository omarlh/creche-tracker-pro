
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { type RapportMensuel } from "@/pages/Rapports";

interface RapportsTableProps {
  rapportsMensuels: RapportMensuel[];
  onDetailsClick: (rapport: RapportMensuel) => void;
}

export function RapportsTable({ rapportsMensuels, onDetailsClick }: RapportsTableProps) {
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDetailsClick(rapport)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
