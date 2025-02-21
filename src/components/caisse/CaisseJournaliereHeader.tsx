
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface CaisseJournaliereHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onPrint?: () => void;
}

export function CaisseJournaliereHeader({
  searchTerm,
  onSearchChange,
  onPrint
}: CaisseJournaliereHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-5">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Caisse Journalière</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="no-print"
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
}
