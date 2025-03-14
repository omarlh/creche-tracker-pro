
import { useState, useEffect } from 'react';
import { useEnfantStore } from "@/data/enfants";
import { CommunicationHeader } from "@/components/communication/CommunicationHeader";
import { CommunicationTable } from "@/components/communication/CommunicationTable";
import { CommunicationFilter } from "@/components/communication/CommunicationFilter";
import { CommunicationWhatsAppButton } from "@/components/communication/CommunicationWhatsAppButton";
import type { Enfant } from "@/types/enfant.types";

export default function Communication() {
  const { enfants, fetchEnfants } = useEnfantStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasse, setSelectedClasse] = useState<string>("all");
  const [selectedAnneeScolaire, setSelectedAnneeScolaire] = useState<string>("2024-2025");
  const [filteredEnfants, setFilteredEnfants] = useState<Enfant[]>([]);
  const [selectedEnfant, setSelectedEnfant] = useState<Enfant | null>(null);
  
  // Normaliser l'année scolaire pour la comparaison
  const normalizeSchoolYear = (year: string | undefined): string => {
    if (!year) return "";
    return year.trim().replace('/', '-');
  };
  
  useEffect(() => {
    fetchEnfants();
  }, [fetchEnfants]);

  useEffect(() => {
    let filtered = [...enfants];
    
    // Si un enfant spécifique est sélectionné, ne montrer que cet enfant
    if (selectedEnfant) {
      filtered = [selectedEnfant];
    } else {
      // Filtre par année scolaire
      if (selectedAnneeScolaire !== "all") {
        const normalizedSelectedYear = normalizeSchoolYear(selectedAnneeScolaire);
        filtered = filtered.filter(enfant => 
          normalizeSchoolYear(enfant.anneeScolaire) === normalizedSelectedYear
        );
      }
      
      // Filtre par classe
      if (selectedClasse !== "all") {
        filtered = filtered.filter(enfant => enfant.classe === selectedClasse);
      }
      
      // Filtre par terme de recherche s'il n'y a pas d'enfant sélectionné
      if (searchTerm && !selectedEnfant) {
        const searchTermLower = searchTerm.toLowerCase();
        filtered = filtered.filter(enfant =>
          enfant.nom.toLowerCase().includes(searchTermLower) ||
          enfant.prenom.toLowerCase().includes(searchTermLower)
        );
      }
    }
    
    // Exclure les enfants sans numéro GSM
    filtered = filtered.filter(enfant => 
      (enfant.gsmMaman && enfant.gsmMaman.trim() !== "") || 
      (enfant.gsmPapa && enfant.gsmPapa.trim() !== "")
    );
    
    // Trier les enfants par nom
    filtered.sort((a, b) => a.nom.localeCompare(b.nom));
    
    setFilteredEnfants(filtered);
  }, [enfants, searchTerm, selectedClasse, selectedAnneeScolaire, selectedEnfant]);

  const handleEnfantSelect = (enfant: Enfant) => {
    setSelectedEnfant(enfant);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (term === "") {
      setSelectedEnfant(null);
    }
  };

  return (
    <div className="container py-8">
      <CommunicationHeader />
      
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <CommunicationFilter 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedClasse={selectedClasse}
          onClasseChange={setSelectedClasse}
          selectedAnneeScolaire={selectedAnneeScolaire}
          onAnneeScolaireChange={setSelectedAnneeScolaire}
          enfants={enfants}
          onEnfantSelect={handleEnfantSelect}
        />
        
        <CommunicationWhatsAppButton 
          enfants={filteredEnfants} 
          className="w-full md:w-auto" 
        />
      </div>

      <CommunicationTable enfants={filteredEnfants} />
    </div>
  );
}
