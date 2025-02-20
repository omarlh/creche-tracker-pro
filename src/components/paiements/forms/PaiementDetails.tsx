
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaiementDetailsProps {
  montant: number;
  datePaiement: string;
  methodePaiement: "carte" | "especes" | "cheque";
  commentaire: string;
  onMontantChange: (value: number) => void;
  onDatePaiementChange: (value: string) => void;
  onMethodePaiementChange: (value: "carte" | "especes" | "cheque") => void;
  onCommentaireChange: (value: string) => void;
}

export const PaiementDetails = ({
  montant,
  datePaiement,
  methodePaiement,
  commentaire,
  onMontantChange,
  onDatePaiementChange,
  onMethodePaiementChange,
  onCommentaireChange,
}: PaiementDetailsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="montant">Montant (DH)</Label>
        <Input
          id="montant"
          type="number"
          value={montant}
          onChange={(e) => onMontantChange(parseFloat(e.target.value))}
          min={0}
          required
        />
      </div>

      <div>
        <Label htmlFor="datePaiement">Date de paiement</Label>
        <Input
          id="datePaiement"
          type="date"
          value={datePaiement}
          onChange={(e) => onDatePaiementChange(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="methodePaiement">Méthode de paiement</Label>
        <Select value={methodePaiement} onValueChange={onMethodePaiementChange}>
          <SelectTrigger id="methodePaiement">
            <SelectValue placeholder="Sélectionner une méthode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="carte">Carte</SelectItem>
            <SelectItem value="especes">Espèces</SelectItem>
            <SelectItem value="cheque">Chèque</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="commentaire">Commentaire</Label>
        <Input
          id="commentaire"
          value={commentaire}
          onChange={(e) => onCommentaireChange(e.target.value)}
          placeholder="Ajouter un commentaire (optionnel)"
        />
      </div>
    </>
  );
};
