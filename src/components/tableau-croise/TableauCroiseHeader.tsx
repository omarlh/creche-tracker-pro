
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet } from "lucide-react";
import { EnfantSearchBar } from "@/components/enfants/search/EnfantSearchBar";
import type { Classe } from "@/types/enfant.types";

interface TableauCroiseHeaderProps {
  selectedAnneeScolaire: string;
  setSelectedAnneeScolaire: (annee: string) => void;
  selectedClasse: string;
  setSelectedClasse: (classe: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onPrint: () => void;
  onExportExcel: () => void;
  classes: Classe[];
}

export function TableauCroiseHeader({
  selectedAnneeScolaire,
  setSelectedAnneeScolaire,
  selectedClasse,
  setSelectedClasse,
  searchTerm,
  setSearchTerm,
  onPrint,
  onExportExcel,
  classes,
}: TableauCroiseHeaderProps) {
  const genererAnnesScolaires = () => {
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Suivi des Paiements Annuels par Enfant
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Année scolaire:</span>
            <Select value={selectedAnneeScolaire} onValueChange={setSelectedAnneeScolaire}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                {genererAnnesScolaires().map((annee) => (
                  <SelectItem key={annee} value={annee}>
                    {annee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Classe:</span>
            <Select value={selectedClasse} onValueChange={setSelectedClasse}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une classe" />
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
          <div className="flex items-center gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={onPrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="outline" size="sm" onClick={onExportExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exporter Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <EnfantSearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      </div>
    </div>
  );
}
