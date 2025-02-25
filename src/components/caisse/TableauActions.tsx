
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { CaisseWhatsAppButton } from "./CaisseWhatsAppButton"

interface TableauActionsProps {
  totalJour: number;
  onExport: () => void;
}

export function TableauActions({ totalJour, onExport }: TableauActionsProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-xl font-bold">
        Total: {totalJour} DH
      </div>
      <div className="flex items-center gap-2">
        <CaisseWhatsAppButton totalJour={totalJour} />
        <Button variant="outline" size="sm" onClick={onExport}>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
