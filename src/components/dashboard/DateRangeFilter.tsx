
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface DateRangeFilterProps {
  onReset: () => void;
  isLoading: boolean;
}

export function DateRangeFilter({
  onReset,
  isLoading
}: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="outline" 
        size="icon"
        onClick={onReset}
        disabled={isLoading}
        className="h-10 bg-white dark:bg-slate-950"
        title="Réinitialiser les filtres"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
