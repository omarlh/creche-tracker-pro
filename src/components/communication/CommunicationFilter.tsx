
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Enfant } from "@/types/enfant.types";

interface CommunicationFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedClasse: string;
  onClasseChange: (classe: string) => void;
  selectedAnneeScolaire: string;
  onAnneeScolaireChange: (annee: string) => void;
  enfants: Enfant[];
  onEnfantSelect: (enfant: Enfant) => void;
}

export function CommunicationFilter({
  searchTerm,
  onSearchChange,
  selectedClasse,
  onClasseChange,
  selectedAnneeScolaire,
  onAnneeScolaireChange,
  enfants,
  onEnfantSelect
}: CommunicationFilterProps) {
  const classes = ["TPS", "PS", "MS", "GS"];
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredEnfants, setFilteredEnfants] = useState<Enfant[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const genererAnneeScolaires = () => {
    const anneesDisponibles = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = -5; i <= 5; i++) {
      const anneeDebut = currentYear + i;
      const anneeFin = anneeDebut + 1;
      anneesDisponibles.push(`${anneeDebut}-${anneeFin}`);
    }
    
    return anneesDisponibles;
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = enfants
        .filter(enfant => 
          enfant.nom.toLowerCase().includes(searchTermLower) || 
          enfant.prenom.toLowerCase().includes(searchTermLower)
        )
        .sort((a, b) => {
          // Sort by last name
          return a.nom.localeCompare(b.nom) || a.prenom.localeCompare(b.prenom);
        })
        .slice(0, 10); // Limit to first 10 results for better performance
      
      setFilteredEnfants(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [searchTerm, enfants]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEnfantSelect = (enfant: Enfant) => {
    onEnfantSelect(enfant);
    onSearchChange(`${enfant.nom} ${enfant.prenom}`);
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Recherche par nom/prénom avec dropdown */}
      <div className="relative flex-1 md:max-w-xs" ref={dropdownRef}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un enfant..."
          className="pl-10 pr-10"
          onFocus={() => {
            if (searchTerm.length > 0 && filteredEnfants.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Dropdown list of enfants */}
        {showDropdown && (
          <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
            <ul className="py-1">
              {filteredEnfants.map((enfant) => (
                <li 
                  key={enfant.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => handleEnfantSelect(enfant)}
                >
                  <span className="font-medium">{enfant.nom} {enfant.prenom}</span>
                  <span className="text-xs text-gray-500">{enfant.classe || "Pas de classe"}</span>
                </li>
              ))}
              {filteredEnfants.length === 0 && (
                <li className="px-4 py-2 text-gray-500">Aucun résultat</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Filtre par classe */}
      <div className="flex-1 md:max-w-xs">
        <Label htmlFor="classe" className="mb-2 block">
          Classe
        </Label>
        <Select value={selectedClasse} onValueChange={onClasseChange}>
          <SelectTrigger id="classe">
            <SelectValue placeholder="Toutes les classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            {classes.map((classe) => (
              <SelectItem key={classe} value={classe}>
                {classe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtre par année scolaire */}
      <div className="flex-1 md:max-w-xs">
        <Label htmlFor="anneeScolaire" className="mb-2 block">
          Année scolaire
        </Label>
        <Select value={selectedAnneeScolaire} onValueChange={onAnneeScolaireChange}>
          <SelectTrigger id="anneeScolaire">
            <SelectValue placeholder="Sélectionner une année scolaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les années</SelectItem>
            {genererAnneeScolaires().map((annee) => (
              <SelectItem key={annee} value={annee}>
                {annee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
