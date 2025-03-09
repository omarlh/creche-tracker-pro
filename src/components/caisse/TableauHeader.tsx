
import { DatePicker } from "@/components/ui/date-picker";

export interface TableauHeaderProps {
  startDate: Date;
  endDate: Date; 
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}

export function TableauHeader({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: TableauHeaderProps) {
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      onStartDateChange(date);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      onEndDateChange(date);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Date début</label>
        <DatePicker 
          date={startDate} 
          onDateChange={handleStartDateChange} 
          placeholder="Date du"
          className="bg-white dark:bg-slate-950"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Date fin</label>
        <DatePicker 
          date={endDate} 
          onDateChange={handleEndDateChange}
          placeholder="Date au" 
          className="bg-white dark:bg-slate-950"
        />
      </div>
    </div>
  );
}
