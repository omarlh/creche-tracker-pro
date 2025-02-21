
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CaisseJournaliereHeader } from "@/components/caisse/CaisseJournaliereHeader";
import { CaisseJournaliereTableau } from "@/components/caisse/CaisseJournaliereTableau";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const CaisseJournaliere = () => {
  const [dateSelectionnee, setDateSelectionnee] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const { toast } = useToast();

  const handleEdit = (id: number) => {
    // Handle edit action
    toast({
      title: "Modification",
      description: `Modification du paiement ${id}`,
    });
  };

  const handleDelete = (id: number) => {
    // Handle delete action
    toast({
      title: "Suppression",
      description: `Suppression du paiement ${id}`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">
                Caisse Journalière
              </h1>
            </div>

            <CaisseJournaliereHeader 
              dateSelectionnee={dateSelectionnee}
              onDateChange={setDateSelectionnee}
            />

            <CaisseJournaliereTableau 
              dateSelectionnee={dateSelectionnee}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CaisseJournaliere;

