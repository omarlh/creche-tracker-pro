
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEnfantStore } from "@/data/enfants";
import { EnfantTableau } from "@/components/enfants/EnfantTableau";
import { useCallback, useMemo } from "react";

export default function Depart() {
  const allEnfants = useEnfantStore((state) => state.enfants);

  // Fonction pour obtenir l'année scolaire à partir d'une date
  const getAnneeScolaire = useCallback((date: string) => {
    const dateObj = new Date(date);
    const mois = dateObj.getMonth(); // 0-11
    const annee = dateObj.getFullYear();
    
    // Si nous sommes entre septembre et décembre, l'année scolaire commence cette année
    // Sinon, l'année scolaire a commencé l'année précédente
    if (mois >= 8) { // septembre et après
      return `${annee}-${annee + 1}`;
    } else {
      return `${annee - 1}-${annee}`;
    }
  }, []);

  // Grouper les enfants inactifs par année scolaire
  const enfantsParAnnee = useMemo(() => {
    const enfantsInactifs = allEnfants.filter(e => e.statut === "inactif");
    const groupes = new Map<string, typeof allEnfants>();

    enfantsInactifs.forEach(enfant => {
      if (!enfant.dernierPaiement) return;
      const anneeScolaire = getAnneeScolaire(enfant.dernierPaiement);
      if (!groupes.has(anneeScolaire)) {
        groupes.set(anneeScolaire, []);
      }
      groupes.get(anneeScolaire)?.push(enfant);
    });

    // Convertir la Map en array et trier par année scolaire décroissante
    return Array.from(groupes.entries())
      .sort((a, b) => b[0].localeCompare(a[0]));
  }, [allEnfants, getAnneeScolaire]);

  const calculerMontantRestant = useCallback((enfant) => {
    if (!enfant.fraisInscription) return 0;
    return enfant.fraisInscription.montantTotal - enfant.fraisInscription.montantPaye;
  }, []);

  const handleEdit = useCallback((enfant) => {
    console.log("Éditer", enfant);
  }, []);

  const handleView = useCallback((enfant) => {
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
                Liste des enfants qui ont quitté l'établissement par année scolaire
              </p>
            </div>
            <Separator />
            <div className="mt-6 space-y-8">
              {enfantsParAnnee.length === 0 ? (
                <p className="text-muted-foreground">
                  Aucun enfant n'a quitté l'établissement pour le moment.
                </p>
              ) : (
                enfantsParAnnee.map(([anneeScolaire, enfants]) => (
                  <div key={anneeScolaire}>
                    <h3 className="text-lg font-semibold mb-4">
                      Année scolaire {anneeScolaire}
                    </h3>
                    <EnfantTableau 
                      enfants={enfants}
                      onEdit={handleEdit}
                      onView={handleView}
                      calculerMontantRestant={calculerMontantRestant}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
