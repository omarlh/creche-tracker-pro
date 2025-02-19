
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Enfant } from "@/data/enfants";

interface InscriptionsStatsProps {
  anneeScolaireSelectionnee: string;
  getStatistiquesAnnee: (annee: string) => {
    total: number;
    actifs: number;
    inactifs: number;
  };
}

export function InscriptionsStats({ 
  anneeScolaireSelectionnee, 
  getStatistiquesAnnee 
}: InscriptionsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total des inscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {getStatistiquesAnnee(anneeScolaireSelectionnee).total}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Élèves actifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {getStatistiquesAnnee(anneeScolaireSelectionnee).actifs}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Élèves inactifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-500">
            {getStatistiquesAnnee(anneeScolaireSelectionnee).inactifs}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Taux d'activité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {getStatistiquesAnnee(anneeScolaireSelectionnee).total > 0 
              ? Math.round((getStatistiquesAnnee(anneeScolaireSelectionnee).actifs / 
                  getStatistiquesAnnee(anneeScolaireSelectionnee).total) * 100)
              : 0}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
