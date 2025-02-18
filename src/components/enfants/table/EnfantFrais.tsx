
import { Wallet } from "lucide-react";
import { type Enfant } from "@/data/enfants";

interface EnfantFraisProps {
  enfant: Enfant;
  calculerMontantRestant: (enfant: Enfant) => number;
}

export const EnfantFrais = ({ enfant, calculerMontantRestant }: EnfantFraisProps) => {
  const montantRestant = calculerMontantRestant(enfant);
  
  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center ${
        enfant.fraisInscription?.montantPaye === enfant.fraisInscription?.montantTotal
          ? "text-success"
          : "text-warning"
      }`}>
        <Wallet className="w-4 h-4 mr-1" />
        {enfant.fraisInscription?.montantPaye || 0} DH / {enfant.fraisInscription?.montantTotal || 0} DH
      </span>
      {montantRestant > 0 && (
        <span className="text-xs text-muted-foreground">
          Reste à payer : {montantRestant} DH
        </span>
      )}
    </div>
  );
};
