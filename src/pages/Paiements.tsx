
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PaiementTableau } from "@/components/paiements/PaiementTableau";
import { PaiementFormulaire } from "@/components/paiements/PaiementFormulaire";
import { PaiementSearchBar } from "@/components/paiements/PaiementSearchBar";
import { DeletePaiementDialog } from "@/components/paiements/DeletePaiementDialog";
import { usePaiementManager } from "@/hooks/usePaiementManager";
import { useEffect } from "react";

const Paiements = () => {
  const {
    isSheetOpen,
    setIsSheetOpen,
    selectedPaiement,
    searchTerm,
    isSearchFocused,
    setIsSearchFocused,
    anneeScolaire,
    deletePassword,
    isPasswordError,
    paiementToDelete,
    moisDisponibles,
    defaultMontant,
    enfants,
    filteredPaiements,
    handleAddClick,
    handleEditClick,
    handleSearch,
    handleSubmit,
    confirmDeletePaiement,
    cancelDeletePaiement,
    handleDeletePaiement,
    setDeletePassword,
    fetchPaiements,
    fetchEnfants,
  } = usePaiementManager();

  useEffect(() => {
    fetchPaiements();
    fetchEnfants();
  }, [fetchPaiements, fetchEnfants]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">
                Gestion des Paiements de Scolarité
              </h1>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <PaiementSearchBar
                searchTerm={searchTerm}
                isSearchFocused={isSearchFocused}
                setIsSearchFocused={setIsSearchFocused}
                handleSearch={handleSearch}
              />
              <Button onClick={handleAddClick}>
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un paiement
              </Button>
            </div>

            <PaiementTableau
              paiements={filteredPaiements}
              enfants={enfants}
              onEdit={handleEditClick}
              confirmDeletePaiement={confirmDeletePaiement}
            />
          </div>
        </main>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {selectedPaiement ? "Modifier un paiement" : "Ajouter un paiement"}
              </SheetTitle>
            </SheetHeader>
            <PaiementFormulaire
              selectedPaiement={selectedPaiement}
              onSubmit={handleSubmit}
              onCancel={() => setIsSheetOpen(false)}
              anneeScolaire={anneeScolaire}
              moisDisponibles={moisDisponibles}
              defaultMontant={defaultMontant}
              enfants={enfants}
            />
          </SheetContent>
        </Sheet>

        <DeletePaiementDialog
          paiementToDelete={paiementToDelete}
          deletePassword={deletePassword}
          isPasswordError={isPasswordError}
          onCancel={cancelDeletePaiement}
          onConfirm={handleDeletePaiement}
          setDeletePassword={setDeletePassword}
        />
      </div>
    </SidebarProvider>
  );
};

export default Paiements;
