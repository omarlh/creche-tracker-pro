
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardCardsProps {
  enfantsTotal: number;
  enfantsActifs: number;
  totalPaiements: number;
  totalMensualites: number;
  totalFraisInscription: number;
  moyennePaiements: string;
  anneeScolaire: string;
  isLoading?: boolean;
}

export const DashboardCards = ({
  enfantsTotal,
  enfantsActifs,
  totalPaiements,
  totalMensualites,
  totalFraisInscription,
  moyennePaiements,
  anneeScolaire,
  isLoading = false,
}: DashboardCardsProps) => {
  // Ensure values are proper numbers to prevent display issues
  const safeTotal = isNaN(Number(totalPaiements)) ? 0 : totalPaiements;
  const safeMensualites = isNaN(Number(totalMensualites)) ? 0 : totalMensualites;
  const safeFraisInscription = isNaN(Number(totalFraisInscription)) ? 0 : totalFraisInscription;
  const safeMoyenne = isNaN(Number(moyennePaiements)) ? "0" : moyennePaiements;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Enfants</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{enfantsTotal}</div>
              <p className="text-xs text-muted-foreground">{anneeScolaire}</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enfants Actifs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{enfantsActifs}</div>
              <p className="text-xs text-muted-foreground">{anneeScolaire}</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-28 mb-1" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{safeTotal.toFixed(2)} DH</div>
              <div className="text-xs text-muted-foreground">
                <div>Mensualités: {safeMensualites.toFixed(2)} DH</div>
                <div>Frais d'inscription: {safeFraisInscription.toFixed(2)} DH</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Moyenne par Enfant</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-28 mb-2" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{Number(safeMoyenne).toFixed(2)} DH</div>
              <p className="text-xs text-muted-foreground">Par enfant actif</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
