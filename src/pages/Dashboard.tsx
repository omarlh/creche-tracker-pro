
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEnfantStore } from "@/data/enfants"
import { usePaiementStore } from "@/data/paiements"
import { AnneeScolaireSelect } from "@/components/paiements/forms/AnneeScolaireSelect"
import { getCurrentSchoolYear, getMoisAnneeScolaire } from "@/lib/dateUtils"
import { supabase } from "@/integrations/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const { enfants, fetchEnfants } = useEnfantStore()
  const { paiements, fetchPaiements } = usePaiementStore()
  const [anneeScolaire, setAnneeScolaire] = useState(getCurrentSchoolYear())
  const [totalFraisInscription, setTotalFraisInscription] = useState(0)
  const [paiementsMensuels, setPaiementsMensuels] = useState<any[]>([])

  useEffect(() => {
    fetchEnfants()
    fetchPaiements()
  }, [fetchEnfants, fetchPaiements])

  // Récupérer les frais d'inscription
  useEffect(() => {
    const getFraisInscription = async () => {
      // Récupérer les IDs des enfants pour l'année scolaire sélectionnée
      const enfantIds = enfants
        .filter(e => e.anneeScolaire === anneeScolaire)
        .map(e => e.id)

      if (enfantIds.length === 0) {
        setTotalFraisInscription(0)
        return
      }

      // Récupérer tous les paiements d'inscription pour ces enfants
      const { data, error } = await supabase
        .from('paiements_inscription')
        .select('montant')
        .in('enfant_id', enfantIds)

      if (error) {
        console.error('Erreur lors de la récupération des frais d\'inscription:', error)
        return
      }

      // Calculer le total des frais d'inscription
      const total = data.reduce((sum, p) => sum + (p.montant || 0), 0)
      setTotalFraisInscription(total)
    }

    getFraisInscription()
  }, [anneeScolaire, enfants])

  // Calculer les paiements par mois pour l'année scolaire sélectionnée
  useEffect(() => {
    const calculerPaiementsMensuels = () => {
      const moisScolaires = getMoisAnneeScolaire(anneeScolaire)
      
      // Récupérer l'année de début de l'année scolaire
      const [anneeDebut] = anneeScolaire.split('-')
      
      // Créer les données pour chaque mois de l'année scolaire
      const donneesParMois = moisScolaires.map((mois, index) => {
        // Déterminer le mois et l'année
        const moisIndex = index <= 3 ? index + 8 : index - 4 // 8 = septembre, 9 = octobre, etc.
        const annee = index <= 3 ? parseInt(anneeDebut) : parseInt(anneeDebut) + 1
        
        // Filtrer les paiements pour ce mois et cette année scolaire
        const paiementsMois = paiements.filter(p => {
          const datePaiement = new Date(p.datePaiement)
          return (
            datePaiement.getMonth() === moisIndex && 
            datePaiement.getFullYear() === annee &&
            p.anneeScolaire === anneeScolaire
          )
        })
        
        // Calculer le total des paiements pour ce mois
        const totalMois = paiementsMois.reduce((sum, p) => sum + p.montant, 0)
        
        return {
          mois,
          total: totalMois,
          nbPaiements: paiementsMois.length
        }
      })
      
      setPaiementsMensuels(donneesParMois)
    }
    
    calculerPaiementsMensuels()
  }, [paiements, anneeScolaire])

  // Filtrer les enfants par année scolaire
  const enfantsFiltres = enfants.filter(e => e.anneeScolaire === anneeScolaire)
  const enfantsActifs = enfantsFiltres.filter(e => e.statut === "actif").length

  // Filtrer les paiements par année scolaire
  const paiementsFiltres = paiements.filter(p => p.anneeScolaire === anneeScolaire)
  
  // Calculer le total des mensualités
  const totalMensualites = paiementsFiltres.reduce((sum, p) => sum + p.montant, 0)

  // Calculer le total global (mensualités + frais d'inscription)
  const totalPaiements = totalMensualites + totalFraisInscription

  // Calculer la moyenne par enfant (uniquement pour les enfants actifs)
  const moyennePaiements = enfantsActifs ? (totalPaiements / enfantsActifs).toFixed(2) : 0

  return (
    <main className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <div className="w-64">
            <AnneeScolaireSelect
              value={anneeScolaire}
              onChange={(value) => setAnneeScolaire(value)}
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
                      name="Montant" 
                      fill="#8884d8"
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
                      <th className="text-right py-3 px-4">Montant total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paiementsMensuels.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{item.mois}</td>
                        <td className="py-3 px-4">{item.nbPaiements}</td>
                        <td className="py-3 px-4 text-right font-medium">{item.total} DH</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/50 font-medium">
                      <td className="py-3 px-4">Total</td>
                      <td className="py-3 px-4">{paiementsMensuels.reduce((sum, item) => sum + item.nbPaiements, 0)}</td>
                      <td className="py-3 px-4 text-right">{paiementsMensuels.reduce((sum, item) => sum + item.total, 0)} DH</td>
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
