
import { Calendar, User } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { type Enfant } from "@/data/enfants";

interface PaiementFiltersProps {
  selectedEnfant: string;
  onEnfantChange: (value: string) => void;
  selectedStartDate: string;
  selectedEndDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  enfants: Enfant[];
}

const months = [
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    years.push(i.toString());
  }
  return years;
};

export const PaiementFilters = ({
  selectedEnfant,
  selectedStartDate,
  selectedEndDate,
  onEnfantChange,
  onStartDateChange,
  onEndDateChange,
  enfants,
}: PaiementFiltersProps) => {
  const startDate = new Date(selectedStartDate);
  const endDate = new Date(selectedEndDate);
  
  const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
  const startYear = startDate.getFullYear().toString();
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
  const endYear = endDate.getFullYear().toString();

  const handleStartMonthChange = (month: string) => {
    const newDate = new Date(startDate);
    newDate.setMonth(parseInt(month) - 1);
    onStartDateChange(newDate.toISOString().split('T')[0]);
  };

  const handleStartYearChange = (year: string) => {
    const newDate = new Date(startDate);
    newDate.setFullYear(parseInt(year));
    onStartDateChange(newDate.toISOString().split('T')[0]);
  };

  const handleEndMonthChange = (month: string) => {
    const newDate = new Date(endDate);
    newDate.setMonth(parseInt(month) - 1);
    onEndDateChange(newDate.toISOString().split('T')[0]);
  };

  const handleEndYearChange = (year: string) => {
    const newDate = new Date(endDate);
    newDate.setFullYear(parseInt(year));
    onEndDateChange(newDate.toISOString().split('T')[0]);
  };

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

      <div className="flex-1 space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date de début
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Select value={startMonth} onValueChange={handleStartMonthChange}>
            <SelectTrigger>
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={startYear} onValueChange={handleStartYearChange}>
            <SelectTrigger>
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {generateYearOptions().map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date de fin
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Select value={endMonth} onValueChange={handleEndMonthChange}>
            <SelectTrigger>
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={endYear} onValueChange={handleEndYearChange}>
            <SelectTrigger>
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {generateYearOptions().map((year) => (
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
