
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/components/ui/use-toast";
import { useEnfantStore, type Enfant } from "@/data/enfants";
import { EnfantTableau } from "@/components/enfants/EnfantTableau";
import { EnfantSearchBar } from "@/components/enfants/search/EnfantSearchBar";
import { EnfantSearchResult } from "@/components/enfants/search/EnfantSearchResult";
import { printEnfant } from "@/components/enfants/print/EnfantPrintPreview";
import { EnfantFormSheet } from "@/components/enfants/EnfantFormSheet";
import { handleEnfantSubmit } from "@/utils/enfantHelpers";
import { EnfantDateFilters } from "@/components/enfants/EnfantDateFilters";

const Enfants = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEnfant, setSelectedEnfant] = useState<Enfant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedEnfant, setSearchedEnfant] = useState<Enfant | null>(null);
  const [showPaiementForm, setShowPaiementForm] = useState(false);
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);
  const [filteredEnfants, setFilteredEnfants] = useState<Enfant[]>([]);
  
  const enfants = useEnfantStore((state) => state.enfants);
  const { toast } = useToast();

  useEffect(() => {
    if (!enfants) return;
    
    let filtered = [...enfants];
    
    // Filtrer par date de début
    if (dateDebut) {
      filtered = filtered.filter(enfant => {
        const inscriptionDate = enfant.dateInscription ? new Date(enfant.dateInscription) : null;
        return inscriptionDate ? inscriptionDate >= dateDebut : false;
      });
    }
    
    // Filtrer par date de fin
    if (dateFin) {
      const finDate = new Date(dateFin);
      finDate.setHours(23, 59, 59, 999); // Fin de journée
      
      filtered = filtered.filter(enfant => {
        const inscriptionDate = enfant.dateInscription ? new Date(enfant.dateInscription) : null;
        return inscriptionDate ? inscriptionDate <= finDate : false;
      });
    }
    
    setFilteredEnfants(filtered);
  }, [enfants, dateDebut, dateFin]);

  const handleAddClick = () => {
    setSelectedEnfant(null);
    setIsSheetOpen(true);
  };

  const handleEditClick = (enfant: Enfant) => {
    setSelectedEnfant(enfant);
    setIsSheetOpen(true);
  };

  const handleViewClick = (enfant: Enfant) => {
    console.log("Voir enfant:", enfant);
  };

  const calculerMontantRestant = (enfant: Enfant) => {
    const montantTotal = enfant.fraisInscription?.montantTotal || 0;
    const montantPaye = enfant.fraisInscription?.montantPaye || 0;
    return montantTotal - montantPaye;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchedEnfant(null);
      return;
    }

    const found = enfants.find(enfant => 
      `${enfant.prenom} ${enfant.nom}`.toLowerCase().includes(term.toLowerCase()) ||
      enfant.nom.toLowerCase().includes(term.toLowerCase()) ||
      enfant.prenom.toLowerCase().includes(term.toLowerCase())
    );

    setSearchedEnfant(found || null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleEnfantSubmit(e, selectedEnfant, showPaiementForm, setIsSheetOpen, setShowPaiementForm, toast);
  };

  const handlePrint = (enfant: Enfant) => {
    printEnfant(enfant, calculerMontantRestant);
  };

  const handleResetDates = () => {
    setDateDebut(undefined);
    setDateFin(undefined);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">
                Inscription Enfants
              </h1>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <EnfantSearchBar 
                searchTerm={searchTerm}
                onSearch={handleSearch}
              />
              <Button onClick={handleAddClick}>
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un enfant
              </Button>
            </div>

            <EnfantDateFilters 
              dateDebut={dateDebut}
              dateFin={dateFin}
              onDateDebutChange={setDateDebut}
              onDateFinChange={setDateFin}
              onResetDates={handleResetDates}
            />

            {searchedEnfant && (
              <EnfantSearchResult
                enfant={searchedEnfant}
                onEdit={handleEditClick}
                onPrint={handlePrint}
                calculerMontantRestant={calculerMontantRestant}
              />
            )}

            <EnfantTableau 
              enfants={searchTerm ? enfants : filteredEnfants}
              onEdit={handleEditClick}
              onView={handleViewClick}
              calculerMontantRestant={calculerMontantRestant}
            />
          </div>
        </main>

        <EnfantFormSheet 
          isOpen={isSheetOpen}
          setIsOpen={setIsSheetOpen}
          selectedEnfant={selectedEnfant}
          showPaiementForm={showPaiementForm}
          setShowPaiementForm={setShowPaiementForm}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsSheetOpen(false);
            setShowPaiementForm(false);
          }}
        />
      </div>
    </SidebarProvider>
  );
};

export default Enfants;
