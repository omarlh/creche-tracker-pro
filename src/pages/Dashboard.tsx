import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEnfantStore } from "@/data/enfants"
import { usePaiementStore } from "@/data/paiements"
import { AnneeScolaireSelect } from "@/components/paiements/forms/AnneeScolaireSelect"
import { 
  getCurrentSchoolYear, 
  getMoisAnneeScolaire, 
  getSchoolYearDateRange,
  isDateInSchoolYear
} from "@/lib/dateUtils"
import { supabase } from "@/integrations/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const { enfants, fetchEnfants } = useEnfantStore()
  const { paiements, fetchPaiements } = usePaiementStore()
  const [anneeScolaire, setAnneeScolaire] = useState(getCurrentSchoolYear())
  const [totalFraisInscription, setTotalFraisInscription] = useState(0)
  const [paiementsMensuels, setPaiementsMensuels] = useState<any[]>([])
  const [fraisInscriptionParMois, setFraisInscriptionParMois] = useState<Record<string, number>>({})

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchEnfants(), fetchPaiements()]);
    };
    loadData();
  }, [fetchEnfants, fetchPaiements]);

  useEffect(() => {
    const getFraisInscription = async () => {
      setTotalFraisInscription(0);
      setFraisInscriptionParMois({});
      setPaiementsMensuels([]);

      const enfantIds = enfants
        .filter(e => e.anneeScolaire === anneeScolaire)
        .map(e => e.id);

      if (enfantIds.length === 0) {
        return;
      }

      const { data, error } = await supabase
        .from('paiements_inscription')
        .select('montant, date_paiement')
        .in('enfant_id', enfantIds);

      if (error) {
        console.error('Erreur lors de la récupération des frais d\'inscription:', error);
        return;
      }

      const { start, end } = getSchoolYearDateRange(anneeScolaire);
      const filteredData = data.filter(p => {
        const paymentDate = new Date(p.date_paiement);
        return paymentDate >= start && paymentDate <= end;
      });

      const total = filteredData.reduce((sum, p) => sum + (Number(p.montant) || 0), 0);
      setTotalFraisInscription(total);

      const parMois: Record<string, number> = {};
      
      filteredData.forEach(p => {
        const date = new Date(p.date_paiement);
        const moisScolaires = getMoisAnneeScolaire();
        let moisIndex;
        
        if (date.getMonth() >= 8) { // Septembre à Décembre
          moisIndex = date.getMonth() - 8;
        } else { // Janvier à Juin
          moisIndex = date.getMonth() + 4;
        }
        
        if (moisIndex >= 0 && moisIndex < moisScolaires.length) {
          const moisNom = moisScolaires[moisIndex];
          parMois[moisNom] = (parMois[moisNom] || 0) + (Number(p.montant) || 0);
        }
      });
      
      setFraisInscriptionParMois(parMois);
    };

    getFraisInscription();
  }, [anneeScolaire, enfants]);

  useEffect(() => {
    const calculerPaiementsMensuels = () => {
      const moisScolaires = getMoisAnneeScolaire();
      const dateRange = getSchoolYearDateRange(anneeScolaire);
      
      const paiementsAnnee = paiements.filter(p => {
        if (p.anneeScolaire === anneeScolaire) {
          return true;
        }
        const datePaiement = new Date(p.datePaiement);
        return isDateInSchoolYear(datePaiement, anneeScolaire);
      });
      
      const donneesParMois = moisScolaires.map((mois, index) => {
        const [anneeDebut, anneeFin] = anneeScolaire.split('-').map(y => parseInt(y));
        const moisNum = index <= 3 ? index + 8 : index - 4;
        const annee = index <= 3 ? anneeDebut : anneeFin;
        
        const dateDebut = new Date(annee, moisNum, 1);
        const dateFin = new Date(annee, moisNum + 1, 0);
        
        const paiementsMois = paiementsAnnee.filter(p => {
          const datePaiement = new Date(p.datePaiement);
          return datePaiement >= dateDebut && datePaiement <= dateFin;
        });
        
        const totalMois = paiementsMois.reduce((sum, p) => sum + Number(p.montant), 0);
        const fraisInscription = fraisInscriptionParMois[mois] || 0;
        
        return {
          mois,
          total: totalMois,
          fraisInscription,
          nbPaiements: paiementsMois.length
        };
      });
      
      setPaiementsMensuels(donneesParMois);
    };
    
    calculerPaiementsMensuels();
  }, [paiements, anneeScolaire, fraisInscriptionParMois]);

  const enfantsFiltres = enfants.filter(e => e.anneeScolaire === anneeScolaire);
  const enfantsActifs = enfantsFiltres.filter(e => e.statut === "actif").length;

  const totalMensualites = paiementsMensuels.reduce((sum, m) => sum + m.total, 0);

  const totalPaiements = totalMensualites + totalFraisInscription;

  const moyennePaiements = enfantsActifs ? (totalPaiements / enfantsActifs).toFixed(2) : "0";

  return (
    <main className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <div className="w-64">
            <AnneeScolaireSelect
              value={anneeScolaire}
              onChange={(value) => {
                setAnneeScolaire(value);
                fetchEnfants();
                fetchPaiements();
              }}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enfants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enfantsFiltres.length}</div>
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

        <div>
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
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
