
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6">Tableau de bord</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Total enfants inscrits</h2>
                <p className="text-2xl font-semibold text-primary">24</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Paiements du mois</h2>
                <p className="text-2xl font-semibold text-success">18 450 €</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Retards de paiement</h2>
                <p className="text-2xl font-semibold text-destructive">3</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
