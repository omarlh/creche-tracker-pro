
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CaisseWhatsAppButton } from "./CaisseWhatsAppButton";

interface TableauActionsProps {
  totalJour: number;
  onExport: () => void;
}

export function TableauActions({ totalJour, onExport }: TableauActionsProps) {
  return (
    <div className="flex justify-between items-center p-4 border-t">
      <div className="text-lg font-semibold">
        Total de la journée: <span className="text-primary">{totalJour} DH</span>
      </div>
      <div className="flex gap-2">
        <CaisseWhatsAppButton totalJour={totalJour} />
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>
    </div>
  );
}
