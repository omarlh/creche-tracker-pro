
interface TableauActionsProps {
  totalJour: number;
  onExport: () => void;
}

export function TableauActions({ totalJour, onExport }: TableauActionsProps) {
  return (
    <div className="flex justify-between items-center p-4 border-t">
      <div className="text-lg font-semibold">
        Total de la journée: <span className="text-primary">{totalJour.toFixed(2)} DH</span>
      </div>
      <div className="flex gap-2">
        {/* WhatsApp button removed */}
      </div>
    </div>
  );
}
