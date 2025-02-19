
import { Button } from "@/components/ui/button";
import { BadgeCheck, AlertCircle, Printer } from "lucide-react";
import { type RapportMensuel } from "@/pages/Rapports";
import { type Enfant } from "@/data/enfants";

interface RapportDetailsProps {
  rapport: RapportMensuel;
  onPrint: () => void;
  getEnfantById: (id: number) => Enfant | undefined;
}

export function RapportDetails({ rapport, onPrint, getEnfantById }: RapportDetailsProps) {
  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onPrint}
        className="print:hidden"
      >
        <Printer className="w-4 h-4 mr-2" />
        Imprimer
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Total des paiements</h4>
          <p className="text-lg font-semibold mt-1">{rapport.totalPaiements} DH</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Total des frais d'inscription</h4>
          <p className="text-lg font-semibold mt-1">{rapport.totalFraisInscription} DH</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Paiements complétés</h4>
          <p className="text-lg font-semibold text-success mt-1">{rapport.paiementsComplets}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Paiements en attente</h4>
          <p className="text-lg font-semibold text-warning mt-1">{rapport.paiementsAttente}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500">Taux de recouvrement</h4>
        <p className="text-lg font-semibold mt-1">{rapport.tauxRecouvrement}%</p>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
          <BadgeCheck className="w-4 h-4 mr-2 text-success" />
          Enfants ayant payé
        </h4>
        <div className="space-y-2">
          {rapport.enfantsPaye.map((enfantId) => {
            const enfant = getEnfantById(enfantId);
            return enfant ? (
              <div key={enfant.id} className="p-2 bg-success/5 rounded-md">
                <p className="text-sm font-medium">
                  {enfant.prenom} {enfant.nom}
                </p>
                <p className="text-xs text-gray-500">
                  Classe: {enfant.classe}
                </p>
              </div>
            ) : null;
          })}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-warning" />
          Enfants en attente de paiement
        </h4>
        <div className="space-y-2">
          {rapport.enfantsNonPaye.map((enfantId) => {
            const enfant = getEnfantById(enfantId);
            return enfant ? (
              <div key={enfant.id} className="p-2 bg-warning/5 rounded-md">
                <p className="text-sm font-medium">
                  {enfant.prenom} {enfant.nom}
                </p>
                <p className="text-xs text-gray-500">
                  Classe: {enfant.classe}
                </p>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
