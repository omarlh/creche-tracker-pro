
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PaiementMensuel {
  mois: string;
  total: number;
  fraisInscription: number;
  nbPaiements: number;
}

interface PaiementsChartProps {
  paiementsMensuels: PaiementMensuel[];
  anneeScolaire: string;
  isLoading?: boolean;
}

export const PaiementsChart = ({ paiementsMensuels, anneeScolaire, isLoading = false }: PaiementsChartProps) => {
  // Format data for the chart
  const chartData = paiementsMensuels.map(p => ({
    ...p,
    // Ensure values are actual numbers
    total: typeof p.total === 'number' ? p.total : 0,
    fraisInscription: typeof p.fraisInscription === 'number' ? p.fraisInscription : 0
  }));

  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Paiements mensuels - {anneeScolaire}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="h-[90%] w-[95%]" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Aucune donnée disponible pour cette période
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="mois" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60} 
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} DH`, 'Montant']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="total" 
                    name="Mensualités" 
                    fill="#8884d8"
                  />
                  <Bar 
                    dataKey="fraisInscription" 
                    name="Frais d'inscription" 
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
