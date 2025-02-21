
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EnfantSearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const EnfantSearchBar = ({ searchTerm, onSearch }: EnfantSearchBarProps) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
      <Input
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Rechercher un enfant..."
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <button
          onClick={() => onSearch("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

