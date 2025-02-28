
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface MoisConcerneSelectProps {
  moisConcerne: string;
  onMoisConcerneChange: (date: string) => void;
}

export const MoisConcerneSelect = ({ moisConcerne, onMoisConcerneChange }: MoisConcerneSelectProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("01");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  // Generate options for years (current year - 2 to current year + 5)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 10; i++) {
      years.push(i.toString());
    }
    return years;
  };

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

  // Initialize with existing date if available
  useEffect(() => {
    if (moisConcerne && moisConcerne.includes("-")) {
      try {
        const dateParts = moisConcerne.split("-");
        if (dateParts.length >= 2) {
          setSelectedYear(dateParts[0]);
          setSelectedMonth(dateParts[1]);
        }
      } catch (error) {
        console.error("Erreur de parsing de la date:", error);
      }
    }
  }, [moisConcerne]);

  // Update parent component when month or year changes
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    const newDate = `${selectedYear}-${value}-01`;
    onMoisConcerneChange(newDate);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    const newDate = `${value}-${selectedMonth}-01`;
    onMoisConcerneChange(newDate);
  };

  return (
    <div className="space-y-2">
      <Label>Mois concerné</Label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
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
        </div>
        <div>
          <Select value={selectedYear} onValueChange={handleYearChange}>
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
