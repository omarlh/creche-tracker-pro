
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface DateRangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (date: string) => void;
  onDateFinChange: (date: string) => void;
  onConfirm: () => void;
}

export const DateRangeDialog = ({
  open,
  onOpenChange,
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onConfirm
}: DateRangeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sélectionner la période</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dateDebut">Date de début</Label>
            <Input
              id="dateDebut"
              type="date"
              value={dateDebut}
              onChange={(e) => onDateDebutChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFin">Date de fin</Label>
            <Input
              id="dateFin"
              type="date"
              value={dateFin}
              onChange={(e) => onDateFinChange(e.target.value)}
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
            <Calendar className="w-4 h-4 mr-2" />
            Générer l'historique
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
