
import React from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { CaisseJournaliereTableau } from "@/components/caisse/CaisseJournaliereTableau";

export default function CaisseJournaliere() {
  return (
    <div className="grid lg:grid-cols-5 min-h-screen w-full">
      <AppSidebar />
      <div className="col-span-4 bg-background overflow-y-auto">
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Caisse Journalière</h1>
            <CaisseJournaliereTableau />
          </div>
        </div>
      </div>
    </div>
  );
}
