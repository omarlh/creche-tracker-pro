
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PaiementSearchBarProps {
  searchTerm: string;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  handleSearch: (term: string) => void;
}

export const PaiementSearchBar = ({
  searchTerm,
  isSearchFocused,
  setIsSearchFocused,
  handleSearch,
}: PaiementSearchBarProps) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
      <Input
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Rechercher un paiement par nom de l'enfant..."
        className="pl-10 pr-10"
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
      />
      {searchTerm && isSearchFocused && (
        <Button
          onClick={() => handleSearch("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
