
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Date de début</label>
        <DatePicker date={startDate} onDateChange={onStartDateChange} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Date de fin</label>
        <DatePicker date={endDate} onDateChange={onEndDateChange} />
      </div>
    </div>
  );
}
