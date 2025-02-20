
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type RapportMensuel } from "@/pages/Rapports";

interface StatisticsCardsProps {
  rapportsMensuels: RapportMensuel[];
}

export function StatisticsCards({ rapportsMensuels }: StatisticsCardsProps) {
  const totalMensuel = rapportsMensuels.reduce((sum, rapport) => sum + rapport.totalPaiements, 0);
  const totalInscriptions = rapportsMensuels.reduce((sum, rapport) => sum + rapport.totalFraisInscription, 0);
  const totalAnnee = totalMensuel + totalInscriptions;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total mensualités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {totalMensuel} DH
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total des frais d'inscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {totalInscriptions} DH
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de l'année
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {totalAnnee} DH
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
