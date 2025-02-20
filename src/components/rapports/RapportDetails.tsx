
import { Button } from "@/components/ui/button";
import { BadgeCheck, AlertCircle, Printer, Calendar } from "lucide-react";
import { type RapportMensuel } from "@/pages/Rapports";
import { type Enfant } from "@/data/enfants";
import { type Paiement } from "@/data/paiements";

interface RapportDetailsProps {
  rapport: RapportMensuel;
  onPrint: () => void;
  getEnfantById: (id: number) => Enfant | undefined;
  paiements: Paiement[];  // Ajout des paiements comme prop
}

export function RapportDetails({ rapport, onPrint, getEnfantById, paiements }: RapportDetailsProps) {
  // Formater la date en français
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formater le type de paiement en français
  const formatTypePaiement = (type: string) => {
    switch (type) {
      case "mensualite":
        return "Mensualité";
      case "inscription":
        return "Frais d'inscription";
      default:
        return type;
    }
  };

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
        <div className="space-y-4">
          {rapport.enfantsPaye.map((enfantId) => {
            const enfant = getEnfantById(enfantId);
            if (!enfant) return null;

            // Filtrer les paiements de cet enfant
            const paiementsEnfant = paiements.filter(p => p.enfantId === enfantId);

            return (
              <div key={enfant.id} className="bg-success/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-base font-medium">
                      {enfant.prenom} {enfant.nom}
                    </p>
                    <p className="text-sm text-gray-500">
                      Classe: {enfant.classe}
                    </p>
                  </div>
                </div>

                {/* Liste des paiements */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Historique des paiements
                  </h5>
                  {paiementsEnfant.map((paiement) => (
                    <div 
                      key={paiement.id} 
                      className="bg-white p-2 rounded border border-gray-100 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {formatTypePaiement(paiement.typePaiement)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(paiement.datePaiement)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">{paiement.montant} DH</p>
                    </div>
                  ))}
                </div>
              </div>
            );
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
