
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Printer } from "lucide-react";

export interface TableauActionsProps {
  onPrint: () => void;
  onExportExcel: () => void;
  totalPaiements: number;
}

export function TableauActions({ onPrint, onExportExcel, totalPaiements }: TableauActionsProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="text-lg font-semibold">
        Total: {totalPaiements.toFixed(2)} DH
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="no-print"
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportExcel}
          className="no-print"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exporter Excel
        </Button>
      </div>
    </div>
  );
}
