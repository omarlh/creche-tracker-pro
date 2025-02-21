
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CaisseJournaliereHeader } from "@/components/caisse/CaisseJournaliereHeader";
import { CaisseJournaliereTableau } from "@/components/caisse/CaisseJournaliereTableau";

const CaisseJournaliere = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handlePrint = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-content, .print-content * {
          visibility: visible;
        }
        .print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    window.print();

    document.head.removeChild(style);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <AppSidebar />
        <main className="flex-1 p-8 animate-fadeIn">
          <div className="max-w-6xl mx-auto">
            <CaisseJournaliereHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onPrint={handlePrint}
            />
            <CaisseJournaliereTableau searchTerm={searchTerm} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CaisseJournaliere;
