
import React, { useState } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { CaisseJournaliereTableau } from "@/components/caisse/CaisseJournaliereTableau";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { CaisseWhatsAppButton } from "@/components/caisse/CaisseWhatsAppButton";

export default function CaisseJournaliere() {
  const [totalJour, setTotalJour] = useState(0);

  const handleTotalUpdate = (total: number) => {
    setTotalJour(total);
  };

  return (
    <div className="grid lg:grid-cols-5 min-h-screen w-full">
      <AppSidebar />
      <div className="col-span-4 bg-background overflow-y-auto">
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Caisse Journalière</h1>
              <div className="flex gap-2">
                <CaisseWhatsAppButton totalJour={totalJour} />
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
              </div>
            </div>
            <CaisseJournaliereTableau onTotalUpdate={handleTotalUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}
