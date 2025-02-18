
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEnfantStore } from "@/data/enfants";
import { EnfantTableau } from "@/components/enfants/EnfantTableau";
import { useMemo } from "react";

export default function Depart() {
  const enfants = useEnfantStore((state) => 
    state.enfants.filter(e => e.statut === "inactif")
  );

  // Mémorisation de la fonction calculerMontantRestant pour éviter des re-renders inutiles
  const calculerMontantRestant = useMemo(() => (enfant) => {
    if (!enfant.fraisInscription) return 0;
    return enfant.fraisInscription.montantTotal - enfant.fraisInscription.montantPaye;
  }, []);

  // Fonctions mémorisées pour éviter des re-renders inutiles
  const handleEdit = useMemo(() => (enfant) => {
    console.log("Éditer", enfant);
  }, []);

  const handleView = useMemo(() => (enfant) => {
    console.log("Voir", enfant);
  }, []);

  return (
    <SidebarProvider>
      <div className="grid lg:grid-cols-5 min-h-screen w-full">
        <AppSidebar />
        <div className="col-span-4 p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Départ</h2>
              <p className="text-muted-foreground">
                Liste des enfants qui ont quitté l'établissement
              </p>
            </div>
            <Separator />
            <div className="mt-6">
              {enfants.length === 0 ? (
                <p className="text-muted-foreground">
                  Aucun enfant n'a quitté l'établissement pour le moment.
                </p>
              ) : (
                <EnfantTableau 
                  enfants={enfants}
                  onEdit={handleEdit}
                  onView={handleView}
                  calculerMontantRestant={calculerMontantRestant}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
