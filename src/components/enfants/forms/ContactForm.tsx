
import { Input } from "@/components/ui/input";
import { type Enfant } from "@/data/enfants";

interface ContactFormProps {
  selectedEnfant: Enfant | null;
}

export const ContactForm = ({ selectedEnfant }: ContactFormProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="gsmMaman" className="text-sm font-medium">
          GSM Maman
        </label>
        <Input
          id="gsmMaman"
          name="gsmMaman"
          type="tel"
          defaultValue={selectedEnfant?.gsmMaman}
          placeholder="Numéro de téléphone"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="gsmPapa" className="text-sm font-medium">
          GSM Papa
        </label>
        <Input
          id="gsmPapa"
          name="gsmPapa"
          type="tel"
          defaultValue={selectedEnfant?.gsmPapa}
          placeholder="Numéro de téléphone"
        />
      </div>
    </div>
  );
};
