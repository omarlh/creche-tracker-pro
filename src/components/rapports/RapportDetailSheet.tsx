
import React from 'react';
import { type RapportMensuel } from "@/pages/Rapports";
import { type Enfant } from "@/data/enfants";
import { type Paiement } from "@/data/paiements";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RapportDetails } from "./RapportDetails";

interface RapportDetailSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rapport: RapportMensuel | null;
  getEnfantById: (id: number) => Enfant | undefined;
  paiements: Paiement[];
  onPrint: () => void;
}

export function RapportDetailSheet({
  isOpen,
  onOpenChange,
  rapport,
  getEnfantById,
  paiements,
  onPrint
}: RapportDetailSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto print:w-full print:max-w-none print:overflow-visible">
        <SheetHeader>
          <SheetTitle>
            Détails du rapport - {rapport && new Date(rapport.mois).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </SheetTitle>
        </SheetHeader>
        <div className="py-6">
          {rapport && (
            <RapportDetails
              rapport={rapport}
              onPrint={onPrint}
              getEnfantById={getEnfantById}
              paiements={paiements}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
