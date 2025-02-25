
import { Calendar, User } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { type Enfant } from "@/data/enfants";

interface PaiementFiltersProps {
  selectedEnfant: string;
  onEnfantChange: (value: string) => void;
  selectedStartMonth: string;
  selectedStartYear: string;
  selectedEndMonth: string;
  selectedEndYear: string;
  onStartMonthChange: (value: string) => void;
  onStartYearChange: (value: string) => void;
  onEndMonthChange: (value: string) => void;
  onEndYearChange: (value: string) => void;
  enfants: Enfant[];
}

const months = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12"
];

const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());

const monthNames: { [key: string]: string } = {
  "01": "Janvier",
  "02": "Février",
  "03": "Mars",
  "04": "Avril",
  "05": "Mai",
  "06": "Juin",
  "07": "Juillet",
  "08": "Août",
  "09": "Septembre",
  "10": "Octobre",
  "11": "Novembre",
  "12": "Décembre"
};

export const PaiementFilters = ({
  selectedEnfant,
  selectedStartMonth,
  selectedStartYear,
  selectedEndMonth,
  selectedEndYear,
  onEnfantChange,
  onStartMonthChange,
  onStartYearChange,
  onEndMonthChange,
  onEndYearChange,
  enfants,
}: PaiementFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
      <div className="flex-1">
        <Label className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4" />
          Filtrer par enfant
        </Label>
        <Select value={selectedEnfant} onValueChange={onEnfantChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les enfants" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les enfants</SelectItem>
            {enfants.map((enfant) => (
              <SelectItem key={enfant.id} value={enfant.id.toString()}>
                {enfant.prenom} {enfant.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4" />
          Date de début
        </Label>
        <div className="flex gap-2">
          <Select value={selectedStartMonth} onValueChange={onStartMonthChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {monthNames[month]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStartYear} onValueChange={onStartYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1">
        <Label className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4" />
          Date de fin
        </Label>
        <div className="flex gap-2">
          <Select value={selectedEndMonth} onValueChange={onEndMonthChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {monthNames[month]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedEndYear} onValueChange={onEndYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
