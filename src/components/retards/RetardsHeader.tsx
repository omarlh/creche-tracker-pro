
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface RetardsHeaderProps {
  filtreStatus: string;
  setFiltreStatus: (value: string) => void;
  filtreDelai: string;
  setFiltreDelai: (value: string) => void;
  filtreClasse: string;
  setFiltreClasse: (value: string) => void;
  filtreAnnee: string;
  setFiltreAnnee: (value: string) => void;
}

export function RetardsHeader({
  filtreStatus,
  setFiltreStatus,
  filtreDelai,
  setFiltreDelai,
  filtreClasse,
  setFiltreClasse,
  filtreAnnee,
  setFiltreAnnee,
}: RetardsHeaderProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Retards de Paiement
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Select
          value={filtreAnnee}
          onValueChange={setFiltreAnnee}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Année scolaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-2025">2024-2025</SelectItem>
            <SelectItem value="2023-2024">2023-2024</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filtreClasse}
          onValueChange={setFiltreClasse}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toutes">Toutes les classes</SelectItem>
            <SelectItem value="TPS">TPS</SelectItem>
            <SelectItem value="PS">PS</SelectItem>
            <SelectItem value="MS">MS</SelectItem>
            <SelectItem value="GS">GS</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filtreStatus}
          onValueChange={setFiltreStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les statuts</SelectItem>
            <SelectItem value="à jour">À jour</SelectItem>
            <SelectItem value="en retard">En retard</SelectItem>
            <SelectItem value="critique">Critique</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filtreDelai}
          onValueChange={setFiltreDelai}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Délai" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les délais</SelectItem>
            <SelectItem value="moins30">Moins de 30 jours</SelectItem>
            <SelectItem value="30a60">30 à 60 jours</SelectItem>
            <SelectItem value="plus60">Plus de 60 jours</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
