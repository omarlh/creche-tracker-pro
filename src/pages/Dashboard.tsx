
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEnfantStore } from "@/data/enfants"
import { usePaiementStore } from "@/data/paiements"
import { useEffect, useState } from "react"
import { AnneeScolaireSelect } from "@/components/paiements/forms/AnneeScolaireSelect"
import { getCurrentSchoolYear } from "@/lib/dateUtils"
import { supabase } from "@/integrations/supabase/client"

const Dashboard = () => {
  const { enfants, fetchEnfants } = useEnfantStore()
  const { paiements, fetchPaiements } = usePaiementStore()
  const [anneeScolaire, setAnneeScolaire] = useState(getCurrentSchoolYear())
  const [totalFraisInscription, setTotalFraisInscription] = useState(0)

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
