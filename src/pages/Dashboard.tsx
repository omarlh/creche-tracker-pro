
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEnfantStore } from "@/data/enfants"
import { usePaiementStore } from "@/data/paiements"
import { useEffect, useState } from "react"
import { AnneeScolaireSelect } from "@/components/paiements/forms/AnneeScolaireSelect"
import { getCurrentSchoolYear } from "@/lib/dateUtils"

const Dashboard = () => {
  const { enfants, fetchEnfants } = useEnfantStore()
  const { paiements, fetchPaiements } = usePaiementStore()
  const [anneeScolaire, setAnneeScolaire] = useState(getCurrentSchoolYear())

  useEffect(() => {
    fetchEnfants()
    fetchPaiements()
  }, [fetchEnfants, fetchPaiements])

  // Filtrer les enfants par année scolaire
  const enfantsFiltres = enfants.filter(e => e.anneeScolaire === anneeScolaire)
  const enfantsActifs = enfantsFiltres.filter(e => e.statut === "actif").length

  // Filtrer les paiements par année scolaire
  const paiementsFiltres = paiements.filter(p => p.anneeScolaire === anneeScolaire)
  
  // Calculer les totaux des paiements
  const totalMensualites = paiementsFiltres
    .filter(p => p.typePaiement === "mensualite")
    .reduce((sum, p) => sum + p.montant, 0)

  const totalInscriptions = paiementsFiltres
    .filter(p => p.typePaiement === "inscription")
    .reduce((sum, p) => sum + p.montant, 0)

  const totalPaiements = totalMensualites + totalInscriptions

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
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mensualités: {totalMensualites} DH</span>
                    <span>Inscriptions: {totalInscriptions} DH</span>
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
