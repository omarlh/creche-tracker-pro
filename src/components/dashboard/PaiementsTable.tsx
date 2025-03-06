
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PaiementMensuel {
  mois: string;
  total: number;
  fraisInscription: number;
  nbPaiements: number;
}

interface PaiementsTableProps {
  paiementsMensuels: PaiementMensuel[];
  isLoading?: boolean;
}

export const PaiementsTable = ({ paiementsMensuels, isLoading = false }: PaiementsTableProps) => {
  const renderSkeletonRows = () => {
    return Array(10).fill(0).map((_, index) => (
      <tr key={index} className="border-b">
        <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
        <td className="py-3 px-4"><Skeleton className="h-4 w-10" /></td>
        <td className="py-3 px-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
        <td className="py-3 px-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
        <td className="py-3 px-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
      </tr>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détail des paiements par mois</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Mois</th>
                <th className="text-left py-3 px-4">Nombre de paiements</th>
                <th className="text-right py-3 px-4">Montant mensualités</th>
                <th className="text-right py-3 px-4">Frais d'inscription</th>
                <th className="text-right py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                renderSkeletonRows()
              ) : (
                <>
                  {paiementsMensuels.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{item.mois}</td>
                      <td className="py-3 px-4">{item.nbPaiements}</td>
                      <td className="py-3 px-4 text-right font-medium">{item.total} DH</td>
                      <td className="py-3 px-4 text-right font-medium">{item.fraisInscription} DH</td>
                      <td className="py-3 px-4 text-right font-medium">{item.total + item.fraisInscription} DH</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-medium">
                    <td className="py-3 px-4">Total</td>
                    <td className="py-3 px-4">{paiementsMensuels.reduce((sum, item) => sum + item.nbPaiements, 0)}</td>
                    <td className="py-3 px-4 text-right">{paiementsMensuels.reduce((sum, item) => sum + item.total, 0)} DH</td>
                    <td className="py-3 px-4 text-right">{paiementsMensuels.reduce((sum, item) => sum + item.fraisInscription, 0)} DH</td>
                    <td className="py-3 px-4 text-right">{paiementsMensuels.reduce((sum, item) => sum + item.total + item.fraisInscription, 0)} DH</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
