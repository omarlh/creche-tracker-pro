
import { Button } from "@/components/ui/button";
import { type Enfant } from "@/data/enfants";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { ContactForm } from "./forms/ContactForm";
import { PaymentForm } from "./forms/PaymentForm";
import { StatusForm } from "./forms/StatusForm";

interface EnfantFormulaireProps {
  selectedEnfant: Enfant | null;
  showPaiementForm: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  setShowPaiementForm: (show: boolean) => void;
}

const anneesDisponibles = [
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
  "2028-2029",
  "2029-2030",
  "2030-2031",
  "2031-2032",
  "2032-2033"
];

export const EnfantFormulaire = ({
  selectedEnfant,
  showPaiementForm,
  onSubmit,
  onCancel,
  setShowPaiementForm,
}: EnfantFormulaireProps) => {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
      <PersonalInfoForm selectedEnfant={selectedEnfant} />
      <ContactForm selectedEnfant={selectedEnfant} />
      <PaymentForm 
        selectedEnfant={selectedEnfant}
        showPaiementForm={showPaiementForm}
        setShowPaiementForm={setShowPaiementForm}
        anneesDisponibles={anneesDisponibles}
      />
      <StatusForm selectedEnfant={selectedEnfant} />

      <div className="pt-4 space-x-2 flex justify-end">
        <Button 
          variant="outline" 
          type="button" 
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};
