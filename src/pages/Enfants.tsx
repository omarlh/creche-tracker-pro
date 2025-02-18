
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/components/ui/use-toast";
import { useEnfantStore, type Enfant, type PaiementFraisInscription } from "@/data/enfants";
import { EnfantTableau } from "@/components/enfants/EnfantTableau";
import { EnfantFormulaire } from "@/components/enfants/EnfantFormulaire";

const Enfants = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEnfant, setSelectedEnfant] = useState<Enfant | null>(null);
  const { enfants, ajouterEnfant, modifierEnfant } = useEnfantStore();
  const { toast } = useToast();
  const [showPaiementForm, setShowPaiementForm] = useState(false);

  const handleAddClick = () => {
    setSelectedEnfant(null);
    setIsSheetOpen(true);
  };

  const handleEditClick = (enfant: Enfant) => {
    setSelectedEnfant(enfant);
    setIsSheetOpen(true);
  };

  const handleViewClick = (enfant: Enfant) => {
    // TODO: Implémenter la vue détaillée
    console.log("Voir enfant:", enfant);
  };

  const calculerMontantRestant = (enfant: Enfant) => {
    const montantTotal = enfant.fraisInscription?.montantTotal || 0;
    const montantPaye = enfant.fraisInscription?.montantPaye || 0;
    return montantTotal - montantPaye;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const montantTotal = Number(formData.get("montantTotal") || 300);
    const montantPaiement = Number(formData.get("montantPaiement") || 0);
    const methodePaiement = formData.get("methodePaiement") as "carte" | "especes" | "cheque";

    const nouveauPaiement: PaiementFraisInscription | null = montantPaiement > 0 ? {
      id: Date.now(),
      montant: montantPaiement,
      datePaiement: new Date().toISOString().split('T')[0],
      methodePaiement,
    } : null;

    const nouvelEnfant = {
      nom: formData.get("nom") as string,
      prenom: formData.get("prenom") as string,
      dateNaissance: formData.get("dateNaissance") as string,
      classe: formData.get("classe") as "TPS" | "PS" | "MS" | "GS",
      fraisInscription: {
        montantTotal,
        montantPaye: montantPaiement,
        paiements: nouveauPaiement ? [nouveauPaiement] : [],
      },
      statut: (formData.get("statut") as "actif" | "inactif") || "actif",
      dernierPaiement: new Date().toISOString().split('T')[0],
    };

    if (selectedEnfant) {
      const paiementsExistants = selectedEnfant.fraisInscription?.paiements || [];
      const montantDejaRegle = selectedEnfant.fraisInscription?.montantPaye || 0;
      
      const enfantModifie = {
        ...nouvelEnfant,
        id: selectedEnfant.id,
        fraisInscription: {
          ...nouvelEnfant.fraisInscription,
          montantPaye: montantDejaRegle + (montantPaiement || 0),
          paiements: nouveauPaiement 
            ? [...paiementsExistants, nouveauPaiement]
            : paiementsExistants,
        },
      };

      modifierEnfant(enfantModifie);
      toast({
        title: "Modification réussie",
        description: `Les informations de ${nouvelEnfant.prenom} ont été mises à jour.`,
      });
    } else {
      ajouterEnfant(nouvelEnfant);
      toast({
        title: "Ajout réussi",
        description: `${nouvelEnfant.prenom} a été ajouté(e) à la liste.`,
      });
    }

    setIsSheetOpen(false);
    setShowPaiementForm(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Gestion des Enfants</h1>
              <Button onClick={handleAddClick}>
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un enfant
              </Button>
            </div>

            <EnfantTableau 
              enfants={enfants}
              onEdit={handleEditClick}
              onView={handleViewClick}
              calculerMontantRestant={calculerMontantRestant}
            />
          </div>
        </main>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {selectedEnfant ? "Modifier un enfant" : "Ajouter un enfant"}
              </SheetTitle>
            </SheetHeader>
            <EnfantFormulaire 
              selectedEnfant={selectedEnfant}
              showPaiementForm={showPaiementForm}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsSheetOpen(false);
                setShowPaiementForm(false);
              }}
              setShowPaiementForm={setShowPaiementForm}
            />
          </SheetContent>
        </Sheet>
      </div>
    </SidebarProvider>
  );
};

export default Enfants;
