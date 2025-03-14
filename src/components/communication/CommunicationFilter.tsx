
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CommunicationFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedClasse: string;
  onClasseChange: (classe: string) => void;
  selectedAnneeScolaire: string;
  onAnneeScolaireChange: (annee: string) => void;
}

export function CommunicationFilter({
  searchTerm,
  onSearchChange,
  selectedClasse,
  onClasseChange,
  selectedAnneeScolaire,
  onAnneeScolaireChange
}: CommunicationFilterProps) {
  const classes = ["TPS", "PS", "MS", "GS"];
  
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

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Recherche par nom/prénom */}
      <div className="relative flex-1 md:max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un enfant..."
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
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
