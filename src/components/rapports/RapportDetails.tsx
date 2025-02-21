
import { Button } from "@/components/ui/button";
import { BadgeCheck, AlertCircle, Printer, Calendar } from "lucide-react";
import { type RapportMensuel } from "@/pages/Rapports";
import { type Enfant } from "@/data/enfants";
import { type Paiement } from "@/data/paiements";

interface RapportDetailsProps {
  rapport: RapportMensuel;
  onPrint: () => void;
  getEnfantById: (id: number) => Enfant | undefined;
  paiements: Paiement[];
}

export function RapportDetails({ rapport, onPrint, getEnfantById, paiements }: RapportDetailsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    // Add print-specific styles
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-content, .print-content * {
          visibility: visible;
        }
        .print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Call the print function
    window.print();

    // Remove the style after printing
    document.head.removeChild(style);
  };

  return (
    <div className="space-y-6 p-4 bg-background rounded-lg border print-content">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Rapport Mensuel</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrint}
          className="no-print hover:bg-secondary/80"
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimer le rapport
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-secondary/10 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Total des paiements</h4>
          <p className="text-lg font-semibold mt-1">{rapport.totalPaiements} DH</p>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Total des frais d'inscription</h4>
          <p className="text-lg font-semibold mt-1">{rapport.totalFraisInscription} DH</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-success/10 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Paiements complétés</h4>
          <p className="text-lg font-semibold text-success mt-1">{rapport.paiementsComplets}</p>
        </div>
        <div className="p-4 bg-warning/10 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Paiements en attente</h4>
          <p className="text-lg font-semibold text-warning mt-1">{rapport.paiementsAttente}</p>
        </div>
      </div>

      <div className="p-4 bg-primary/5 rounded-lg">
        <h4 className="text-sm font-medium text-gray-500">Taux de recouvrement</h4>
        <p className="text-lg font-semibold mt-1">{rapport.tauxRecouvrement}%</p>
      </div>

      <div className="mt-8">
        <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
          <BadgeCheck className="w-4 h-4 mr-2 text-success" />
          Enfants ayant payé
        </h4>
        <div className="space-y-4">
          {rapport.enfantsPaye.map((enfantId) => {
            const enfant = getEnfantById(enfantId);
            if (!enfant) return null;

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
                          Paiement mensuel
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

      <div className="mt-8">
        <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-warning" />
          Enfants en attente de paiement
        </h4>
        <div className="space-y-2">
          {rapport.enfantsNonPaye.map((enfantId) => {
            const enfant = getEnfantById(enfantId);
            return enfant ? (
              <div key={enfant.id} className="p-4 bg-warning/5 rounded-lg">
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
