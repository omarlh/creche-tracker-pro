
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Banknote, CheckCircle2 } from "lucide-react";

export interface RetardsStatsProps {
  statistiques: {
    total: number;
    enRetard: number;
    critique: number;
    aJour: number;
    montantTotal: number;
  };
}

export function RetardsStats({ statistiques }: RetardsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Élèves Actifs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistiques.total}</div>
          <p className="text-xs text-muted-foreground">
            {statistiques.aJour} à jour | {statistiques.enRetard + statistiques.critique} en retard
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En Retard</CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistiques.enRetard}</div>
          <p className="text-xs text-muted-foreground">
            Retard de 1 à 30 jours
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critiques</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistiques.critique}</div>
          <p className="text-xs text-muted-foreground">
            Retard de plus de 30 jours
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Montant Total Dû</CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistiques.montantTotal} DH</div>
          <p className="text-xs text-muted-foreground">
            Pour {statistiques.enRetard + statistiques.critique} élèves en retard
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
