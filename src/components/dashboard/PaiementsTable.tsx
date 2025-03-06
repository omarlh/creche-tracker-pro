
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

  // Ensure all values are numbers to prevent NaN in calculations
  const safeData = paiementsMensuels.map(item => ({
    ...item,
    total: typeof item.total === 'number' ? item.total : 0,
    fraisInscription: typeof item.fraisInscription === 'number' ? item.fraisInscription : 0,
    nbPaiements: typeof item.nbPaiements === 'number' ? item.nbPaiements : 0,
  }));

  // Calculate totals safely
  const totalNbPaiements = safeData.reduce((sum, item) => sum + item.nbPaiements, 0);
  const totalMensualites = safeData.reduce((sum, item) => sum + item.total, 0);
  const totalFraisInscription = safeData.reduce((sum, item) => sum + item.fraisInscription, 0);
  const totalGeneral = totalMensualites + totalFraisInscription;

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
              ) : safeData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Aucune donnée disponible pour cette période
                  </td>
                </tr>
              ) : (
                <>
                  {safeData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{item.mois}</td>
                      <td className="py-3 px-4">{item.nbPaiements}</td>
                      <td className="py-3 px-4 text-right font-medium">{item.total.toFixed(2)} DH</td>
                      <td className="py-3 px-4 text-right font-medium">{item.fraisInscription.toFixed(2)} DH</td>
                      <td className="py-3 px-4 text-right font-medium">{(item.total + item.fraisInscription).toFixed(2)} DH</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-medium">
                    <td className="py-3 px-4">Total</td>
                    <td className="py-3 px-4">{totalNbPaiements}</td>
                    <td className="py-3 px-4 text-right">{totalMensualites.toFixed(2)} DH</td>
                    <td className="py-3 px-4 text-right">{totalFraisInscription.toFixed(2)} DH</td>
                    <td className="py-3 px-4 text-right">{totalGeneral.toFixed(2)} DH</td>
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
