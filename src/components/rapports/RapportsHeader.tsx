
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RapportsHeaderProps {
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (date: string) => void;
  onDateFinChange: (date: string) => void;
  onExport: () => void;
  titre: string;
}

export function RapportsHeader({ 
  dateDebut, 
  dateFin, 
  onDateDebutChange, 
  onDateFinChange,
  onExport,
  titre
}: RapportsHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{titre}</h2>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">{titre}</h1>
          <Button onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Date début inscription</Label>
            <Input
              type="date"
              value={dateDebut}
              onChange={(e) => onDateDebutChange(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label className="mb-2 block">Date fin inscription</Label>
            <Input
              type="date"
              value={dateFin}
              onChange={(e) => onDateFinChange(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

