
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface DateRangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (anneeScolaire: string) => void;
}

export function DateRangeDialog({
  open,
  onOpenChange,
  onConfirm
}: DateRangeDialogProps) {
  const [selectedAnneeScolaire, setSelectedAnneeScolaire] = useState("");
  
  // Generate school years (current year and 2 previous years)
  const getSchoolYears = () => {
    const currentYear = new Date().getFullYear();
    return [
      `${currentYear-2}-${currentYear-1}`,
      `${currentYear-1}-${currentYear}`,
      `${currentYear}-${currentYear+1}`,
    ];
  };

  const schoolYears = getSchoolYears();

  useEffect(() => {
    // Set default to current school year when dialog opens
    if (open) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const defaultYear = currentMonth >= 8 
        ? `${currentYear}-${currentYear+1}` 
        : `${currentYear-1}-${currentYear}`;
      
      setSelectedAnneeScolaire(defaultYear);
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm(selectedAnneeScolaire);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sélectionner l'année scolaire</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="anneeScolaire" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Année scolaire
            </Label>
            <Select 
              value={selectedAnneeScolaire} 
              onValueChange={setSelectedAnneeScolaire}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une année scolaire" />
              </SelectTrigger>
              <SelectContent>
                {schoolYears.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedAnneeScolaire}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Générer l'historique
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
