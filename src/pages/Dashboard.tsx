
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEnfantStore } from "@/data/enfants"
import { usePaiementStore } from "@/data/paiements"
import { useEffect } from "react"

const Dashboard = () => {
  const { enfants, fetchEnfants } = useEnfantStore()
  const { paiements, fetchPaiements } = usePaiementStore()

  useEffect(() => {
    fetchEnfants()
    fetchPaiements()
  }, [fetchEnfants, fetchPaiements])

  const totalEnfants = enfants.length
  const enfantsActifs = enfants.filter(e => e.statut === "actif").length
  const totalPaiements = paiements.reduce((sum, p) => sum + p.montant, 0)
  const moyennePaiements = totalEnfants ? (totalPaiements / totalEnfants).toFixed(2) : 0

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Enfants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEnfants}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enfants Actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{enfantsActifs}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Paiements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPaiements} DH</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Moyenne par Enfant</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{moyennePaiements} DH</div>
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
