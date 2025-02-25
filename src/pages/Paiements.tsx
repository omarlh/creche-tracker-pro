
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

const currentYear = new Date().getFullYear().toString();
const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

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
  } = usePaiementManager();

  useEffect(() => {
    fetchPaiements();
    fetchEnfants();
  }, [fetchPaiements, fetchEnfants]);

  const [selectedStartMonth, setSelectedStartMonth] = useState(currentMonth);
  const [selectedStartYear, setSelectedStartYear] = useState(currentYear);
  const [selectedEndMonth, setSelectedEndMonth] = useState(currentMonth);
  const [selectedEndYear, setSelectedEndYear] = useState(currentYear);

  // State pour les valeurs du formulaire
  const [selectedEnfantId, setSelectedEnfantId] = useState<number | null>(
    selectedPaiement?.enfantId || null
  );
  const [montant, setMontant] = useState<number>(
    selectedPaiement?.montant || defaultMontant
  );
  const [datePaiement, setDatePaiement] = useState<string>(
    selectedPaiement?.datePaiement || new Date().toISOString().split('T')[0]
  );
  const [moisConcerne, setMoisConcerne] = useState<string>(
    selectedPaiement?.moisConcerne || new Date().toISOString().split('T')[0]
  );
  const [methodePaiement, setMethodePaiement] = useState<"carte" | "especes" | "cheque">(
    selectedPaiement?.methodePaiement || "especes"
  );
  const [commentaire, setCommentaire] = useState<string>(
    selectedPaiement?.commentaire || ""
  );

  const filteredByDatePaiements = filteredPaiements.filter(paiement => {
    const paiementDate = new Date(paiement.datePaiement);
    const startDate = new Date(`${selectedStartYear}-${selectedStartMonth}-01`);
    const endDate = new Date(`${selectedEndYear}-${selectedEndMonth}-31`);
    
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
              selectedStartMonth={selectedStartMonth}
              selectedStartYear={selectedStartYear}
              selectedEndMonth={selectedEndMonth}
              selectedEndYear={selectedEndYear}
              onEnfantChange={handleEnfantFilter}
              onStartMonthChange={setSelectedStartMonth}
              onStartYearChange={setSelectedStartYear}
              onEndMonthChange={setSelectedEndMonth}
              onEndYearChange={setSelectedEndYear}
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
              onAnneeScolaireChange={(annee: string) => {/* Add your handler here */}}
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
