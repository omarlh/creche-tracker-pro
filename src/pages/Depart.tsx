
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Depart() {
  return (
    <SidebarProvider>
      <div className="grid lg:grid-cols-5 min-h-screen w-full">
        <AppSidebar />
        <div className="col-span-4 p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Départ</h2>
              <p className="text-muted-foreground">
                Gérez les départs des enfants de l'établissement
              </p>
            </div>
            <Separator />
            <div className="mt-6">
              {/* Contenu à venir */}
              <p>Cette fonctionnalité sera bientôt disponible.</p>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
