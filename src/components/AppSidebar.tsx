
import { Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { buttonVariants } from "@/components/ui/button";
import { 
  CalendarDays, 
  Home, 
  Users, 
  CreditCard,
  LogOut,
  BarChart,
  Clock,
  Power
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { toast } from "sonner";

export const AppSidebar = () => {
  const { saveEnfants } = useEnfantStore();
  const { savePaiements } = usePaiementStore();

  const handleQuit = async () => {
    try {
      // Sauvegarde des données
      await Promise.all([
        saveEnfants(),
        savePaiements()
      ]);
      
      toast.success("Données sauvegardées avec succès");
      
      // Fermeture de l'application après une courte pause
      setTimeout(() => {
        window.close();
      }, 1000);
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde des données");
      console.error("Erreur de sauvegarde:", error);
    }
  };

  return (
    <Sidebar className="h-screen md:block">
      <SidebarContent>
        <div className="space-y-1">
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2"
            )}
          >
            <Home size={16} />
            Tableau de bord
          </Link>
          <Link
            to="/enfants"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2"
            )}
          >
            <Users size={16} />
            Enfants
          </Link>
          <Link
            to="/paiements"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2"
            )}
          >
            <CreditCard size={16} />
            Paiements
          </Link>
          <Link
            to="/liste-annuelle"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2"
            )}
          >
            <CalendarDays size={16} />
            Liste Annuelle
          </Link>
          <Link
            to="/retards"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2"
            )}
          >
            <Clock size={16} />
            Retards de Paiement
          </Link>
          <Link
            to="/depart"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2"
            )}
          >
            <LogOut size={16} />
            Départs
          </Link>
          <Link
            to="/rapports"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2"
            )}
          >
            <BarChart size={16} />
            Rapports
          </Link>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t">
        <button
          onClick={handleQuit}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          )}
        >
          <Power size={16} />
          Quitter l'application
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};
