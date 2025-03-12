
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DetaillePaiementJour } from "./DetaillePaiementJour";

type PaiementJournalier = {
  date: string;
  totalScolarite: number;
  totalInscription: number;
  totalGeneral: number;
};

interface PaiementsDetailParDateProps {
  paiementsParDate: PaiementJournalier[];
}

export function PaiementsDetailParDate({ paiementsParDate }: PaiementsDetailParDateProps) {
  const [dateSelectionnee, setDateSelectionnee] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  };

  const handleVoirDetail = (date: string) => {
    setDateSelectionnee(date);
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total frais de scolarité</TableHead>
              <TableHead className="text-right">Total frais d'inscription</TableHead>
              <TableHead className="text-right">Total général</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paiementsParDate.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  Aucun paiement trouvé pour cette période
                </TableCell>
              </TableRow>
            ) : (
              paiementsParDate.map((jour, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(jour.date)}</TableCell>
                  <TableCell className="text-right">{jour.totalScolarite.toFixed(2)} DH</TableCell>
                  <TableCell className="text-right">{jour.totalInscription.toFixed(2)} DH</TableCell>
                  <TableCell className="text-right">{jour.totalGeneral.toFixed(2)} DH</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVoirDetail(jour.date)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detailed day view */}
      <DetaillePaiementJour
        date={dateSelectionnee}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  );
}
