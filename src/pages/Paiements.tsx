
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PaiementTableau } from "@/components/paiements/PaiementTableau";
import { PaiementFormulaire } from "@/components/paiements/PaiementFormulaire";
import { PaiementSearchBar } from "@/components/paiements/PaiementSearchBar";
import { PaiementFilters } from "@/components/paiements/PaiementFilters";
import { DeletePaiementDialog } from "@/components/paiements/DeletePaiementDialog";
import { usePaiementManager } from "@/hooks/usePaiementManager";
import { useEffect, useState } from "react";

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
    defaultMontant,
    enfants,
    filteredPaiements,
    selectedEnfant,
    handleAddClick,
    handleEditClick,
    handleSearch,
    handleSubmit,
    handleEnfantFilter,
    confirmDeletePaiement,
    cancelDeletePaiement,
    handleDeletePaiement,
    setDeletePassword,
    fetchPaiements,
    fetchEnfants,
    setAnneeScolaire
  } = usePaiementManager();

  useEffect(() => {
    fetchPaiements();
    fetchEnfants();
  }, [fetchPaiements, fetchEnfants]);

  // Initialiser avec le premier jour du mois actuel pour la date de début
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const [selectedStartDate, setSelectedStartDate] = useState(firstDayOfMonth);
  const [selectedEndDate, setSelectedEndDate] = useState(today.toISOString().split('T')[0]);

  const [selectedEnfantId, setSelectedEnfantId] = useState<number | null>(
    selectedPaiement?.enfantId || null
  );
  const [montant, setMontant] = useState<number>(
    selectedPaiement?.montant || defaultMontant
  );
  const [datePaiement, setDatePaiement] = useState<string>(
    selectedPaiement?.datePaiement || today.toISOString().split('T')[0]
  );
  const [moisConcerne, setMoisConcerne] = useState<string>(
    selectedPaiement?.moisConcerne || today.toISOString().split('T')[0]
  );
  const [methodePaiement, setMethodePaiement] = useState<"carte" | "especes" | "cheque">(
    selectedPaiement?.methodePaiement || "especes"
  );
  const [commentaire, setCommentaire] = useState<string>(
    selectedPaiement?.commentaire || ""
  );

  const filteredByDatePaiements = filteredPaiements.filter(paiement => {
    const paiementDate = new Date(paiement.datePaiement);
    const startDate = new Date(selectedStartDate);
    const endDate = new Date(selectedEndDate);
    
    // Ajuster les dates pour ignorer l'heure
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return paiementDate >= startDate && paiementDate <= endDate;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">
                Paiements des frais de Scolarité
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

            <PaiementFilters
              selectedEnfant={selectedEnfant}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              onEnfantChange={handleEnfantFilter}
              onStartDateChange={setSelectedStartDate}
              onEndDateChange={setSelectedEndDate}
              enfants={enfants}
            />

            <PaiementTableau
              paiements={filteredByDatePaiements}
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
              open={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              selectedEnfantId={selectedEnfantId}
              onEnfantChange={setSelectedEnfantId}
              montant={montant}
              onMontantChange={setMontant}
              datePaiement={datePaiement}
              onDatePaiementChange={setDatePaiement}
              moisConcerne={moisConcerne}
              onMoisConcerneChange={setMoisConcerne}
              methodePaiement={methodePaiement}
              onMethodePaiementChange={setMethodePaiement}
              commentaire={commentaire}
              onCommentaireChange={setCommentaire}
              anneeScolaire={anneeScolaire}
              onAnneeScolaireChange={setAnneeScolaire}
              selectedPaiement={selectedPaiement}
              defaultMontant={defaultMontant}
              enfants={enfants}
              onSubmit={handleSubmit}
              onCancel={() => setIsSheetOpen(false)}
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
