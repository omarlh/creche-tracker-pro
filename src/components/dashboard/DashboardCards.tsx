
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardsProps {
  enfantsTotal: number;
  enfantsActifs: number;
  totalPaiements: number;
  totalMensualites: number;
  totalFraisInscription: number;
  moyennePaiements: string;
  anneeScolaire: string;
}

export const DashboardCards = ({
  enfantsTotal,
  enfantsActifs,
  totalPaiements,
  totalMensualites,
  totalFraisInscription,
  moyennePaiements,
  anneeScolaire,
}: DashboardCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Enfants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enfantsTotal}</div>
          <p className="text-xs text-muted-foreground">{anneeScolaire}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enfants Actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enfantsActifs}</div>
          <p className="text-xs text-muted-foreground">{anneeScolaire}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPaiements} DH</div>
          <div className="text-xs text-muted-foreground">
            <div>Mensualités: {totalMensualites} DH</div>
            <div>Frais d'inscription: {totalFraisInscription} DH</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Moyenne par Enfant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{moyennePaiements} DH</div>
          <p className="text-xs text-muted-foreground">Par enfant actif</p>
        </CardContent>
      </Card>
    </div>
  );
};
