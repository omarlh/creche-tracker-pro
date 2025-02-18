
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEnfantStore } from "@/data/enfants";
import { EnfantTableau } from "@/components/enfants/EnfantTableau";
import { useCallback, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Depart() {
  const allEnfants = useEnfantStore((state) => state.enfants);
  const [selectedAnnee, setSelectedAnnee] = useState<string>("all");

  // Fonction pour obtenir l'année scolaire à partir d'une date
  const getAnneeScolaire = useCallback((date: string) => {
    const dateObj = new Date(date);
    const mois = dateObj.getMonth(); // 0-11
    const annee = dateObj.getFullYear();
    
    if (mois >= 8) {
      return `${annee}-${annee + 1}`;
    } else {
      return `${annee - 1}-${annee}`;
    }
  }, []);

  // Obtenir la liste des années scolaires disponibles
  const anneesDisponibles = useMemo(() => {
    const annees = new Set<string>();
    
    // Ajouter les années des enfants existants
    allEnfants
      .filter(e => e.statut === "inactif" && e.dernierPaiement)
      .forEach(enfant => {
        if (enfant.dernierPaiement) {
          annees.add(getAnneeScolaire(enfant.dernierPaiement));
        }
      });

    // Ajouter les années futures prédéfinies
    const anneesFutures = [
      "2024-2025",
      "2025-2026",
      "2026-2027",
      "2027-2028",
      "2028-2029",
      "2029-2030"
    ];
    
    anneesFutures.forEach(annee => annees.add(annee));
    
    return Array.from(annees).sort((a, b) => b.localeCompare(a));
  }, [allEnfants, getAnneeScolaire]);

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

    // Filtrer par année sélectionnée si une année est sélectionnée
    if (selectedAnnee !== "all") {
      return Array.from(groupes.entries())
        .filter(([annee]) => annee === selectedAnnee);
    }

    return Array.from(groupes.entries())
      .sort((a, b) => b[0].localeCompare(a[0]));
  }, [allEnfants, getAnneeScolaire, selectedAnnee]);

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
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Départ</h2>
              <p className="text-muted-foreground">
                Liste des enfants qui ont quitté l'établissement par année scolaire
              </p>
            </div>
            <Separator className="my-2" />
            <div className="w-[250px]">
              <Select
                value={selectedAnnee}
                onValueChange={setSelectedAnnee}
              >
                <SelectTrigger className="bg-gray-100/80 backdrop-blur-sm border-gray-300">
                  <SelectValue placeholder="Sélectionner une année scolaire" />
                </SelectTrigger>
                <SelectContent className="bg-gray-50 border-gray-300">
                  <SelectItem value="all">Toutes les années</SelectItem>
                  <SelectItem value="reset">Réinitialiser la sélection</SelectItem>
                  <Separator className="my-2" />
                  {anneesDisponibles.map((annee) => (
                    <SelectItem key={annee} value={annee}>
                      Année {annee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              {enfantsParAnnee.length === 0 ? (
                <p className="text-muted-foreground">
                  Aucun enfant n'a quitté l'établissement pour le moment.
                </p>
              ) : (
                enfantsParAnnee.map(([anneeScolaire, enfants]) => (
                  <div key={anneeScolaire}>
                    <h3 className="text-lg font-semibold mb-2">
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
