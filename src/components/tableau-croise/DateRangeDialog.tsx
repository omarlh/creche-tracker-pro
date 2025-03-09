
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface DateRangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateDebut: string;
  dateFin: string;
  setDateDebut: (date: string) => void;
  setDateFin: (date: string) => void;
  onConfirm: () => void;
}

export function DateRangeDialog({
  open,
  onOpenChange,
  dateDebut,
  dateFin,
  setDateDebut,
  setDateFin,
  onConfirm
}: DateRangeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sélectionner la période</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dateDebut">Date début</Label>
            <Input
              id="dateDebut"
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFin">Date fin</Label>
            <Input
              id="dateFin"
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={!dateDebut || !dateFin}
          >
            <Clock className="w-4 h-4 mr-2" />
            Générer l'historique
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
