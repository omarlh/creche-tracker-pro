
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEnfantStore } from "@/data/enfants";
import { Button } from "@/components/ui/button";
import { Printer, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const anneesDisponibles = [
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
  "2028-2029",
  "2029-2030",
  "2030-2031",
  "2031-2032",
  "2032-2033",
];

const Index = () => {
  const { enfants, modifierEnfant } = useEnfantStore();
  const [anneeScolaire, setAnneeScolaire] = useState("2023-2024");
  const [isUpdating, setIsUpdating] = useState(false);

  const enfantsFiltres = enfants.filter(enfant => enfant.anneeScolaire === anneeScolaire);

  // Calculer les statistiques des frais d'inscription
  const totalFraisInscription = enfantsFiltres.reduce((total, enfant) => 
    total + (enfant.fraisInscription?.montantTotal || 0), 0
  );
  
  const totalFraisInscriptionPayes = enfantsFiltres.reduce((total, enfant) => 
    total + (enfant.fraisInscription?.montantPaye || 0), 0
  );

  const nombreEnfantsActifs = enfantsFiltres.filter(enfant => enfant.statut === "actif").length;
  const nombreEnfantsAvecRetard = enfantsFiltres.filter(enfant => 
    (enfant.fraisInscription?.montantTotal || 0) > (enfant.fraisInscription?.montantPaye || 0)
  ).length;

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateAll = () => {
    setIsUpdating(true);
    try {
      // Mettre à jour les données de chaque enfant
      enfants.forEach(enfant => {
        // Calculer le montant total payé
        const montantPaye = enfant.fraisInscription?.paiements.reduce(
          (total, paiement) => total + paiement.montant, 
          0
        ) || 0;

        // Trouver le dernier paiement
        const dernierPaiement = enfant.fraisInscription?.paiements
          .sort((a, b) => new Date(b.datePaiement).getTime() - new Date(a.datePaiement).getTime())[0];

        // Mettre à jour l'enfant
        modifierEnfant({
          ...enfant,
          fraisInscription: {
            ...enfant.fraisInscription,
            montantPaye: montantPaye
          },
          dernierPaiement: dernierPaiement?.datePaiement || enfant.dernierPaiement
        });
      });

      toast({
        title: "Mise à jour réussie",
        description: "Toutes les données ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la mise à jour",
        description: "Une erreur est survenue lors de la mise à jour des données.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8 print:p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold">Tableau de bord</h1>
                <div>
                  <Select
                    value={anneeScolaire}
                    onValueChange={setAnneeScolaire}
                  >
                    <SelectTrigger className="w-[180px] bg-gray-100 border-gray-200 opacity-100">
                      <SelectValue placeholder="Année scolaire" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-100 border-gray-200 opacity-100">
                      {anneesDisponibles.map((annee) => (
                        <SelectItem key={annee} value={annee}>
                          {annee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-x-2 print:hidden">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleUpdateAll}
                  disabled={isUpdating}
                >
                  <RefreshCcw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                  Mettre à jour les données
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </div>
            
            {/* Statistiques générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 print:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 print:border print:shadow-none">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Total enfants actifs</h2>
                <p className="text-2xl font-semibold text-primary">{nombreEnfantsActifs}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 print:border print:shadow-none">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Retards de paiement</h2>
                <p className="text-2xl font-semibold text-destructive">{nombreEnfantsAvecRetard}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 print:border print:shadow-none">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Total des paiements du mois</h2>
                <p className="text-2xl font-semibold text-success">
                  {enfantsFiltres.reduce((total, enfant) => {
                    const paiementsDuMois = enfant.fraisInscription?.paiements.filter(p => {
                      const datePaiement = new Date(p.datePaiement);
                      const maintenant = new Date();
                      return datePaiement.getMonth() === maintenant.getMonth() &&
                             datePaiement.getFullYear() === maintenant.getFullYear();
                    }) || [];
                    return total + paiementsDuMois.reduce((sum, p) => sum + p.montant, 0);
                  }, 0)} DH
                </p>
              </div>
            </div>

            {/* Statistiques des frais d'inscription */}
            <h2 className="text-xl font-semibold mb-4">Frais d'inscription</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 print:border print:shadow-none">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total à percevoir</h3>
                <p className="text-2xl font-semibold text-primary">{totalFraisInscription} DH</p>
                <div className="mt-2 text-sm text-gray-500">
                  Pour {enfantsFiltres.length} enfants inscrits
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 print:border print:shadow-none">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total perçu</h3>
                <p className="text-2xl font-semibold text-success">{totalFraisInscriptionPayes} DH</p>
                <div className="mt-2 text-sm text-gray-500">
                  {Math.round((totalFraisInscriptionPayes / totalFraisInscription) * 100)}% des frais collectés
                </div>
              </div>
            </div>

            {/* Détail des paiements par mois */}
            <h2 className="text-xl font-semibold mb-4">Paiements par mois</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 print:border print:shadow-none">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3">Mois</th>
                    <th className="pb-3">Nombre de paiements</th>
                    <th className="pb-3 text-right">Montant total</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 3 }).map((_, index) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - index);
                    
                    const paiementsDuMois = enfantsFiltres.flatMap(enfant => 
                      enfant.fraisInscription?.paiements.filter(p => {
                        const datePaiement = new Date(p.datePaiement);
                        return datePaiement.getMonth() === date.getMonth() &&
                               datePaiement.getFullYear() === date.getFullYear();
                      }) || []
                    );

                    const totalMois = paiementsDuMois.reduce((sum, p) => sum + p.montant, 0);

                    return (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3">
                          {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date)}
                        </td>
                        <td className="py-3">{paiementsDuMois.length}</td>
                        <td className="py-3 text-right font-medium">{totalMois} DH</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
