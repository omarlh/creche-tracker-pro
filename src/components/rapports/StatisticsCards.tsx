
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type RapportMensuel } from "@/pages/Rapports";

interface StatisticsCardsProps {
  rapportsMensuels: RapportMensuel[];
}

export function StatisticsCards({ rapportsMensuels }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total des paiements mensuels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {rapportsMensuels.reduce((sum, rapport) => sum + rapport.totalPaiements, 0)} DH
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
            {rapportsMensuels.reduce((sum, rapport) => sum + rapport.totalFraisInscription, 0)} DH
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Nombre d'enfants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {rapportsMensuels[0]?.nombreEnfants || 0}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
