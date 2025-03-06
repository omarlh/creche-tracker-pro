
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PaiementMensuel {
  mois: string;
  total: number;
  fraisInscription: number;
  nbPaiements: number;
}

interface PaiementsChartProps {
  paiementsMensuels: PaiementMensuel[];
  anneeScolaire: string;
}

export const PaiementsChart = ({ paiementsMensuels, anneeScolaire }: PaiementsChartProps) => {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Paiements mensuels - {anneeScolaire}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={paiementsMensuels}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
