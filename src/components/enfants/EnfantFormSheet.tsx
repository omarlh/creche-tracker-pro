
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EnfantFormulaire } from "@/components/enfants/EnfantFormulaire";
import { type Enfant } from "@/data/enfants";

interface EnfantFormSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedEnfant: Enfant | null;
  showPaiementForm: boolean;
  setShowPaiementForm: (show: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export const EnfantFormSheet = ({
  isOpen,
  setIsOpen,
  selectedEnfant,
  showPaiementForm,
  setShowPaiementForm,
  onSubmit,
  onCancel,
}: EnfantFormSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {selectedEnfant ? "Modifier un enfant" : "Ajouter un enfant"}
          </SheetTitle>
        </SheetHeader>
        <EnfantFormulaire 
          selectedEnfant={selectedEnfant}
          showPaiementForm={showPaiementForm}
          onSubmit={onSubmit}
          onCancel={onCancel}
          setShowPaiementForm={setShowPaiementForm}
        />
      </SheetContent>
    </Sheet>
  );
};
