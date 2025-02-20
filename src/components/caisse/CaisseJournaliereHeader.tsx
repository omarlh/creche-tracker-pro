
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CaisseJournaliereHeaderProps {
  dateSelectionnee: string;
  onDateChange: (date: string) => void;
}

export const CaisseJournaliereHeader = ({
  dateSelectionnee,
  onDateChange,
}: CaisseJournaliereHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <div className="w-64">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={dateSelectionnee}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
